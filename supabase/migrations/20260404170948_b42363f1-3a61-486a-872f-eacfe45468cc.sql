DROP FUNCTION IF EXISTS public.get_vehicle_product_lines(text,text,text,integer);

CREATE FUNCTION public.get_vehicle_product_lines(p_year text, p_make text, p_model text, p_limit integer DEFAULT 8)
RETURNS TABLE(product_line text, count bigint, sample_image text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT 
    p.product_line, 
    COUNT(*) AS count,
    (SELECT p2.image_url FROM public.products p2 
     WHERE p2.year = p_year AND p2.make = p_make AND p2.model = p_model 
       AND p2.product_line = p.product_line AND p2.image_url IS NOT NULL 
     LIMIT 1) AS sample_image
  FROM public.products p
  WHERE p.year = p_year AND p.make = p_make AND p.model = p_model
  GROUP BY p.product_line
  ORDER BY count DESC
  LIMIT p_limit;
$$;