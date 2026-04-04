-- ============================================================
-- Dane Auto Parts — Full DB Fix Script
-- Run this once in Supabase SQL Editor (ujewsjvaofhfrfqdqphn)
-- ============================================================

-- STEP 1: Fix bogus net_price placeholder
UPDATE public.products SET net_price = NULL WHERE net_price = 1234.44;

-- STEP 2: Add missing columns
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS category       TEXT,
  ADD COLUMN IF NOT EXISTS subcategory    TEXT,
  ADD COLUMN IF NOT EXISTS condition      TEXT,    -- 'new' or 'minor_damage'
  ADD COLUMN IF NOT EXISTS image_verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS data_source    TEXT DEFAULT 'apt.partsordering.com';

CREATE INDEX IF NOT EXISTS idx_products_category    ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory);

-- STEP 3: Normalize product_line — fix typos and merge duplicates
UPDATE public.products SET product_line = 'WINDSHIELD'              WHERE product_line IN ('Windshield', 'WINDSHEILD');
UPDATE public.products SET product_line = 'HEADER PANEL'            WHERE product_line IN ('Header panel', 'HEADER PANELAR');
UPDATE public.products SET product_line = 'PARTSLINK'               WHERE product_line = 'Partslink';
UPDATE public.products SET product_line = 'ENGINE COVER'            WHERE product_line = 'Lower engine cover';
UPDATE public.products SET product_line = 'COOLING'                 WHERE product_line IN ('SOUL', 'Radiator cooling fan assy');
UPDATE public.products SET product_line = 'FRONT BUMPER COMPONENTS' WHERE product_line IN ('Bumper', 'Front bumper energy absorber');
UPDATE public.products SET product_line = 'LIGHTING'                WHERE product_line IN ('RT Taillamp assy', 'Lamp');

-- Tag minor-damage items then merge into canonical product lines
UPDATE public.products SET condition = 'minor_damage' WHERE product_line LIKE 'MINOR- DAMAGED-%';
UPDATE public.products SET product_line = 'GRILLE'                   WHERE product_line = 'MINOR- DAMAGED- GRILLE';
UPDATE public.products SET product_line = 'QUARTER PANEL / BOX SIDE' WHERE product_line = 'MINOR- DAMAGED- QUARTER PANEL / BOX SIDE';
UPDATE public.products SET product_line = 'TAILGATE'                 WHERE product_line = 'MINOR- DAMAGED- TAILGATE';

-- STEP 4: Populate category
UPDATE public.products SET category = CASE
  WHEN product_line IN ('FRONT BUMPER COMPONENTS','FRONT BUMPER','REAR BUMPER COMPONENTS','REAR BUMPER',
    'FENDER','HOOD','GRILLE','REPAIR PANELS','QUARTER PANEL / BOX SIDE','DOOR','TAILGATE',
    'WINDSHIELD','HEADER PANEL','REAR BODY PANEL','TRUNK LID','MIRROR') THEN 'Body & Exterior'
  WHEN product_line IN ('LIGHTING','CAMERA') THEN 'Lighting'
  WHEN product_line IN ('COOLING','RADIATOR SUPPORT','ENGINE COVER') THEN 'Cooling System'
  WHEN product_line IN ('SUSPENSION','WHEEL','Engine crossmember') THEN 'Suspension'
  WHEN product_line = 'EXHAUST' THEN 'Exhaust'
  WHEN product_line = 'AIR CLEANER' THEN 'Air Intake'
  WHEN product_line LIKE 'MINOR- DAMAGED-%' THEN 'Clearance / Damaged'
  ELSE 'Body & Exterior'
END;

-- STEP 5: Populate subcategory
UPDATE public.products SET subcategory = CASE
  WHEN product_line IN ('FRONT BUMPER','FRONT BUMPER COMPONENTS') THEN 'Front Bumper'
  WHEN product_line IN ('REAR BUMPER','REAR BUMPER COMPONENTS')   THEN 'Rear Bumper'
  WHEN product_line = 'FENDER'                   THEN 'Fenders'
  WHEN product_line = 'HOOD'                     THEN 'Hood & Components'
  WHEN product_line = 'GRILLE'                   THEN 'Grille & Components'
  WHEN product_line IN ('REPAIR PANELS','REAR BODY PANEL') THEN 'Structural Panels'
  WHEN product_line = 'QUARTER PANEL / BOX SIDE' THEN 'Quarter Panels'
  WHEN product_line = 'DOOR'                     THEN 'Doors & Components'
  WHEN product_line = 'TAILGATE'                 THEN 'Tailgate'
  WHEN product_line = 'WINDSHIELD'               THEN 'Windshield & Washer'
  WHEN product_line = 'HEADER PANEL'             THEN 'Front End'
  WHEN product_line = 'TRUNK LID'                THEN 'Trunk & Liftgate'
  WHEN product_line = 'MIRROR'                   THEN 'Side Mirrors'
  WHEN product_line = 'LIGHTING'                 THEN 'Lighting'
  WHEN product_line = 'CAMERA'                   THEN 'Cameras'
  WHEN product_line IN ('COOLING','ENGINE COVER') THEN 'Radiators & Cooling'
  WHEN product_line = 'RADIATOR SUPPORT'         THEN 'Radiator Support'
  WHEN product_line = 'SUSPENSION'               THEN 'Suspension Components'
  WHEN product_line = 'WHEEL'                    THEN 'Wheels'
  WHEN product_line = 'Engine crossmember'       THEN 'Structural'
  WHEN product_line = 'EXHAUST'                  THEN 'Exhaust'
  WHEN product_line = 'AIR CLEANER'              THEN 'Air Intake'
  WHEN product_line LIKE 'MINOR- DAMAGED-%'      THEN 'Discounted / Clearance'
  ELSE product_line
END;

-- Verify results
SELECT category, COUNT(*) as count
FROM public.products
GROUP BY category
ORDER BY count DESC;
