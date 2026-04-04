import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/hooks/useWishlist";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/hooks/useProducts";
import PageBreadcrumb from "@/components/PageBreadcrumb";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any

const Wishlist = () => {
  usePageTitle("Wishlist");
  const { user, loading: authLoading } = useAuth();
  const { wishlistSkus, isLoading: wishlistLoading } = useWishlist();

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['wishlist-products', wishlistSkus],
    queryFn: async () => {
      if (!wishlistSkus.length) return [];
      const { data, error } = await db
        .from('products')
        .select('*')
        .in('sku', wishlistSkus)
        .limit(100);
      if (error) throw error;
      return (data as Product[]) ?? [];
    },
    enabled: wishlistSkus.length > 0,
  });

  const isLoading = authLoading || wishlistLoading || productsLoading;

  if (authLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center py-16">
        <div className="text-center max-w-md mx-auto px-4">
          <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="font-display text-2xl font-bold mb-2">Sign in to view your wishlist</h1>
          <p className="text-muted-foreground mb-6">
            Save your favorite parts and come back to them anytime.
          </p>
          <Link to="/account">
            <Button variant="hero" size="lg">Sign In</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <PageBreadcrumb segments={[{ label: "Wishlist" }]} className="mb-6" />
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">
              My <span className="text-primary">Wishlist</span>
            </h1>
            <p className="text-muted-foreground mt-1">
              {wishlistSkus.length} {wishlistSkus.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          <Link to="/shop">
            <Button variant="outline">
              <ShoppingBag className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gradient-card rounded-xl border border-border h-80 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-gradient-card rounded-xl border border-border p-12 text-center">
            <Heart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h2 className="font-display text-xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Browse our catalog and tap the heart icon on any product to save it here for later.
            </p>
            <Link to="/shop">
              <Button variant="hero" size="lg">Browse Parts</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.sku} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default Wishlist;
