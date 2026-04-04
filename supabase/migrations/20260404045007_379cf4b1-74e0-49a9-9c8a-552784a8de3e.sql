
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE public.products (
  id BIGSERIAL PRIMARY KEY,
  sku TEXT NOT NULL,
  description TEXT,
  list_price NUMERIC,
  net_price NUMERIC,
  oem_number TEXT,
  partslink_number TEXT,
  image_url TEXT,
  certification TEXT,
  year TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  product_line TEXT NOT NULL,
  scraped_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_products_sku ON public.products (sku);
CREATE INDEX idx_products_year_make_model ON public.products (year, make, model);
CREATE INDEX idx_products_product_line ON public.products (product_line);
CREATE INDEX idx_products_search ON public.products USING gin (
  (coalesce(description,'') || ' ' || coalesce(sku,'') || ' ' || coalesce(oem_number,'') || ' ' || coalesce(partslink_number,'')) gin_trgm_ops
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are publicly readable"
ON public.products FOR SELECT
USING (true);

CREATE OR REPLACE FUNCTION public.get_vehicle_years()
RETURNS TABLE(year TEXT)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT DISTINCT p.year FROM public.products p ORDER BY p.year DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_vehicle_makes(p_year TEXT)
RETURNS TABLE(make TEXT)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT DISTINCT p.make FROM public.products p WHERE p.year = p_year ORDER BY p.make;
$$;

CREATE OR REPLACE FUNCTION public.get_vehicle_models(p_year TEXT, p_make TEXT)
RETURNS TABLE(model TEXT)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT DISTINCT p.model FROM public.products p WHERE p.year = p_year AND p.make = p_make ORDER BY p.model;
$$;

CREATE OR REPLACE FUNCTION public.get_product_lines(p_year TEXT, p_make TEXT, p_model TEXT)
RETURNS TABLE(product_line TEXT)
LANGUAGE sql STABLE
SET search_path = public
AS $$
  SELECT DISTINCT p.product_line FROM public.products p WHERE p.year = p_year AND p.make = p_make AND p.model = p_model ORDER BY p.product_line;
$$;
