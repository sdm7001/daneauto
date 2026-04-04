import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";

const BATCH_SIZE = 500;

interface ProductRow {
  sku: string;
  description?: string | null;
  list_price?: number | null;
  net_price?: number | null;
  oem_number?: string | null;
  partslink_number?: string | null;
  image_url?: string | null;
  certification?: string | null;
  year: string;
  make: string;
  model: string;
  product_line: string;
  scraped_at?: string | null;
}

function parseJsonl(text: string): ProductRow[] {
  const rows: ProductRow[] = [];
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const p = JSON.parse(trimmed);
      rows.push({
        sku: p.sku,
        description: p.description ?? null,
        list_price: p.listPrice ?? p.list_price ?? null,
        net_price: p.netPrice ?? p.net_price ?? null,
        oem_number: p.oemNumber ?? p.oem_number ?? null,
        partslink_number: p.partslinkNumber ?? p.partslink_number ?? null,
        image_url: p.imageUrl ?? p.image_url ?? null,
        certification: p.certification ?? null,
        year: String(p.year),
        make: p.make,
        model: p.model,
        product_line: p.productLine ?? p.product_line,
        scraped_at: p.scrapedAt ?? p.scraped_at ?? null,
      });
    } catch {
      // skip malformed lines
    }
  }
  return rows;
}

function parseCsv(text: string): ProductRow[] {
  const lines = text.split("\n");
  if (lines.length < 2) return [];

  const headerLine = lines[0].trim();
  const headers = headerLine.split(",").map((h) => h.trim().toLowerCase().replace(/"/g, ""));

  const rows: ProductRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Simple CSV parse (doesn't handle quoted commas — fine for this data)
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
    const obj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      obj[h] = values[idx] ?? "";
    });

    const toNum = (v: string) => {
      if (!v || v === "null" || v === "") return null;
      const n = parseFloat(v);
      return isNaN(n) ? null : n;
    };
    const toStr = (v: string) => (!v || v === "null" || v === "" ? null : v);

    rows.push({
      sku: obj.sku || "",
      description: toStr(obj.description),
      list_price: toNum(obj.list_price || obj.listprice || ""),
      net_price: toNum(obj.net_price || obj.netprice || ""),
      oem_number: toStr(obj.oem_number || obj.oemnumber || ""),
      partslink_number: toStr(obj.partslink_number || obj.partslinknumber || ""),
      image_url: toStr(obj.image_url || obj.imageurl || ""),
      certification: toStr(obj.certification),
      year: obj.year || "",
      make: obj.make || "",
      model: obj.model || "",
      product_line: obj.product_line || obj.productline || "",
      scraped_at: toStr(obj.scraped_at || obj.scrapedat || ""),
    });
  }
  return rows;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Auth check — admin only
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub as string;

    // Check admin role
    const adminClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: roleData } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the upload
    const contentType = req.headers.get("content-type") || "";
    let rows: ProductRow[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return new Response(JSON.stringify({ error: "No file provided" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await file.text();
      const name = file.name.toLowerCase();
      rows = name.endsWith(".csv") ? parseCsv(text) : parseJsonl(text);
    } else {
      // Raw body — check format query param
      const url = new URL(req.url);
      const format = url.searchParams.get("format") || "jsonl";
      const text = await req.text();
      rows = format === "csv" ? parseCsv(text) : parseJsonl(text);
    }

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: "No valid rows found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate required fields
    const valid = rows.filter((r) => r.sku && r.year && r.make && r.model && r.product_line);
    const skipped = rows.length - valid.length;

    // Insert in batches
    let inserted = 0;
    let errors = 0;
    const errorMessages: string[] = [];

    for (let i = 0; i < valid.length; i += BATCH_SIZE) {
      const batch = valid.slice(i, i + BATCH_SIZE);
      const { error } = await adminClient.from("products").insert(batch);
      if (error) {
        errors++;
        if (errorMessages.length < 3) {
          errorMessages.push(`Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${error.message}`);
        }
      } else {
        inserted += batch.length;
      }
    }

    return new Response(
      JSON.stringify({
        inserted,
        skipped,
        failed_batches: errors,
        total_rows: rows.length,
        ...(errorMessages.length > 0 && { errors: errorMessages }),
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
