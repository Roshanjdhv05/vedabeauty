-- ============================================================
-- VEGA BRAND + ALL PRODUCTS SQL
-- Format matches insert_insight_products.sql
-- MRP = mrp_price & original_price
-- Selling Price = MRP × 0.85 (15% off) = price & selling_price
-- discount = 15
-- ============================================================

DO $$
DECLARE
  vega_brand_id UUID;
BEGIN

  -- 1. Create or get Vega Brand
  SELECT id INTO vega_brand_id FROM brands WHERE name = 'Vega' LIMIT 1;
  IF vega_brand_id IS NULL THEN
    INSERT INTO brands (name, logo_url)
    VALUES (
      'Vega',
      '/brands/vega-logo.png'
    )
    RETURNING id INTO vega_brand_id;
  END IF;

  -- ============================================================
  -- MAKE-UP BRUSHES — STANDARD
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Reversible Lip Filler (PV-23)', vega_brand_id, 'Accessories', false, 270, 230, 230, 270, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Reversible Lip Liner (PV-24)', vega_brand_id, 'Accessories', false, 260, 221, 221, 260, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Face Pack Brush (HV-27)', vega_brand_id, 'Accessories', false, 165, 140, 140, 165, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Foundation Brush (EV-01)', vega_brand_id, 'Accessories', false, 350, 298, 298, 350, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Shadow Brush Medium (EV-02)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Angular Blender (EV-07)', vega_brand_id, 'Accessories', false, 125, 106, 106, 125, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Liner Brush (EV-08)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Groomer (EV-09)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Mascara Brush (EV-10)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Fan Brush (EV-11)', vega_brand_id, 'Accessories', false, 135, 115, 115, 135, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Applicator (EV-12)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Lip Filler (EV-13)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Lip Liner (EV-15)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Bindi Brush (EV-16)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Blush Brush (EV-19)', vega_brand_id, 'Accessories', false, 210, 179, 179, 210, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Blush Brush RT (EV-19RT)', vega_brand_id, 'Accessories', false, 275, 234, 234, 275, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Powder Brush Small (EV-20)', vega_brand_id, 'Accessories', false, 275, 234, 234, 275, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Powder Brush RT (EV-20RT)', vega_brand_id, 'Accessories', false, 365, 310, 310, 365, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Powder Brush Large (EV-21)', vega_brand_id, 'Accessories', false, 375, 319, 319, 375, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Smudger (EV-22)', vega_brand_id, 'Accessories', false, 125, 106, 106, 125, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Gel Eye Liner Brush (EV-23)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Pan Cake Brush (PCB-01)', vega_brand_id, 'Accessories', false, 125, 106, 106, 125, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Shadow Eye Applicator (DMB-01)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Groomer Brush Eye Applicator (DMB-02)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Lip Filler Lip Liner (DMB-03)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Shadow Stick (APP-10)', vega_brand_id, 'Accessories', false, 120, 102, 102, 120, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- MAKE-UP BRUSHES — PREMIUM
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Buffer Brush Premium (MBP-01)', vega_brand_id, 'Accessories', false, 599, 509, 509, 599, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Blush Brush Premium (MBP-02)', vega_brand_id, 'Accessories', false, 425, 361, 361, 425, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Contour Brush Premium (MBP-03)', vega_brand_id, 'Accessories', false, 425, 361, 361, 425, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Foundation Brush Premium (MBP-04)', vega_brand_id, 'Accessories', false, 399, 339, 339, 399, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Brush Premium (MBP-05)', vega_brand_id, 'Accessories', false, 179, 152, 152, 179, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Brush Premium (MBP-06)', vega_brand_id, 'Accessories', false, 169, 144, 144, 169, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Shadow Brush Small Premium (MBP-07)', vega_brand_id, 'Accessories', false, 179, 152, 152, 179, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Angular Blender Brush Premium (MBP-08)', vega_brand_id, 'Accessories', false, 160, 136, 136, 160, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Powder Brush Small Premium (MBP-09)', vega_brand_id, 'Accessories', false, 850, 723, 723, 850, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Groomer Brush Premium (MBP-10)', vega_brand_id, 'Accessories', false, 160, 136, 136, 160, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Applicator Brush Premium (MBP-11)', vega_brand_id, 'Accessories', false, 160, 136, 136, 160, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Lip Filler Brush Premium (MBP-12)', vega_brand_id, 'Accessories', false, 179, 152, 152, 179, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Fan Brush Premium (MBP-13)', vega_brand_id, 'Accessories', false, 179, 152, 152, 179, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Contour Brush Premium (MBP-14)', vega_brand_id, 'Accessories', false, 425, 361, 361, 425, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Kabuki Powder Brush Premium (MBP-15)', vega_brand_id, 'Accessories', false, 625, 531, 531, 625, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- MAKE-UP BRUSHES — PROFESSIONAL
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Contour Brush Professional (PB-01)', vega_brand_id, 'Accessories', false, 949, 807, 807, 949, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Foundation Brush Professional (PB-02)', vega_brand_id, 'Accessories', false, 949, 807, 807, 949, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Concealer Brush Professional (PB-03)', vega_brand_id, 'Accessories', false, 749, 637, 637, 749, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Lip Liner Professional (PB-04)', vega_brand_id, 'Accessories', false, 240, 204, 204, 240, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Lip Filler Professional (PB-05)', vega_brand_id, 'Accessories', false, 440, 374, 374, 440, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Shadow Professional (PB-06)', vega_brand_id, 'Accessories', false, 749, 637, 637, 749, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Angular Brush Professional (PB-08)', vega_brand_id, 'Accessories', false, 399, 339, 339, 399, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Powder Brush Professional (PB-09)', vega_brand_id, 'Accessories', false, 1050, 893, 893, 1050, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Buffer Brush Large Professional (PB-11)', vega_brand_id, 'Accessories', false, 1299, 1104, 1104, 1299, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Deer Foot Brush (PB-12)', vega_brand_id, 'Accessories', false, 630, 536, 536, 630, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Blush Brush Professional (PB-13)', vega_brand_id, 'Accessories', false, 625, 531, 531, 625, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Brush Professional (PB-14)', vega_brand_id, 'Accessories', false, 699, 594, 594, 699, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eye Brush Professional (PB-15)', vega_brand_id, 'Accessories', false, 630, 536, 536, 630, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Liner Brush Professional (PB-16)', vega_brand_id, 'Accessories', false, 279, 237, 237, 279, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Buffer Brush Small Professional (PB-17)', vega_brand_id, 'Accessories', false, 849, 721, 721, 849, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Pro EZ Set of 10 Professional Brushes (MBS-10)', vega_brand_id, 'Accessories', false, 3999, 3399, 3399, 3999, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- MAKE-UP BRUSH SETS
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Set of 5 Brushes (MBS-05)', vega_brand_id, 'Accessories', false, 599, 509, 509, 599, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Set of 6 Brushes (MBS-06)', vega_brand_id, 'Accessories', false, 475, 404, 404, 475, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Set of 5 Brushes (RV-05)', vega_brand_id, 'Accessories', false, 375, 319, 319, 375, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Set of 4 Brushes (EVS-04)', vega_brand_id, 'Accessories', false, 499, 424, 424, 499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Set of 7 Brushes (EVS-07)', vega_brand_id, 'Accessories', false, 750, 638, 638, 750, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Set of 9 Brushes (EVS-09)', vega_brand_id, 'Accessories', false, 1350, 1148, 1148, 1350, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Professional Set of 10 Brushes (LK-10)', vega_brand_id, 'Accessories', false, 2700, 2295, 2295, 2700, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Professional Set of 12 Brushes (LK-12)', vega_brand_id, 'Accessories', false, 5999, 5099, 5099, 5999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Professional Set of 20 Brushes (LK-20)', vega_brand_id, 'Accessories', false, 10999, 9349, 9349, 10999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Professional Set of 27 Brushes (LK-27)', vega_brand_id, 'Accessories', false, 15999, 13599, 13599, 15999, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- MAKE-UP SPONGES
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Foundation Sponge Oval (NBRO)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Foundation Sponge Rectangle (NBRS)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Powder Puff Pure Cotton (PP-75)', vega_brand_id, 'Accessories', false, 150, 128, 128, 150, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Make-up Sponge Small (NR-20)', vega_brand_id, 'Accessories', false, 140, 119, 119, 140, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Make-up Sponge Large (NR-25)', vega_brand_id, 'Accessories', false, 235, 200, 200, 235, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('8 Pcs Sponge Wedges (MW-08)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Make-up Blender Sponge with Handle (MPH-01)', vega_brand_id, 'Accessories', false, 399, 339, 339, 399, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR BRUSHES — PADDLE
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Paddle Brush (E1-PB)', vega_brand_id, 'Accessories', false, 550, 468, 468, 550, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Paddle Brush Beige (E2-PB)', vega_brand_id, 'Accessories', false, 550, 468, 468, 550, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Paddle Brush Boar Bristle (E2-PBB)', vega_brand_id, 'Accessories', false, 449, 382, 382, 449, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Paddle Brush Red (E9-PB)', vega_brand_id, 'Accessories', false, 499, 424, 424, 499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Paddle Brush with Hair Pin (E15-PB)', vega_brand_id, 'Accessories', false, 550, 468, 468, 550, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Paddle Brush (E17-PB)', vega_brand_id, 'Accessories', false, 499, 424, 424, 499, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR BRUSHES — CUSHION
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Cushion Brush (E17-CB)', vega_brand_id, 'Accessories', false, 450, 383, 383, 450, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Cushion Brush with Hair Clip (E31-CB)', vega_brand_id, 'Accessories', false, 450, 383, 383, 450, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR BRUSHES — FLAT
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Flat Brush (E30-FB)', vega_brand_id, 'Accessories', false, 399, 339, 339, 399, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Flat Brush (E39-FB)', vega_brand_id, 'Accessories', false, 265, 225, 225, 265, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Flat Brush (R29-FB)', vega_brand_id, 'Accessories', false, 250, 213, 213, 250, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR BRUSHES — ROUND
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Round Brush (R2-RB)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Round Brush (E2-PR)', vega_brand_id, 'Accessories', false, 310, 264, 264, 310, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Round Brush with Hair Pin (E16-RB)', vega_brand_id, 'Accessories', false, 399, 339, 339, 399, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Round Brush (E39-RB)', vega_brand_id, 'Accessories', false, 265, 225, 225, 265, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Round Brush (R29-RB)', vega_brand_id, 'Accessories', false, 250, 213, 213, 250, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Rainbow Hair Brush (R17-CB)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR BRUSHES — HOT CURL / THERMAL
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Hot Curl Brush (H1-PRB)', vega_brand_id, 'Accessories', false, 160, 136, 136, 160, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Hot Curl Brush (H2-PRM)', vega_brand_id, 'Accessories', false, 999, 849, 849, 999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Hot Curl Brush (E16-PRB)', vega_brand_id, 'Accessories', false, 450, 383, 383, 450, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Hot Curl Brush Set (PHBS-01)', vega_brand_id, 'Accessories', false, 550, 468, 468, 550, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- DETANGLING BRUSH
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Scalp Massager Shampoo Brush (VHSU-01)', vega_brand_id, 'Accessories', false, 249, 212, 212, 249, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR COLORING ACCESSORIES
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Mehndi Brush (MB-03)', vega_brand_id, 'Accessories', false, 60, 51, 51, 60, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR COMBS — REGULAR
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Regular Comb Set of 36 (CT-01)', vega_brand_id, 'Accessories', false, 1800, 1530, 1530, 1800, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Iris Grooming Comb (DC-1268H)', vega_brand_id, 'Accessories', false, 140, 119, 119, 140, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Tulip Grooming Comb (1222)', vega_brand_id, 'Accessories', false, 140, 119, 119, 140, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Tail Comb (1265)', vega_brand_id, 'Accessories', false, 175, 149, 149, 175, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('De-Tangling Comb (1268)', vega_brand_id, 'Accessories', false, 99, 84, 84, 99, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Shampoo Comb (1272)', vega_brand_id, 'Accessories', false, 99, 84, 84, 99, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Grooming Comb (1293-N)', vega_brand_id, 'Accessories', false, 99, 84, 84, 99, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR COMBS — HANDMADE (HMC / HMSC Series)
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Graduated Dressing Comb (HMSC-03)', vega_brand_id, 'Accessories', false, 300, 255, 255, 300, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Dressing Comb (HMSC-09D)', vega_brand_id, 'Accessories', false, 250, 213, 213, 250, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Dressing Comb (HMSC-42)', vega_brand_id, 'Accessories', false, 250, 213, 213, 250, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Graduated Dressing Pocket Comb (HMSC-120D)', vega_brand_id, 'Accessories', false, 300, 255, 255, 300, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Graduated Dressing Comb (HMC-03)', vega_brand_id, 'Accessories', false, 225, 191, 191, 225, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Graduated Dressing Comb (HMC-04D)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Dressing Comb (HMC-07)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Dressing Comb (HMC-10)', vega_brand_id, 'Accessories', false, 170, 145, 145, 170, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Pocket Comb (HMC-21)', vega_brand_id, 'Accessories', false, 170, 145, 145, 170, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('De-Tangling Comb (HMC-24)', vega_brand_id, 'Accessories', false, 170, 145, 145, 170, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Moon Dressing Comb (HMC-27)', vega_brand_id, 'Accessories', false, 170, 145, 145, 170, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('De-Tangling Comb (HMC-30)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Shampoo Comb (HMC-32D)', vega_brand_id, 'Accessories', false, 170, 145, 145, 170, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Graduated Dressing Comb (HMC-37)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Dressing Comb (HMC-43)', vega_brand_id, 'Accessories', false, 260, 221, 221, 260, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Shampoo Comb (HMC-71)', vega_brand_id, 'Accessories', false, 170, 145, 145, 170, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Grooming Comb (HMC-74)', vega_brand_id, 'Accessories', false, 260, 221, 221, 260, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Graduated Dressing Comb (HMC-120)', vega_brand_id, 'Accessories', false, 299, 254, 254, 299, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Handcrafted Comb Set (HMCS-04)', vega_brand_id, 'Accessories', false, 299, 254, 254, 299, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Pocket Comb Set of 4 (HMC-121)', vega_brand_id, 'Accessories', false, 299, 254, 254, 299, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR COMBS — WOODEN
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Styling Wooden Comb (HMWC-03)', vega_brand_id, 'Accessories', false, 125, 106, 106, 125, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Grooming Wooden Comb (HMWC-06)', vega_brand_id, 'Accessories', false, 170, 145, 145, 170, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Pocket Wooden Comb (HMWC-22)', vega_brand_id, 'Accessories', false, 140, 119, 119, 140, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Neem Wooden Comb (WNC-03)', vega_brand_id, 'Accessories', false, 225, 191, 191, 225, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Neem Wooden Comb (WNC-05)', vega_brand_id, 'Accessories', false, 225, 191, 191, 225, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR COMBS — BABY (HMBC Series)
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Baby Graduated Dressing Comb (HMBC-103)', vega_brand_id, 'Accessories', false, 170, 145, 145, 170, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Baby Graduated Dressing Comb (HMBC-107)', vega_brand_id, 'Accessories', false, 155, 132, 132, 155, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Baby Grooming Comb (HMBC-111)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Baby Grooming Comb (HMBC-114)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Baby Graduated Dressing (HMBC-117)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Baby Graduated Dressing (HMBC-120)', vega_brand_id, 'Accessories', false, 135, 115, 115, 135, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Baby Graduated Dressing (HMBC-123)', vega_brand_id, 'Accessories', false, 125, 106, 106, 125, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Baby Dressing Comb (HMBC-126)', vega_brand_id, 'Accessories', false, 170, 145, 145, 170, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Baby Shampoo Comb (HMBC-204)', vega_brand_id, 'Accessories', false, 170, 145, 145, 170, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Baby Grooming Comb (HMBC-303)', vega_brand_id, 'Accessories', false, 170, 145, 145, 170, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Tail Comb Steel Pin (HMBC-307)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Baby Comb Set (HMBCS-01)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR COMBS — ALL-PURPOSE (AC Series)
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Graduated Dressing (AC-03)', vega_brand_id, 'Accessories', false, 230, 196, 196, 230, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Graduated Dressing (AC-06)', vega_brand_id, 'Accessories', false, 135, 115, 115, 135, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Shampoo Comb (AC-07)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- MEN'S GROOMING ACCESSORIES
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Shaving Brush (SB-01-B)', vega_brand_id, 'Accessories', false, 125, 106, 106, 125, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- BATH ACCESSORIES — BATH BRUSHES
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Luxury Bristle Bath Brush (BA-1/1)', vega_brand_id, 'Accessories', false, 360, 306, 306, 360, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Luxury Fine Massager Bath Brush (BA-1/1N)', vega_brand_id, 'Accessories', false, 385, 327, 327, 385, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Luxury Bath Brush (BA-1/2)', vega_brand_id, 'Accessories', false, 330, 281, 281, 330, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('New Luxury Bath Brush (BA-1/2N)', vega_brand_id, 'Accessories', false, 235, 200, 200, 235, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('New Luxury Bristle Bath Brush (BA-1/3)', vega_brand_id, 'Accessories', false, 360, 306, 306, 360, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Luxury Bath Ball Brush (BA-1/4)', vega_brand_id, 'Accessories', false, 310, 264, 264, 310, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Luxury Soft Sponge Brush (BA-1/5)', vega_brand_id, 'Accessories', false, 310, 264, 264, 310, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Wooden Handle Bath Brush (BA-1/6)', vega_brand_id, 'Accessories', false, 165, 140, 140, 165, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Long Handle Bristle Bath Brush (BA-1/7)', vega_brand_id, 'Accessories', false, 310, 264, 264, 310, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- BATH ACCESSORIES — BATH SPONGES
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Flower Sponge (BA-3/3)', vega_brand_id, 'Accessories', false, 190, 162, 162, 190, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Fluffy Sponge (BA-3/4)', vega_brand_id, 'Accessories', false, 190, 162, 162, 190, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Luxury Flower Sponge (BA-3/5)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Flower Sponge (BA-3/6)', vega_brand_id, 'Accessories', false, 140, 119, 119, 140, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Color Cube Fluffy Sponge (BA-3/7)', vega_brand_id, 'Accessories', false, 130, 111, 111, 130, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Everyday Sponge (BA-3/8)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Soft Sponge (BA-3/9)', vega_brand_id, 'Accessories', false, 150, 128, 128, 150, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('The Orange Sponge (BA-3/10)', vega_brand_id, 'Accessories', false, 150, 128, 128, 150, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Mini Sponge (BA-3/12)', vega_brand_id, 'Accessories', false, 99, 84, 84, 99, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Sponge Relaxer (BA-3/1)', vega_brand_id, 'Accessories', false, 270, 230, 230, 270, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Bath Sponge Pair (BA-3/2)', vega_brand_id, 'Accessories', false, 310, 264, 264, 310, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Kids Sponge (BAK-01)', vega_brand_id, 'Accessories', false, 140, 119, 119, 140, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- BATH ACCESSORIES — NATURAL LOOFAH
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Sisal Ball Bath Sponge (NBA-3/3)', vega_brand_id, 'Accessories', false, 240, 204, 204, 240, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Loofah Pad (NBA-3/5)', vega_brand_id, 'Accessories', false, 240, 204, 204, 240, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Loofah Pad Small (NBA-3/6)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Sisal Sponge Relaxer Small (NBA-3/8)', vega_brand_id, 'Accessories', false, 160, 136, 136, 160, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Loofah Relaxer Small (NBA-3/9)', vega_brand_id, 'Accessories', false, 299, 254, 254, 299, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Basic Hand Loofah (NBA-4/1)', vega_brand_id, 'Accessories', false, 375, 319, 319, 375, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- FACE & OTHER ACCESSORIES
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Rose Quartz Facial Roller (FR-01)', vega_brand_id, 'Accessories', false, 1249, 1062, 1062, 1249, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eyelash Curler (EC-01)', vega_brand_id, 'Accessories', false, 175, 149, 149, 175, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Premium Eyelash Curler (EC-02)', vega_brand_id, 'Accessories', false, 240, 204, 204, 240, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Blackhead Remover Pointed (BHR-01)', vega_brand_id, 'Accessories', false, 99, 84, 84, 99, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Blackhead Remover Round (BHR-02)', vega_brand_id, 'Accessories', false, 99, 84, 84, 99, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Tweezer Square Tip (TW-04)', vega_brand_id, 'Accessories', false, 90, 77, 77, 90, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Tweezer Slant Tip (TW-07)', vega_brand_id, 'Accessories', false, 115, 98, 98, 115, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('D-Zyner Tweezer 2-in-1 Brow Groomer (TWE-01)', vega_brand_id, 'Accessories', false, 175, 149, 149, 175, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Eyebrow Shaper Set (ESS-04)', vega_brand_id, 'Accessories', false, 299, 254, 254, 299, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Cotton Pads 50 pcs (CP-01)', vega_brand_id, 'Accessories', false, 135, 115, 115, 135, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Ultra Soft Cotton Pads 100 pcs (CP-02)', vega_brand_id, 'Accessories', false, 275, 234, 234, 275, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Premium Quality Cotton Pads 50 pcs (CP-03)', vega_brand_id, 'Accessories', false, 299, 254, 254, 299, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Face Cleansing Pad (FCP-01)', vega_brand_id, 'Accessories', false, 180, 153, 153, 180, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Cucumber Gel Eye Mask (EM-01)', vega_brand_id, 'Accessories', false, 210, 179, 179, 210, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Ear Buds 100 Sticks (EB-01)', vega_brand_id, 'Accessories', false, 65, 55, 55, 65, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Ear Buds 200 Sticks (EB-02)', vega_brand_id, 'Accessories', false, 125, 106, 106, 125, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Hair Roller Set of 6 (SC-01)', vega_brand_id, 'Accessories', false, 240, 204, 204, 240, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Colorful Shower Caps (VASH-01)', vega_brand_id, 'Accessories', false, 80, 68, 68, 80, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Hair Straightener Pouch (VASP-01)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- ORAL CARE
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('EasyGlide Tongue Cleaner Plastic (TCP-01)', vega_brand_id, 'Accessories', false, 79, 67, 67, 79, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('EasyGlide Tongue Cleaner Plastic Pack of 3 (TCP-02)', vega_brand_id, 'Accessories', false, 225, 191, 191, 225, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('EasyGlide Tongue Cleaner Copper (TCC-01)', vega_brand_id, 'Accessories', false, 99, 84, 84, 99, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('EasyGlide Tongue Cleaner Copper with Handle (TCC-02)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('EasyGlide Tongue Cleaner Metal with Handle (TCM-01)', vega_brand_id, 'Accessories', false, 179, 152, 152, 179, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- PEDICURE & MANICURE TOOLS
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Foot Scrubber (PD-02)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Pedicure File Dual Side (PD-04)', vega_brand_id, 'Accessories', false, 220, 187, 187, 220, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Black Emery Foot File (PD-12)', vega_brand_id, 'Accessories', false, 140, 119, 119, 140, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Black Emery Foot File / Corn Cutter (PD-19)', vega_brand_id, 'Accessories', false, 160, 136, 136, 160, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Curve Emery Foot File (PD-26)', vega_brand_id, 'Accessories', false, 160, 136, 136, 160, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Pumice Sponge (PD-17)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Pumice Stone (PD-29)', vega_brand_id, 'Accessories', false, 140, 119, 119, 140, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Foot File (PD-31)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('DIY Pedicure Set 8 Tools (PDS-08)', vega_brand_id, 'Accessories', false, 999, 849, 849, 999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('General Cutting Scissor Large (SCS-01)', vega_brand_id, 'Accessories', false, 210, 179, 179, 210, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('General Cutting Scissor Small (SCS-03)', vega_brand_id, 'Accessories', false, 199, 169, 169, 199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Cuticle Scissor / Nasal Safety Scissor (NS-01)', vega_brand_id, 'Accessories', false, 125, 106, 106, 125, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Nail File Small (NF6-N)', vega_brand_id, 'Accessories', false, 95, 81, 81, 95, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Nail Buffer / Dual Surface Nail Brush (CTP-01)', vega_brand_id, 'Accessories', false, 125, 106, 106, 125, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Soft Touch Cuticle Trimmer (CTF-01)', vega_brand_id, 'Accessories', false, 115, 98, 98, 115, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Cuticle Nipper (CN-01)', vega_brand_id, 'Accessories', false, 90, 77, 77, 90, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Nail Clipper Large (SNC-01)', vega_brand_id, 'Accessories', false, 140, 119, 119, 140, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Nail Clipper (LNC-03)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Baby Nail Clipper (BNC-01)', vega_brand_id, 'Accessories', false, 110, 94, 94, 110, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Nail Clipper Small (SNC-04)', vega_brand_id, 'Accessories', false, 125, 106, 106, 125, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Large Nail Clipper (LNC-04)', vega_brand_id, 'Accessories', false, 115, 98, 98, 115, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Nail Clipper (LNC-07)', vega_brand_id, 'Accessories', false, 210, 179, 179, 210, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Nail Clipper Box (LNCB-02)', vega_brand_id, 'Accessories', false, 700, 595, 595, 700, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Nail Clipper Box Premium (LNCB-02N)', vega_brand_id, 'Accessories', false, 900, 765, 765, 900, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- PERSONAL CARE APPLIANCES — HAIR CURLER
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Ease Curl Hair Curler 19mm (VHCH-01)', vega_brand_id, 'Tools', false, 1750, 1488, 1488, 1750, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Ease Curl Hair Curler 25mm (VHCH-02)', vega_brand_id, 'Tools', false, 1850, 1573, 1573, 1850, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Smooth Curl Hair Curler 19mm (VHCH-03)', vega_brand_id, 'Tools', false, 2100, 1785, 1785, 2100, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Long Curl Hair Curler 22mm (VHCH-04)', vega_brand_id, 'Tools', false, 2450, 2083, 2083, 2450, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('I-Curl Hair Curler 12-25mm (VHCH-05)', vega_brand_id, 'Tools', false, 999, 849, 849, 999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Smart-Curl Hair Curler 25mm (VHCH-06)', vega_brand_id, 'Tools', false, 1999, 1699, 1699, 1999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Bubble Hair Curler (VHCH-07)', vega_brand_id, 'Tools', false, 1799, 1529, 1529, 1799, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Chopstick Hair Curler (VHCS-01)', vega_brand_id, 'Tools', false, 2349, 1997, 1997, 2349, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Ease Curl Plus Hair Curler (VHSSCH-01)', vega_brand_id, 'Tools', false, 999, 849, 849, 999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Go Mini Hair Curler 25mm (VHCH-08)', vega_brand_id, 'Tools', false, 1499, 1274, 1274, 1499, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- GROOMING APPLIANCES
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Silk Touch Trimmer All-in-One (VHBT-01)', vega_brand_id, 'Tools', false, 1299, 1104, 1104, 1299, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Mystic Lady Shaver (VHLS-02)', vega_brand_id, 'Tools', false, 1199, 1019, 1019, 1199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Ezy 2-in-1 Unisex Trimmer (VHBT-02)', vega_brand_id, 'Tools', false, 1299, 1104, 1104, 1299, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Smart 9-in-1 Cleaning Set (VHCK-01)', vega_brand_id, 'Tools', false, 2499, 2124, 2124, 2499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Feather Touch 4-in-1 Trimmer (VHBT-03)', vega_brand_id, 'Tools', false, 1799, 1529, 1529, 1799, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('3-in-1 Facial Cleanser (VHFC-02)', vega_brand_id, 'Tools', false, 2999, 2549, 2549, 2999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Cleanse Pro Facial Cleanser (VHFC-03)', vega_brand_id, 'Tools', false, 1099, 934, 934, 1099, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Facial Cleanser USB Rechargeable (VHFC-01)', vega_brand_id, 'Tools', false, 2199, 1869, 1869, 2199, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR STRAIGHTENER BRUSH
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('X-Glam Straightening Brush (VHSB-01)', vega_brand_id, 'Tools', false, 1999, 1699, 1699, 1999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('X-Look Paddle Straightening Brush (VHSB-02)', vega_brand_id, 'Tools', false, 2999, 2549, 2549, 2999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('X-Star Straightening Brush (VHSB-03)', vega_brand_id, 'Tools', false, 1999, 1699, 1699, 1999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Black Shine Hair Straightening Brush (VHSB-04)', vega_brand_id, 'Tools', false, 2499, 2124, 2124, 2499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('LitStyle L1 Straightening Brush (VHSB-06)', vega_brand_id, 'Tools', false, 3799, 3229, 3229, 3799, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('LitStyle L2 Straightening Brush (VHSB-07)', vega_brand_id, 'Tools', false, 2799, 2379, 2379, 2799, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Glam Shine 2-in-1 Hair Straightener and Brush (VHSSB-01)', vega_brand_id, 'Tools', false, 1499, 1274, 1274, 1499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Go Mini Hair Straightening Brush (VHSB-05)', vega_brand_id, 'Tools', false, 1499, 1274, 1274, 1499, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR STYLER (2-in-1 Straightener + Curler)
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('2-in-1 Hair Styler (VHSC-01)', vega_brand_id, 'Tools', false, 2199, 1869, 1869, 2199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('2-in-1 Wet & Dry Hair Styler (VHSC-02)', vega_brand_id, 'Tools', false, 1799, 1529, 1529, 1799, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Glam-Glitz 2-in-1 Hair Styler (VHSC-04)', vega_brand_id, 'Tools', false, 1799, 1529, 1529, 1799, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Glam Up 2-in-1 Hair Styler (VHSC-05)', vega_brand_id, 'Tools', false, 1999, 1699, 1699, 1999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Multi Styler Brush & Hair Dryer (VHSD-01)', vega_brand_id, 'Tools', false, 2750, 2338, 2338, 2750, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Go Mini 3-in-1 Hair Styler (VHSCC-06)', vega_brand_id, 'Tools', false, 1499, 1274, 1274, 1499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Go Mini 3-in-1 Hair Styler (VHSCC-07)', vega_brand_id, 'Tools', false, 1499, 1274, 1274, 1499, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR STRAIGHTENER
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Fab Hair Straightener (VHSH-15)', vega_brand_id, 'Tools', false, 1699, 1444, 1444, 1699, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Trendy Flat Hair Straightener (VHSH-16)', vega_brand_id, 'Tools', false, 2199, 1869, 1869, 2199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Adore Hair Straightener (VHSH-18)', vega_brand_id, 'Tools', false, 1199, 1019, 1019, 1199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Keratin Glow Hair Straightener (VHSH-20)', vega_brand_id, 'Tools', false, 2499, 2124, 2124, 2499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Glam-Shine Hair Straightener (VHSH-24)', vega_brand_id, 'Tools', false, 1599, 1359, 1359, 1599, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Ultra-Shine Hair Straightener (VHSH-25)', vega_brand_id, 'Tools', false, 1549, 1317, 1317, 1549, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Argan-Shine Hair Straightener (VHSH-33)', vega_brand_id, 'Tools', false, 1499, 1274, 1274, 1499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Shine-On Hair Straightener (VHSH-34)', vega_brand_id, 'Tools', false, 1199, 1019, 1019, 1199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Infra Style Hair Straightener (VHSH-35)', vega_brand_id, 'Tools', false, 2499, 2124, 2124, 2499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Diva-Shine Hair Straightener (VHSH-36)', vega_brand_id, 'Tools', false, 1499, 1274, 1274, 1499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Go Mini Cordless Hair Straightener (VHSH-41)', vega_brand_id, 'Tools', false, 2999, 2549, 2549, 2999, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR DRYER
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Blooming Air 1000W Hair Dryer (VHDH-05)', vega_brand_id, 'Tools', false, 999, 849, 849, 999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Galaxy 1100W Hair Dryer (VHDH-06)', vega_brand_id, 'Tools', false, 1099, 934, 934, 1099, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Go-Style 1200W Hair Dryer (VHDH-18)', vega_brand_id, 'Tools', false, 1199, 1019, 1019, 1199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Go-Lite 1400W Hair Dryer (VHDH-19)', vega_brand_id, 'Tools', false, 1099, 934, 934, 1099, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Insta-Glam 1000W Hair Dryer (VHDH-20)', vega_brand_id, 'Tools', false, 899, 764, 764, 899, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Insta-Glam 1000W Hair Dryer (VHDH-20N)', vega_brand_id, 'Tools', false, 899, 764, 764, 899, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Ionic 1400W Hair Dryer (VHDH-28)', vega_brand_id, 'Tools', false, 2099, 1784, 1784, 2099, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Style-Pro 1600W Hair Dryer (VHDH-30)', vega_brand_id, 'Tools', false, 2199, 1869, 1869, 2199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Style-Swift 1200W Hair Dryer (VHDH-31)', vega_brand_id, 'Tools', false, 1099, 934, 934, 1099, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Travel Pro 1200W Hair Dryer (VHDH-33)', vega_brand_id, 'Tools', false, 899, 764, 764, 899, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Blooming Air Plus Hair Dryer (VHSSDH-01)', vega_brand_id, 'Tools', false, 849, 721, 721, 849, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR CRIMPER & WAVER
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Classic Hair Crimper (VHCR-01)', vega_brand_id, 'Tools', false, 1949, 1657, 1657, 1949, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Go Mini Hair Waver (VHWR-02)', vega_brand_id, 'Tools', false, 999, 849, 849, 999, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR VOLUMIZER
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('VolumePro Volumizer (VHVH-01)', vega_brand_id, 'Tools', false, 1999, 1699, 1699, 1999, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR STYLING SETS
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Miss Perfect Styling Set — Straightener + Dryer (VHSS-01)', vega_brand_id, 'Tools', false, 2699, 2294, 2294, 2699, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Miss Dazzle Styling Set — Straightener + Curler (VHSS-02)', vega_brand_id, 'Tools', false, 2499, 2124, 2124, 2499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Miss Versatile Styling Set — Straightener + Curler (VHSS-03)', vega_brand_id, 'Tools', false, 3199, 2719, 2719, 3199, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- BEARD TRIMMER
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('T-Amaze Beard Trimmer (VHTH-13)', vega_brand_id, 'Tools', false, 999, 849, 849, 999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('T-2 Beard Trimmer (VHTH-14)', vega_brand_id, 'Tools', false, 999, 849, 849, 999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('T-4 Beard Trimmer (VHTH-15)', vega_brand_id, 'Tools', false, 1099, 934, 934, 1099, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('X-1 Beard Trimmer (VHTH-16)', vega_brand_id, 'Tools', false, 1499, 1274, 1274, 1499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('X-2 Beard Trimmer (VHTH-17)', vega_brand_id, 'Tools', false, 1499, 1274, 1274, 1499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('T-1 Beard Trimmer (VHTH-18)', vega_brand_id, 'Tools', false, 999, 849, 849, 999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('T-3 Beard Trimmer (VHTH-19)', vega_brand_id, 'Tools', false, 1299, 1104, 1104, 1299, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('X-3 Beard Trimmer (VHTH-24)', vega_brand_id, 'Tools', false, 1250, 1063, 1063, 1250, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Power Series P-1 Beard Trimmer (VHTH-25)', vega_brand_id, 'Tools', false, 999, 849, 849, 999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Power Series P-2 Beard Trimmer (VHTH-26)', vega_brand_id, 'Tools', false, 1099, 934, 934, 1099, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Power Series P-3 Beard Trimmer (VHTH-27)', vega_brand_id, 'Tools', false, 1299, 1104, 1104, 1299, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Smart Series Vacuum Beard Trimmer (VHTH-28)', vega_brand_id, 'Tools', false, 1999, 1699, 1699, 1999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Long Body Trimmer (VHTH-29)', vega_brand_id, 'Tools', false, 1999, 1699, 1699, 1999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('SmartOne Series S1 (VHTH-30)', vega_brand_id, 'Tools', false, 1799, 1529, 1529, 1799, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('SmartOne Series S2 (VHTH-31)', vega_brand_id, 'Tools', false, 1599, 1359, 1359, 1599, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('SmartOne Series S3 (VHTH-36)', vega_brand_id, 'Tools', false, 1599, 1359, 1359, 1599, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('Power Lite Trimmer (VHTH-38)', vega_brand_id, 'Tools', false, 1149, 977, 977, 1149, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- MEN GROOMING SETS
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('T-5 Grooming Station (VHTH-04)', vega_brand_id, 'Tools', false, 2999, 2549, 2549, 2999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('11-in-1 Ultra Multi-Grooming Set (VHTH-20)', vega_brand_id, 'Tools', false, 2699, 2294, 2294, 2699, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('9-in-1 All Ready Multi-Grooming Set (VHTH-21)', vega_brand_id, 'Tools', false, 2299, 1954, 1954, 2299, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('10-in-1 Ezy Multi-Grooming Set (VHTH-22)', vega_brand_id, 'Tools', false, 2199, 1869, 1869, 2199, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('10-in-1 Smart Multi-Grooming Set (VHTH-23)', vega_brand_id, 'Tools', false, 2099, 1784, 1784, 2099, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('9-in-1 Pro Multi-Grooming Set (VHTH-32)', vega_brand_id, 'Tools', false, 1999, 1699, 1699, 1999, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('CleanBall Body Trimmer (VHTH-33)', vega_brand_id, 'Tools', false, 2499, 2124, 2124, 2499, 15)
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('4-in-1 Beard Trimmer (VHTH-35)', vega_brand_id, 'Tools', false, 1199, 1019, 1019, 1199, 15)
  ON CONFLICT DO NOTHING;

  -- ============================================================
  -- HAIR CLIPPER
  -- ============================================================

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount)
  VALUES ('X-Pro Hair Clipper (VHCP-02)', vega_brand_id, 'Tools', false, 2099, 1784, 1784, 2099, 15)
  ON CONFLICT DO NOTHING;

END $$;

-- ============================================================
-- VERIFY: Count total Vega products inserted
-- ============================================================
SELECT COUNT(*) AS total_vega_products
FROM products p
JOIN brands b ON p.brand_id = b.id
WHERE b.name = 'Vega';
