import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const { clearCart } = useCart();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center py-16">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-green-400" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-2">
          Thank you for your order. We've received your payment and will process your parts right away.
        </p>
        {sessionId && (
          <p className="text-xs text-muted-foreground font-mono mb-8">
            Ref: {sessionId.slice(-12)}
          </p>
        )}
        <p className="text-sm text-muted-foreground mb-8">
          A confirmation email will be sent to you shortly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/shop">
            <Button variant="hero" size="lg">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
          <Link to="/account">
            <Button variant="outline" size="lg">
              View Orders
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;
