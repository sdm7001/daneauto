CREATE OR REPLACE FUNCTION public.get_subcategories(
  p_year text DEFAULT NULL,
  p_make text DEFAULT NULL,
  p_model text DEFAULT NULL,
  p_category text DEFAULT NULL
)
RETURNS TABLE(subcategory text, count bigint)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT p.subcategory, COUNT(*) AS count
  FROM public.products p
  WHERE (p_year IS NULL OR p.year = p_year)
    AND (p_make IS NULL OR p.make = p_make)
    AND (p_model IS NULL OR p.model = p_model)
    AND (p_category IS NULL OR p.category = p_category)
    AND p.subcategory IS NOT NULL
  GROUP BY p.subcategory
  ORDER BY count DESC;
$$;