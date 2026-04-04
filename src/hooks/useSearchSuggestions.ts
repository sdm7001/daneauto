import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "./useProducts";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export interface SearchSuggestion {
  sku: string;
  description: string | null;
  product_line: string;
  make: string;
  model: string;
  year: string;
  list_price: number | null;
  image_url: string | null;
}

export function useSearchSuggestions(query: string, enabled = true) {
  const trimmed = query.trim();

  return useQuery<SearchSuggestion[]>({
    queryKey: ["search-suggestions", trimmed],
    queryFn: async () => {
      if (trimmed.length < 2) return [];

      const { data, error } = await db
        .from("products")
        .select("sku, description, product_line, make, model, year, list_price, image_url")
        .or(
          `description.ilike.%${trimmed}%,sku.ilike.%${trimmed}%,oem_number.ilike.%${trimmed}%,partslink_number.ilike.%${trimmed}%`
        )
        .limit(8);

      if (error) throw error;
      return (data as SearchSuggestion[]) ?? [];
    },
    enabled: enabled && trimmed.length >= 2,
    staleTime: 30_000,
    gcTime: 60_000,
  });
}
