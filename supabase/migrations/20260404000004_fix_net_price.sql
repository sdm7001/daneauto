-- Fix bogus net_price placeholder
-- The scraper set netPrice = 1234.44 for all 319,910 products as a default.
-- Net pricing is only visible to dealer accounts; list_price is the real public price.
-- NULL out the placeholder so the frontend falls back to list_price correctly.

UPDATE public.products
SET net_price = NULL
WHERE net_price = 1234.44;
