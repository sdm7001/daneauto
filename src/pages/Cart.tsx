import { useState } from "react";
import { Link } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Cart = () => {
  usePageTitle("Cart");
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const shipping = total >= 75 ? 0 : 9.99;
  const tax = total * 0.13; // HST
  const orderTotal = total + shipping + tax;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout-session", {
        body: {
          items: items.map((i) => ({
            id: i.id,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image || undefined,
          })),
          userId: user?.id ?? null,
          successUrl: `${window.location.origin}/order-success`,
          cancelUrl: `${window.location.origin}/cart`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error(err);
      toast.error("Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-muted-foreground mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">
            Looks like you haven't added any parts yet.
          </p>
          <Link to="/shop">
            <Button variant="hero" size="lg">Start Shopping</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/shop">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="font-display text-3xl font-bold">
            Shopping <span className="text-primary">Cart</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-gradient-card rounded-xl border border-border p-4 flex gap-4">
                <div className="w-20 h-20 rounded-lg bg-secondary/30 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <ShoppingBag className="w-8 h-8 text-muted-foreground/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-primary font-display uppercase tracking-wider mb-1">{item.category}</p>
                  <h3 className="font-semibold text-sm line-clamp-2">{item.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">SKU: {item.id}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                      <Button variant="outline" size="icon" className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => removeItem(item.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="ghost" onClick={clearCart} className="text-destructive text-sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-card rounded-xl border border-border p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0
                      ? <span className="text-green-400">Free</span>
                      : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground text-sm">
                  <span>HST (13%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between font-display text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">${orderTotal.toFixed(2)} CAD</span>
                  </div>
                </div>
              </div>

              {total < 75 && (
                <p className="text-xs text-muted-foreground mb-4 bg-primary/10 rounded-lg px-3 py-2">
                  Add <span className="text-primary font-semibold">${(75 - total).toFixed(2)}</span> more for free shipping
                </p>
              )}

              <Button
                variant="hero"
                size="xl"
                className="w-full"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Redirecting...</>
                ) : (
                  <><Lock className="w-4 h-4 mr-2" /> Secure Checkout</>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" />
                Powered by Stripe · SSL encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
