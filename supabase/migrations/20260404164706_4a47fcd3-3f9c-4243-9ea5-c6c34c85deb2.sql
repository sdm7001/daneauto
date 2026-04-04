CREATE OR REPLACE FUNCTION public.get_vehicle_product_lines(p_year text, p_make text, p_model text, p_limit integer DEFAULT 8)
RETURNS TABLE(product_line text, count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT p.product_line, COUNT(*) AS count
  FROM public.products p
  WHERE p.year = p_year AND p.make = p_make AND p.model = p_model
  GROUP BY p.product_line
  ORDER BY count DESC
  LIMIT p_limit;
$$;