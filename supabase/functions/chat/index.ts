import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, contactInfo, conversationId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Create or update conversation in DB
    let convId = conversationId;
    if (!convId && contactInfo) {
      const { data: conv, error: convErr } = await supabase
        .from("chat_conversations")
        .insert({
          contact_name: contactInfo.name || "Unknown",
          contact_email: contactInfo.email || "Unknown",
          contact_phone: contactInfo.phone || null,
          messages: JSON.stringify(messages),
        })
        .select("id")
        .single();
      if (!convErr && conv) convId = conv.id;
    } else if (convId) {
      await supabase
        .from("chat_conversations")
        .update({ messages: JSON.stringify(messages) })
        .eq("id", convId);
    }

    // Search products
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === "user")?.content ?? "";
    let productContext = "";

    if (lastUserMsg.length >= 2) {
      const searchTerms = lastUserMsg.replace(/[^\w\s]/g, "").trim();
      if (searchTerms) {
        const { data: products } = await supabase
          .from("products")
          .select("sku, description, product_line, make, model, year, list_price, image_url")
          .or(
            `description.ilike.%${searchTerms}%,sku.ilike.%${searchTerms}%,oem_number.ilike.%${searchTerms}%,partslink_number.ilike.%${searchTerms}%,product_line.ilike.%${searchTerms}%`
          )
          .limit(10);

        if (products && products.length > 0) {
          productContext = `\n\nHere are matching products from our inventory:\n${products
            .map(
              (p: any) =>
                `- SKU: ${p.sku} | ${p.description ?? p.product_line} | ${p.year} ${p.make} ${p.model} | Price: ${p.list_price ? "$" + p.list_price : "Call for price"}`
            )
            .join("\n")}`;
        }
      }
    }

    const systemPrompt = `You are the Dane Auto Parts customer assistant. You help customers find auto parts for their vehicles.

Company info:
- Dane Auto Parts Ltd, 1000 Henry Ave, Winnipeg, MB R3E 3L2, Canada
- Phone: 1-(204) 599-4562 | Email: sales@daneauto.ca
- Hours: Mon–Fri 8 AM – 6 PM CT, Sat 9 AM – 4 PM CT

Customer contact info: Name: ${contactInfo?.name ?? "Unknown"}, Email: ${contactInfo?.email ?? "Unknown"}, Phone: ${contactInfo?.phone ?? "Not provided"}

Guidelines:
- Be friendly, concise, and helpful
- When showing products, mention the SKU, description, vehicle fitment, and price
- If no products match, suggest the customer call or email for assistance
- Direct customers to browse /shop for the full catalog
- For complex inquiries, suggest contacting sales@daneauto.ca or calling 1-(204) 599-4562
- Always mention the product SKU so customers can reference it${productContext}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "We're experiencing high traffic. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Service temporarily unavailable." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Chat service error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stream the response but also capture it for saving
    const { readable, writable } = new TransformStream();
    const writer = writable.getWriter();
    const reader = response.body!.getReader();
    let assistantContent = "";

    (async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          await writer.write(value);

          // Parse SSE to capture assistant content
          const text = new TextDecoder().decode(value);
          for (const line of text.split("\n")) {
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") continue;
            try {
              const parsed = JSON.parse(json);
              const c = parsed.choices?.[0]?.delta?.content;
              if (c) assistantContent += c;
            } catch { /* partial chunk */ }
          }
        }
      } finally {
        await writer.close();
        // Save final messages with assistant response
        if (convId && assistantContent) {
          const finalMessages = [...messages, { role: "assistant", content: assistantContent }];
          await supabase
            .from("chat_conversations")
            .update({ messages: JSON.stringify(finalMessages) })
            .eq("id", convId);
        }
      }
    })();

    return new Response(readable, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream", "X-Conversation-Id": convId || "" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
