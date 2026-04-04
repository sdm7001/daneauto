import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

const NotFound = () => {
  usePageTitle("Page Not Found");
  useEffect(() => {
    // Tell search engines not to index the 404 page
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <main className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-display text-8xl md:text-9xl font-bold text-primary mb-4">
          404
        </h1>
        <h2 className="font-display text-2xl md:text-3xl font-semibold mb-4">
          Page Not Found
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Looks like this part is out of stock! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/">
            <Button variant="hero" size="lg">
              <Home className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="outline" size="lg">
              <ShoppingBag className="w-4 h-4" />
              Browse Parts
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
