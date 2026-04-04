-- Products catalog table
-- 319,910 products from apt.partsordering.com scrape (April 2026)

CREATE TABLE public.products (
  id          BIGSERIAL PRIMARY KEY,
  sku         TEXT NOT NULL,
  description TEXT,
  list_price  DECIMAL(10,2),
  net_price   DECIMAL(10,2),
  oem_number        TEXT,
  partslink_number  TEXT,
  image_url         TEXT,
  certification     TEXT,
  year         TEXT NOT NULL,
  make         TEXT NOT NULL,
  model        TEXT NOT NULL,
  product_line TEXT NOT NULL,
  scraped_at   TIMESTAMPTZ
);

-- Indexes for vehicle lookup and search
CREATE INDEX idx_products_vehicle    ON public.products(year, make, model);
CREATE INDEX idx_products_make       ON public.products(make);
CREATE INDEX idx_products_sku        ON public.products(sku);
CREATE INDEX idx_products_line       ON public.products(product_line);
CREATE INDEX idx_products_year       ON public.products(year);
CREATE INDEX idx_products_fts        ON public.products
  USING GIN(to_tsvector('english',
    COALESCE(description,'') || ' ' || sku || ' ' ||
    COALESCE(oem_number,'') || ' ' || COALESCE(partslink_number,'')
  ));

-- Row-level security: products are publicly readable
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (true);

-- ── RPC helpers for cascade vehicle dropdowns ────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_vehicle_years()
RETURNS TABLE(year TEXT)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT DISTINCT year FROM public.products ORDER BY year DESC;
$$;

CREATE OR REPLACE FUNCTION public.get_vehicle_makes(p_year TEXT DEFAULT NULL)
RETURNS TABLE(make TEXT)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT DISTINCT make
  FROM public.products
  WHERE (p_year IS NULL OR year = p_year)
  ORDER BY make;
$$;

CREATE OR REPLACE FUNCTION public.get_vehicle_models(p_year TEXT, p_make TEXT)
RETURNS TABLE(model TEXT)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT DISTINCT model
  FROM public.products
  WHERE year = p_year AND make = p_make
  ORDER BY model;
$$;

CREATE OR REPLACE FUNCTION public.get_product_lines(p_year TEXT, p_make TEXT, p_model TEXT)
RETURNS TABLE(product_line TEXT)
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT DISTINCT product_line
  FROM public.products
  WHERE year = p_year AND make = p_make AND model = p_model
  ORDER BY product_line;
$$;
