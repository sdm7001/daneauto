CREATE OR REPLACE FUNCTION public.get_vehicle_makes(p_year TEXT DEFAULT NULL)
RETURNS TABLE(make TEXT) LANGUAGE sql STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT DISTINCT p.make FROM public.products p
  WHERE (p_year IS NULL OR p.year = p_year) ORDER BY p.make;
$$;