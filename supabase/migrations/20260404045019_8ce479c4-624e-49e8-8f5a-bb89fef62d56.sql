
DROP INDEX IF EXISTS public.idx_products_search;
DROP EXTENSION IF EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS pg_trgm SCHEMA extensions;

CREATE INDEX idx_products_search ON public.products USING gin (
  (coalesce(description,'') || ' ' || coalesce(sku,'') || ' ' || coalesce(oem_number,'') || ' ' || coalesce(partslink_number,'')) extensions.gin_trgm_ops
);
