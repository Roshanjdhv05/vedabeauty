-- ============================================================
-- VEDA BEAUTY — COMBO OFFER PRODUCTS
-- Run this in your Supabase SQL Editor
-- ============================================================
-- 
-- IMPORTANT: Before running, verify your brand IDs:
--   SELECT id, name FROM brands WHERE name IN 
--   ('Insight', 'Sugar Pop', 'Mars by GHC', 'Pilgrim');
--
-- Replace the brand_id UUIDs below if they differ in your DB.
-- ============================================================


-- ────────────────────────────────────────────────────────────
-- Step 1: Get actual brand IDs (run this SELECT first to verify)
-- ────────────────────────────────────────────────────────────
-- SELECT id, name, slug FROM brands
-- WHERE name IN ('Insight', 'Sugar Pop', 'Mars by GHC', 'Pilgrim')
-- ORDER BY name;


-- ────────────────────────────────────────────────────────────
-- Step 2: Add 'is_offer' flag column if it doesn't exist
-- (used by the /offers page to filter combo products)
-- ────────────────────────────────────────────────────────────
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_offer BOOLEAN DEFAULT false;


-- ────────────────────────────────────────────────────────────
-- Step 3: Upsert all 4 Combo Offer Products
-- ────────────────────────────────────────────────────────────

-- ── 1. INSIGHT COMBO OFFER ──────────────────────────────────
INSERT INTO products (
    id,
    name,
    description,
    brand_id,
    brand_name,
    category,
    mrp_price,
    selling_price,
    price,
    original_price,
    discount,
    image_url,
    has_variants,
    is_offer
) VALUES (
    'e1f8c14a-5f6b-4e1a-8c1d-9e2f3a4b5c6d',
    'Insight Combo Offer',
    'A curated professional combo — everything you need for a flawless look. Includes Primer, Foundation, Compact, Lip Liner, Eyeliner, and Fixer for the perfect finish. Bundled together for maximum savings.',
    -- Replace with actual Insight brand ID from your DB:
    (SELECT id FROM brands WHERE name = 'Insight' LIMIT 1),
    'Insight',
    'FACE',
    1163,
    885,
    885,
    1163,
    24,
    '/insight_combo_offer.png',
    false,
    true
) ON CONFLICT (id) DO UPDATE SET
    name            = EXCLUDED.name,
    description     = EXCLUDED.description,
    brand_id        = EXCLUDED.brand_id,
    brand_name      = EXCLUDED.brand_name,
    mrp_price       = EXCLUDED.mrp_price,
    selling_price   = EXCLUDED.selling_price,
    price           = EXCLUDED.price,
    original_price  = EXCLUDED.original_price,
    discount        = EXCLUDED.discount,
    image_url       = EXCLUDED.image_url,
    is_offer        = EXCLUDED.is_offer;



-- ── 3. MARS — 5 Minutes Daily Makeup Kit ───────────────────
INSERT INTO products (
    id,
    name,
    description,
    brand_id,
    brand_name,
    category,
    mrp_price,
    selling_price,
    price,
    original_price,
    discount,
    image_url,
    has_variants,
    is_offer
) VALUES (
    'b3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7f',
    '5 Minutes Daily Makeup Kit',
    'Your everyday essential kit for a polished, put-together look — crafted for the modern woman on the move. Mars by GHC''s daily makeup combo delivers professional results in just 5 minutes.',
    -- Replace with actual Mars brand ID from your DB:
    (SELECT id FROM brands WHERE name = 'Mars by GHC' LIMIT 1),
    'Mars by GHC',
    'FACE',
    999,
    749,
    749,
    999,
    25,
    '/mars_combo_offer.png',
    false,
    true
) ON CONFLICT (id) DO UPDATE SET
    name            = EXCLUDED.name,
    description     = EXCLUDED.description,
    brand_id        = EXCLUDED.brand_id,
    brand_name      = EXCLUDED.brand_name,
    mrp_price       = EXCLUDED.mrp_price,
    selling_price   = EXCLUDED.selling_price,
    price           = EXCLUDED.price,
    original_price  = EXCLUDED.original_price,
    discount        = EXCLUDED.discount,
    image_url       = EXCLUDED.image_url,
    is_offer        = EXCLUDED.is_offer;


-- ── 4. PILGRIM — Morning Glow & Protect Kit ─────────────────
INSERT INTO products (
    id,
    name,
    description,
    brand_id,
    brand_name,
    category,
    mrp_price,
    selling_price,
    price,
    original_price,
    discount,
    image_url,
    has_variants,
    is_offer
) VALUES (
    'c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f',
    'Morning Glow & Protect Kit',
    'Start your day with radiant, protected skin — Pilgrim''s complete morning ritual kit has everything you need. This curated skincare combo ensures a glowing, sun-protected complexion from the very first step.',
    -- Replace with actual Pilgrim brand ID from your DB:
    (SELECT id FROM brands WHERE name = 'Pilgrim' LIMIT 1),
    'Pilgrim',
    'SKINCARE & BODY',
    1565,
    1179,
    1179,
    1565,
    25,
    '/pilgrim_combo_offer.png',
    false,
    true
) ON CONFLICT (id) DO UPDATE SET
    name            = EXCLUDED.name,
    description     = EXCLUDED.description,
    brand_id        = EXCLUDED.brand_id,
    brand_name      = EXCLUDED.brand_name,
    mrp_price       = EXCLUDED.mrp_price,
    selling_price   = EXCLUDED.selling_price,
    price           = EXCLUDED.price,
    original_price  = EXCLUDED.original_price,
    discount        = EXCLUDED.discount,
    image_url       = EXCLUDED.image_url,
    is_offer        = EXCLUDED.is_offer;


-- ────────────────────────────────────────────────────────────
-- Step 4: Verify all 4 combo products were inserted correctly
-- ────────────────────────────────────────────────────────────
SELECT 
    p.id,
    p.name,
    p.brand_name,
    p.mrp_price,
    p.selling_price,
    p.discount,
    p.is_offer,
    p.image_url
FROM products p
WHERE p.is_offer = true
ORDER BY p.brand_name;


-- ────────────────────────────────────────────────────────────
-- Step 5 (Optional): If you want the /offers page to also show
-- all products with discount >= 20%, mark them as offers too:
-- ────────────────────────────────────────────────────────────
-- UPDATE products
-- SET is_offer = true
-- WHERE discount >= 20 AND is_offer IS NOT true;
