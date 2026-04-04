-- RPC to get top product lines by count (for homepage category grid)
CREATE OR REPLACE FUNCTION public.get_top_product_lines(p_limit INT DEFAULT 16)
RETURNS TABLE(product_line TEXT, count BIGINT)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT product_line, COUNT(*) AS count
  FROM public.products
  GROUP BY product_line
  ORDER BY count DESC
  LIMIT p_limit;
$$;
