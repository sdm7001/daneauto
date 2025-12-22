import { Link } from "react-router-dom";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
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
        <Link to="/">
          <Button variant="hero" size="lg">
            <Home className="w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
