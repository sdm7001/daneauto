import { useQuery } from "@tanstack/react-query";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { supabase } from "@/integrations/supabase/client";
import ProductCard from "./ProductCard";
import type { Product } from "@/hooks/useProducts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const RecentlyViewed = () => {
  const { skus } = useRecentlyViewed();

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["recently-viewed-products", skus],
    queryFn: async () => {
      if (!skus.length) return [];
      const { data, error } = await db
        .from("products")
        .select("*")
        .in("sku", skus)
        .limit(8);
      if (error) throw error;
      // Restore original browse order
      const map = new Map((data as Product[]).map((p) => [p.sku, p]));
      return skus.map((s) => map.get(s)).filter(Boolean) as Product[];
    },
    enabled: skus.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  if (products.length < 2) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">
          Recently <span className="text-primary">Viewed</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentlyViewed;
