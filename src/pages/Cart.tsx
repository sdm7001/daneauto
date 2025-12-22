import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const Cart = () => {
  const { items, updateQuantity, removeItem, total, clearCart } = useCart();

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
            <Button variant="hero" size="lg">
              Start Shopping
            </Button>
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
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-gradient-card rounded-xl border border-border p-4 flex gap-4"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg bg-secondary/30"
                />
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-lg">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {item.category}
                  </p>
                  <p className="text-primary font-bold mt-2">
                    ${item.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="ghost" onClick={clearCart} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-card rounded-xl border border-border p-6 sticky top-24">
              <h2 className="font-display text-xl font-bold mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{total >= 75 ? "Free" : "$9.99"}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (estimated)</span>
                  <span>${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between font-display text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">
                      ${(total + (total >= 75 ? 0 : 9.99) + total * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {total < 75 && (
                <p className="text-sm text-muted-foreground mb-4">
                  Add ${(75 - total).toFixed(2)} more for free shipping!
                </p>
              )}

              <Button variant="hero" size="xl" className="w-full">
                Proceed to Checkout
              </Button>
              
              <p className="text-xs text-muted-foreground text-center mt-4">
                Secure checkout powered by trusted payment providers
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cart;
