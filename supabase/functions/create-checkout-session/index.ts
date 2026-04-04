import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { items, successUrl, cancelUrl, userId } = await req.json();

    if (!items?.length) {
      return new Response(JSON.stringify({ error: "No items" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build Stripe line items
    const lineItems = items.map((item: {
      id: string; name: string; price: number; quantity: number; image?: string;
    }) => ({
      price_data: {
        currency: "cad",
        product_data: {
          name: item.name,
          metadata: { sku: item.id },
          ...(item.image ? { images: [item.image] } : {}),
        },
        unit_amount: Math.round(item.price * 100), // cents
      },
      quantity: item.quantity,
    }));

    // Create a pending order record (if user is logged in)
    let orderId: string | null = null;
    if (userId) {
      const subtotal = items.reduce(
        (s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0
      );
      const shipping = subtotal >= 75 ? 0 : 9.99;
      const tax = subtotal * 0.13; // HST

      const { data: order } = await supabase.from("orders").insert({
        user_id: userId,
        status: "pending",
        subtotal: subtotal.toFixed(2),
        shipping: shipping.toFixed(2),
        tax: tax.toFixed(2),
        total: (subtotal + shipping + tax).toFixed(2),
      }).select("id").single();

      if (order) {
        orderId = order.id;
        await supabase.from("order_items").insert(
          items.map((item: { id: string; name: string; price: number; quantity: number; image?: string }) => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            product_image: item.image ?? null,
            quantity: item.quantity,
            price: item.price.toFixed(2),
          }))
        );
      }
    }

    const subtotal = items.reduce(
      (s: number, i: { price: number; quantity: number }) => s + i.price * i.quantity, 0
    );
    const shippingCents = subtotal >= 75 ? 0 : 999; // cents

    // Add HST (13%) as a separate line item so Stripe Tax is not required
    const taxCents = Math.round(subtotal * 0.13 * 100);
    const taxLineItem = {
      price_data: {
        currency: "cad",
        product_data: { name: "HST (13%)" },
        unit_amount: taxCents,
      },
      quantity: 1,
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [...lineItems, taxLineItem],
      shipping_address_collection: { allowed_countries: ["CA", "US", "MX"] },
      shipping_options: [{
        shipping_rate_data: {
          type: "fixed_amount",
          fixed_amount: { amount: shippingCents, currency: "cad" },
          display_name: shippingCents === 0 ? "Free Shipping" : "Standard Shipping",
          delivery_estimate: {
            minimum: { unit: "business_day", value: 3 },
            maximum: { unit: "business_day", value: 7 },
          },
        },
      }],
      metadata: { orderId: orderId ?? "", userId: userId ?? "" },
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
    });

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
