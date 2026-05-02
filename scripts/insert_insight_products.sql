-- INSERT INSIGHT PRODUCTS (If you want to run manually)
-- Note: These are already in the database, but this SQL file can be used to insert them if needed.


DO $$ 
DECLARE
  insight_brand_id UUID;
BEGIN
  -- 1. Create or get Insight Brand
  SELECT id INTO insight_brand_id FROM brands WHERE name = 'Insight' LIMIT 1;
  IF insight_brand_id IS NULL THEN
    INSERT INTO brands (name, logo_url) 
    VALUES ('Insight', '/brands/insight.png')
    RETURNING id INTO insight_brand_id;
  END IF;

  -- 2. Insert Products

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('3 in 1 Primer 30ml', insight_brand_id, 'PRIMER', false, 310, 233, 233, 310, 25, '/insight/3 in 1 Primer 30ml.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('3 in 1 Primer 10ml', insight_brand_id, 'PRIMER', false, 150, 113, 113, 150, 25, '/insight/3 in 1 Primer 10ml.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Pore Primer 10ml', insight_brand_id, 'PRIMER', false, 140, 105, 105, 140, 25, '/insight/Pore Primer 10ml.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Pore Primer 30ml', insight_brand_id, 'PRIMER', false, 415, 311, 311, 415, 25, '/insight/Pore Primer 30ml.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Prime N Perfect Hydrating Primer 10ml', insight_brand_id, 'PRIMER', false, 140, 105, 105, 140, 25, '/insight/Prime N Perfect Hydrating Primer 10ml.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Prime N Perfect Hydrating Primer 30ml', insight_brand_id, 'PRIMER', false, 380, 285, 285, 380, 25, '/insight/Prime N Perfect Hydrating Primer 30ml.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Blusher (06 shades)', insight_brand_id, 'BLUSHER', false, 105, 79, 79, 105, 25, '/insight/Blusher (06 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Glow Blusher Palette', insight_brand_id, 'BLUSHER', false, 265, 199, 199, 265, 25, '/insight/Glow Blusher Palette.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Face Glow Blusher Palette', insight_brand_id, 'BLUSHER', false, 230, 173, 173, 230, 25, '/insight/Face Glow Blusher Palette.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Lip & Cheek Tint Blusher (06 shades)', insight_brand_id, 'BLUSHER', false, 115, 86, 86, 115, 25, '/insight/Lip & Cheek Tint Blusher (06 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Cream Blush (06 shades)', insight_brand_id, 'BLUSHER', false, 220, 165, 165, 220, 25, '/insight/Cream Blush (06 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Cheek Tint Blush (03 shades)', insight_brand_id, 'BLUSHER', false, 155, 116, 116, 155, 25, '/insight/Cheek Tint Blush (03 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Creamy Lip & Cheek Tint (05 shades)', insight_brand_id, 'BLUSHER', false, 235, 176, 176, 235, 25, '/insight/Creamy Lip & Cheek Tint (05 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('On The Go Blush Stick (05 shades)', insight_brand_id, 'BLUSHER', false, 230, 173, 173, 230, 25, '/insight/On The Go Blush Stick (05 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Blush (05 shades)', insight_brand_id, 'BLUSHER', false, 305, 229, 229, 305, 25, '/insight/Blush (05 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Baked Blush (05 shades)', insight_brand_id, 'BLUSHER', false, 170, 128, 128, 170, 25, '/insight/Baked Blush (05 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('I''m Tinted Blush (04 shades)', insight_brand_id, 'BLUSHER', false, 260, 195, 195, 260, 25, '/insight/I''m Tinted Blush (04 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Glow Play Blush & Highlighter (2 variants)', insight_brand_id, 'BLUSHER', false, 200, 150, 150, 200, 25, '/insight/Glow Play Blush & Highlighter (2 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Brick Blusher (05 shades)', insight_brand_id, 'BLUSHER', false, 220, 165, 165, 220, 25, '/insight/Brick Blusher (05 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Blemish Free Concealer (06 shades)', insight_brand_id, 'CONCEALER', false, 135, 101, 101, 135, 25, '/insight/Blemish Free Concealer (06 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Pro Concealer Palette (2 variants)', insight_brand_id, 'CONCEALER', false, 255, 191, 191, 255, 25, '/insight/Pro Concealer Palette (2 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('HD Conceal, Correct & Contour (3 variants)', insight_brand_id, 'CONCEALER', false, 345, 259, 259, 345, 25, '/insight/HD Conceal, Correct & Contour (3 variants).jpg')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Concealer Corrector Palette', insight_brand_id, 'CONCEALER', false, 420, 315, 315, 420, 25, '/insight/Concealer Corrector Palette.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('HD Concealer (11 shades)', insight_brand_id, 'CONCEALER', false, 310, 233, 233, 310, 25, '/insight/HD Concealer (11 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Pro Conceal HD (11 shades)', insight_brand_id, 'CONCEALER', false, 245, 184, 184, 245, 25, '/insight/Pro Conceal HD (11 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('No Smudge Concealer (09 shades)', insight_brand_id, 'CONCEALER', false, 150, 113, 113, 150, 25, '/insight/No Smudge Concealer (09 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Skin Touch Longwear Stick Concealer (18 shades)', insight_brand_id, 'CONCEALER', false, 255, 191, 191, 255, 25, '/insight/Skin Touch Longwear Stick Concealer (18 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Mega Cover Concealer (09 shades)', insight_brand_id, 'CONCEALER', false, 270, 203, 203, 270, 25, '/insight/Mega Cover Concealer (09 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Concealer Foundation (10 shades)', insight_brand_id, 'FOUNDATION', false, 260, 195, 195, 260, 25, '/insight/Concealer Foundation (10 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('HD Foundation (11 shades)', insight_brand_id, 'FOUNDATION', false, 170, 128, 128, 170, 25, '/insight/HD Foundation (11 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('SPF-15 BB Foundation (04 shades)', insight_brand_id, 'FOUNDATION', false, 300, 225, 225, 300, 25, '/insight/SPF-15 BB Foundation (04 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Ultra Thin Second Skin Long Wear Foundation (07 shades)', insight_brand_id, 'FOUNDATION', false, 315, 236, 236, 315, 25, '/insight/Ultra Thin Second Skin Long Wear Foundation (07 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Stay Matte Liquid Foundation Studio Finish (10 shades)', insight_brand_id, 'FOUNDATION', false, 300, 225, 225, 300, 25, '/insight/Stay Matte Liquid Foundation Studio Finish (10 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('True Skin Serum Foundation (06 shades)', insight_brand_id, 'FOUNDATION', false, 345, 259, 259, 345, 25, '/insight/True Skin Serum Foundation (06 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Matte Finish Full Cover Foundation (06 shades)', insight_brand_id, 'FOUNDATION', false, 365, 274, 274, 365, 25, '/insight/Matte Finish Full Cover Foundation (06 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Mousse Foundation Pore Filler (03 shades)', insight_brand_id, 'FOUNDATION', false, 320, 240, 240, 320, 25, '/insight/Mousse Foundation Pore Filler (03 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Radiance Filter (06 shades)', insight_brand_id, 'FOUNDATION', false, 270, 203, 203, 270, 25, '/insight/Radiance Filter (06 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Mineralized Pressed Powder C-33 (13 shades)', insight_brand_id, 'COMPACT', false, 185, 139, 139, 185, 25, '/insight/Mineralized Pressed Powder C-33 (13 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Flawless Finish Setting Powder C-40 (13 shades)', insight_brand_id, 'COMPACT', false, 200, 150, 150, 200, 25, '/insight/Flawless Finish Setting Powder C-40 (13 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Prime Perfect Compact Plus Foundation C-41 (07 shades)', insight_brand_id, 'COMPACT', false, 260, 195, 195, 260, 25, '/insight/Prime Perfect Compact Plus Foundation C-41 (07 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Flawless Finish Setting Powder C-42 (13 shades)', insight_brand_id, 'COMPACT', false, 215, 161, 161, 215, 25, '/insight/Flawless Finish Setting Powder C-42 (13 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('HD Finishing Loose Powder TR-202 (03 shades)', insight_brand_id, 'POWDER', false, 160, 120, 120, 160, 25, '/insight/HD Finishing Loose Powder TR-202 (03 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Banana Powder', insight_brand_id, 'POWDER', false, 230, 173, 173, 230, 25, '/insight/Banana Powder.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Blush & Highlighter Palette MK-05', insight_brand_id, 'HIGHLIGHTER', false, 335, 251, 251, 335, 25, '/insight/Blush & Highlighter Palette MK-05.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Cheek Highlighter H-01 (06 shades)', insight_brand_id, 'HIGHLIGHTER', false, 135, 101, 101, 135, 25, '/insight/Cheek Highlighter H-01 (06 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Baked Highlighter H-12 (05 shades)', insight_brand_id, 'HIGHLIGHTER', false, 235, 176, 176, 235, 25, '/insight/Baked Highlighter H-12 (05 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Halo Glow Illuminator H-16 (04 shades)', insight_brand_id, 'HIGHLIGHTER', false, 320, 240, 240, 320, 25, '/insight/Halo Glow Illuminator H-16 (04 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Duo Stick (3 variants)', insight_brand_id, 'HIGHLIGHTER', false, 245, 184, 184, 245, 25, '/insight/Duo Stick (3 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Makeup Fixer 75ml', insight_brand_id, 'FIXERS & REMOVERS', false, 240, 180, 180, 240, 25, '/insight/Makeup Fixer 75ml.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Clean & Win Makeup Remover (3 variants)', insight_brand_id, 'FIXERS & REMOVERS', false, 260, 195, 195, 260, 25, '/insight/Clean & Win Makeup Remover (3 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Makeup Remover Wipes', insight_brand_id, 'FIXERS & REMOVERS', false, 75, 56, 56, 75, 25, '/insight/Makeup Remover Wipes.jpg')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Organic Sindoor SND-16 (02 shades: Red, Maroon)', insight_brand_id, 'SINDOOR', false, 60, 45, 45, 60, 25, '/insight/Organic Sindoor SND-16 (02 shades- Red, Maroon).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Liquid Sindoor SND-19 (Red, Maroon)', insight_brand_id, 'SINDOOR', false, 130, 98, 98, 130, 25, '/insight/Liquid Sindoor SND-19 (Red, Maroon).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Glide On Lip Liner (24 shades)', insight_brand_id, 'LIP LINER', false, 95, 71, 71, 95, 25, '/insight/Glide On Lip Liner (24 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Glide On Lip Liner Set of 12 Tin Combo', insight_brand_id, 'LIP LINER', false, 945, 709, 709, 945, 25, '/insight/Glide On Lip Liner Set of 12 Tin Combo.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Color Rich Lip Liner LP-09 (14 shades)', insight_brand_id, 'LIP LINER', false, 100, 75, 75, 100, 25, '/insight/Color Rich Lip Liner LP-09 (14 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Matte Lipstick L-21 (24 shades)', insight_brand_id, 'LIPSTICK', false, 120, 90, 90, 120, 25, '/insight/Matte Lipstick L-21 (24 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Color Rich Lipstick L-23 (24 shades)', insight_brand_id, 'LIPSTICK', false, 120, 90, 90, 120, 25, '/insight/Color Rich Lipstick L-23 (24 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Prime Matte Lipstick L-30 (12 shades)', insight_brand_id, 'LIPSTICK', false, 200, 150, 150, 200, 25, '/insight/Prime Matte Lipstick L-30 (12 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Mojo Lipstick L-29 (12 shades)', insight_brand_id, 'LIPSTICK', false, 599, 449, 449, 599, 25, '/insight/Mojo Lipstick L-29 (12 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Non Transfer Matte Lipstick LL-03 (28 shades)', insight_brand_id, 'LIPSTICK', false, 120, 90, 90, 120, 25, '/insight/Non Transfer Matte Lipstick LL-03 (28 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Non Transfer Matte Lipstick LL-04 (24 shades)', insight_brand_id, 'LIPSTICK', false, 120, 90, 90, 120, 25, '/insight/Non Transfer Matte Lipstick LL-04 (24 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Mega Last Crayon Lipstick LL-05 (24 shades)', insight_brand_id, 'LIPSTICK', false, 120, 90, 90, 120, 25, '/insight/Mega Last Crayon Lipstick LL-05 (24 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Non Transfer Super Stay Matte Lipstick LL-06 (30 shades)', insight_brand_id, 'LIPSTICK', false, 120, 90, 90, 120, 25, '/insight/Non Transfer Super Stay Matte Lipstick LL-06 (30 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Forever Matte Lip Color LL-10 (24 shades)', insight_brand_id, 'LIPSTICK', false, 120, 90, 90, 120, 25, '/insight/Forever Matte Lip Color LL-10 (24 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Mousse Lipstick LL-11 (12 shades)', insight_brand_id, 'LIPSTICK', false, 120, 90, 90, 120, 25, '/insight/Mousse Lipstick LL-11 (12 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Smudge Free Lip Mud LG-60 (24 shades)', insight_brand_id, 'LIPSTICK', false, 190, 143, 143, 190, 25, '/insight/Smudge Free Lip Mud LG-60 (24 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Non-Transfer Liquid Lipstick LG-39 (24 shades)', insight_brand_id, 'LIP COLOR', false, 120, 90, 90, 120, 25, '/insight/Non-Transfer Liquid Lipstick LG-39 (24 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Non-Transfer Lip Color LG-40 (29 shades)', insight_brand_id, 'LIP COLOR', false, 120, 90, 90, 120, 25, '/insight/Non-Transfer Lip Color LG-40 (29 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Long Wear Color Rich Lip Gloss LG-41 (12 shades)', insight_brand_id, 'LIP COLOR', false, 120, 90, 90, 120, 25, '/insight/Long Wear Color Rich Lip Gloss LG-41 (12 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Matte Lip Ink LG-43 (30 shades)', insight_brand_id, 'LIP COLOR', false, 120, 90, 90, 120, 25, '/insight/Matte Lip Ink LG-43 (30 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Matte Lip Serum LG-45 (29 shades)', insight_brand_id, 'LIP COLOR', false, 120, 90, 90, 120, 25, '/insight/Matte Lip Serum LG-45 (29 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('No Smudge Lip Color LG-49 (24 shades)', insight_brand_id, 'LIP COLOR', false, 120, 90, 90, 120, 25, '/insight/No Smudge Lip Color LG-49 (24 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Stay Matte Lip Color LG-50 (24 shades)', insight_brand_id, 'LIP COLOR', false, 120, 90, 90, 120, 25, '/insight/Stay Matte Lip Color LG-50 (24 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Soft Lip Creme LG-57 (12 shades)', insight_brand_id, 'LIP COLOR', false, 176, 132, 132, 176, 25, '/insight/Soft Lip Creme LG-57 (12 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Creme Matte Mousse LG-59 (24 shades)', insight_brand_id, 'LIP COLOR', false, 170, 128, 128, 170, 25, '/insight/Creme Matte Mousse LG-59 (24 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Peptide Infused Lip Oil LG-54 (06 shades)', insight_brand_id, 'LIP GLOSS', false, 240, 180, 180, 240, 25, '/insight/Peptide Infused Lip Oil LG-54 (06 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Hydrating Gloss LG-55 (04 shades)', insight_brand_id, 'LIP GLOSS', false, 120, 90, 90, 120, 25, '/insight/Hydrating Gloss LG-55 (04 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Lip Cream LG-56 (12 shades)', insight_brand_id, 'LIP GLOSS', false, 120, 90, 90, 120, 25, '/insight/Lip Cream LG-56 (12 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Lip Butter LP-06 (04 shades)', insight_brand_id, 'LIP BALM', false, 120, 90, 90, 120, 25, '/insight/Lip Butter LP-06 (04 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Hydrating Tinted Lip Balm LP-07 (03 shades)', insight_brand_id, 'LIP BALM', false, 120, 90, 90, 120, 25, '/insight/Hydrating Tinted Lip Balm LP-07 (03 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Smudge Free Eyebrow Pencil EP-01 (03 shades)', insight_brand_id, 'EYEBROW', false, 170, 128, 128, 170, 25, '/insight/Smudge Free Eyebrow Pencil EP-01 (03 shades).jpg')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Eyebrow Palette EP-02', insight_brand_id, 'EYEBROW', false, 190, 143, 143, 190, 25, '/insight/Eyebrow Palette EP-02.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Waterproof Eyeliner EL-32 Shiny', insight_brand_id, 'EYELINER', false, 125, 94, 94, 125, 25, '/insight/Waterproof Eyeliner EL-32 Shiny.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Waterproof Eyeliner EL-32 Matte', insight_brand_id, 'EYELINER', false, 125, 94, 94, 125, 25, '/insight/Waterproof Eyeliner EL-32 Matte.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Waterproof Eyeliner EL-233 Matte', insight_brand_id, 'EYELINER', false, 75, 56, 56, 75, 25, '/insight/Waterproof Eyeliner EL-233 Matte.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Waterproof Eyeliner EL-233 Shiny', insight_brand_id, 'EYELINER', false, 95, 71, 71, 95, 25, '/insight/Waterproof Eyeliner EL-233 Shiny.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Liner Express EL-46 Colours (05 shades)', insight_brand_id, 'EYELINER', false, 190, 143, 143, 190, 25, '/insight/Liner Express EL-46 Colours (05 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Smudge Free Holographic Eyeliner EL-50 (04 shades)', insight_brand_id, 'EYELINER', false, 300, 225, 225, 300, 25, '/insight/Smudge Free Holographic Eyeliner EL-50 (04 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Waterproof Eye Ink EL-52 Black', insight_brand_id, 'EYELINER', false, 185, 139, 139, 185, 25, '/insight/Waterproof Eye Ink EL-52 Black.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Waterproof Eye Ink EL-52 Colours', insight_brand_id, 'EYELINER', false, 200, 150, 150, 200, 25, '/insight/Waterproof Eye Ink EL-52 Colours.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('No Smudge Eyeliner EL-53 (Matte)', insight_brand_id, 'EYELINER', false, 95, 71, 71, 95, 25, '/insight/No Smudge Eyeliner EL-53 (Matte).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Double Effect Eyepen EL-54', insight_brand_id, 'EYELINER', false, 260, 195, 195, 260, 25, '/insight/Double Effect Eyepen EL-54.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Eye Brow Define Duo 2-in-1 EL-55 (03 shades)', insight_brand_id, 'EYELINER', false, 270, 203, 203, 270, 25, '/insight/Eye Brow Define Duo 2-in-1 EL-55 (03 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Liquid Eyeshadow LES-03 (09 shades)', insight_brand_id, 'EYESHADOW', false, 270, 203, 203, 270, 25, '/insight/Liquid Eyeshadow LES-03 (09 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Pro Eyeshadow ES-110 (3 variants)', insight_brand_id, 'EYESHADOW', false, 270, 203, 203, 270, 25, '/insight/Pro Eyeshadow ES-110 (3 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Showtime Eyeshadow Palette ES-112 (7 variants)', insight_brand_id, 'EYESHADOW', false, 275, 206, 206, 275, 25, '/insight/Showtime Eyeshadow Palette ES-112 (7 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Eyeshadow Palette ES-115 (4 variants)', insight_brand_id, 'EYESHADOW', false, 290, 218, 218, 290, 25, '/insight/Eyeshadow Palette ES-115 (4 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Glide & Glow Eyeshadow Stick ES-116 (14 shades)', insight_brand_id, 'EYESHADOW', false, 275, 206, 206, 275, 25, '/insight/Glide & Glow Eyeshadow Stick ES-116 (14 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Duo Eyeshadow Stick ES-117 (05 shades)', insight_brand_id, 'EYESHADOW', false, 280, 210, 210, 280, 25, '/insight/Duo Eyeshadow Stick ES-117 (05 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('All Eyes On You Eyeshadow Palette MK-04 (15-in-1)', insight_brand_id, 'EYESHADOW', false, 335, 251, 251, 335, 25, '/insight/All Eyes On You Eyeshadow Palette MK-04 (15-in-1).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Winged Eyes Eyeshadow Palette MK-06 (4 variants)', insight_brand_id, 'EYESHADOW', false, 290, 218, 218, 290, 25, '/insight/Winged Eyes Eyeshadow Palette MK-06 (4 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Eyeshadow Palette MK-07 (02 variants)', insight_brand_id, 'EYESHADOW', false, 275, 206, 206, 275, 25, '/insight/Eyeshadow Palette MK-07 (02 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Gorgeous 16 Eyeshadow Palette MK-09 (3 variants)', insight_brand_id, 'EYESHADOW', false, 425, 319, 319, 425, 25, '/insight/Gorgeous 16 Eyeshadow Palette MK-09 (3 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Ready Set Glam Eyeshadow Palette MK-19 (4 variants)', insight_brand_id, 'EYESHADOW', false, 190, 143, 143, 190, 25, '/insight/Ready Set Glam Eyeshadow Palette MK-19 (4 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Lash Extension Mascara MAS-07 (Black)', insight_brand_id, 'MASCARA & KAJAL', false, 120, 90, 90, 120, 25, '/insight/Lash Extension Mascara MAS-07 (Black).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Perfect Ultra Curl Mascara MAS-21 (Black)', insight_brand_id, 'MASCARA & KAJAL', false, 120, 90, 90, 120, 25, '/insight/Perfect Ultra Curl Mascara MAS-21 (Black).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Stay Real Lash Mascara MAS-23 (Transparent)', insight_brand_id, 'MASCARA & KAJAL', false, 120, 90, 90, 120, 25, '/insight/Stay Real Lash Mascara MAS-23 (Transparent).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Everlasting Voluminous Mascara MAS-24 (Black)', insight_brand_id, 'MASCARA & KAJAL', false, 265, 199, 199, 265, 25, '/insight/Everlasting Voluminous Mascara MAS-24 (Black).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Long Lasting Mascara MAS-25 (Black)', insight_brand_id, 'MASCARA & KAJAL', false, 270, 203, 203, 270, 25, '/insight/Long Lasting Mascara MAS-25 (Black).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Mascara MAS-202 (Black)', insight_brand_id, 'MASCARA & KAJAL', false, 120, 90, 90, 120, 25, '/insight/Mascara MAS-202 (Black).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Brow Tattoo Smudge Free EB-02 (03 shades)', insight_brand_id, 'MASCARA & KAJAL', false, 205, 154, 154, 205, 25, '/insight/Brow Tattoo Smudge Free EB-02 (03 shades).jpg')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Super Kajal K-01 Black', insight_brand_id, 'MASCARA & KAJAL', false, 95, 71, 71, 95, 25, '/insight/Super Kajal K-01 Black.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Super Kajal K-01 Colours', insight_brand_id, 'MASCARA & KAJAL', false, 120, 90, 90, 120, 25, '/insight/Super Kajal K-01 Colours.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Intense Kohl Kajal K-02 Black', insight_brand_id, 'MASCARA & KAJAL', false, 95, 71, 71, 95, 25, '/insight/Intense Kohl Kajal K-02 Black.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Intense Kohl Kajal K-02 Colours', insight_brand_id, 'MASCARA & KAJAL', false, 95, 71, 71, 95, 25, '/insight/Intense Kohl Kajal K-02 Colours.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('5 Toxic Free Nail Polish DH-127', insight_brand_id, 'NAIL POLISH', false, 85, 64, 64, 85, 25, '/insight/5 Toxic Free Nail Polish DH-127.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Gel Nail Polish DH-132 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 45, 34, 34, 45, 25, '/insight/Gel Nail Polish DH-132 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish Smooth Finish DH-134 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 45, 34, 34, 45, 25, '/insight/Nail Polish Smooth Finish DH-134 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Color DH-137 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 45, 34, 34, 45, 25, '/insight/Nail Color DH-137 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('One Coat Nail Polish DH-141 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 50, 38, 38, 50, 25, '/insight/One Coat Nail Polish DH-141 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Mega Lasting Nail Polish DH-142 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 60, 45, 45, 60, 25, '/insight/Mega Lasting Nail Polish DH-142 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish DH-144 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 50, 38, 38, 50, 25, '/insight/Nail Polish DH-144 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish DH-145 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 60, 45, 45, 60, 25, '/insight/Nail Polish DH-145 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish DH-146 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 55, 41, 41, 55, 25, '/insight/Nail Polish DH-146 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish DH-147 (144 shades)', insight_brand_id, 'NAIL POLISH', false, 120, 90, 90, 120, 25, '/insight/Nail Polish DH-147 (144 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish DH-148 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 45, 34, 34, 45, 25, '/insight/Nail Polish DH-148 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish DH-149 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 55, 41, 41, 55, 25, '/insight/Nail Polish DH-149 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish Soft Shades DH-150 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 65, 49, 49, 65, 25, '/insight/Nail Polish Soft Shades DH-150 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish DH-151 (202 shades)', insight_brand_id, 'NAIL POLISH', false, 65, 49, 49, 65, 25, '/insight/Nail Polish DH-151 (202 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish Gel Finish DH-153 (120 shades)', insight_brand_id, 'NAIL POLISH', false, 120, 90, 90, 120, 25, '/insight/Nail Polish Gel Finish DH-153 (120 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish Luminous DH-154 (24 shades)', insight_brand_id, 'NAIL POLISH', false, 149, 112, 112, 149, 25, '/insight/Nail Polish Luminous DH-154 (24 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish DH-155 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 50, 38, 38, 50, 25, '/insight/Nail Polish DH-155 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish DH-156 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 50, 38, 38, 50, 25, '/insight/Nail Polish DH-156 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish DH-157 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 35, 26, 26, 35, 25, '/insight/Nail Polish DH-157 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish DH-159 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 60, 45, 45, 60, 25, '/insight/Nail Polish DH-159 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Mega Lasting Nail Polish DH-160 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 60, 45, 45, 60, 25, '/insight/Mega Lasting Nail Polish DH-160 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish DH-161 (180 shades)', insight_brand_id, 'NAIL POLISH', false, 50, 38, 38, 50, 25, '/insight/Nail Polish DH-161 (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish NP-208 KHAKI (180 shades)', insight_brand_id, 'NAIL POLISH', false, 45, 34, 34, 45, 25, '/insight/Nail Polish NP-208 KHAKI (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish NP-208 PVC (180 shades)', insight_brand_id, 'NAIL POLISH', false, 45, 34, 34, 45, 25, '/insight/Nail Polish NP-208 PVC (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish NP-210 PVC (180 shades)', insight_brand_id, 'NAIL POLISH', false, 45, 34, 34, 45, 25, '/insight/Nail Polish NP-210 PVC (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Gel Shine Nail Polish NP-2111 KHAKI (180 shades)', insight_brand_id, 'NAIL POLISH', false, 70, 53, 53, 70, 25, '/insight/Gel Shine Nail Polish NP-2111 KHAKI (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Gel Shine Nail Polish NP-2111 PVC (180 shades)', insight_brand_id, 'NAIL POLISH', false, 70, 53, 53, 70, 25, '/insight/Gel Shine Nail Polish NP-2111 PVC (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish NP-2115 KHAKI (180 shades)', insight_brand_id, 'NAIL POLISH', false, 70, 53, 53, 70, 25, '/insight/Nail Polish NP-2115 KHAKI (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish NP-2115 PVC (180 shades)', insight_brand_id, 'NAIL POLISH', false, 70, 53, 53, 70, 25, '/insight/Nail Polish NP-2115 PVC (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish NP-286 KHAKI (180 shades)', insight_brand_id, 'NAIL POLISH', false, 40, 30, 30, 40, 25, '/insight/Nail Polish NP-286 KHAKI (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish NP-286 PVC (180 shades)', insight_brand_id, 'NAIL POLISH', false, 40, 30, 30, 40, 25, '/insight/Nail Polish NP-286 PVC (180 shades).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish Remover Wipes 30 (Apple, Strawberry, Lemon)', insight_brand_id, 'NAIL POLISH REMOVER', false, 60, 45, 45, 60, 25, '/insight/Nail Polish Remover Wipes 30 (Apple, Strawberry, Lemon).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Nail Polish Remover Wipes 40 (Red Rose, Musk, Lavender)', insight_brand_id, 'NAIL POLISH REMOVER', false, 80, 60, 60, 80, 25, '/insight/Nail Polish Remover Wipes 40 (Red Rose, Musk, Lavender).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Instant Nail Polish Remover 60ml (3 variants)', insight_brand_id, 'NAIL POLISH REMOVER', false, 59, 44, 44, 59, 25, '/insight/Instant Nail Polish Remover 60ml (3 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Instant Nail Polish Remover 100ml (3 variants)', insight_brand_id, 'NAIL POLISH REMOVER', false, 85, 64, 64, 85, 25, '/insight/Instant Nail Polish Remover 100ml (3 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Dip & Go Nail Polish Remover (3 variants)', insight_brand_id, 'NAIL POLISH REMOVER', false, 60, 45, 45, 60, 25, '/insight/Dip & Go Nail Polish Remover (3 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Beauty Blender Sponge Applicator (3 variants)', insight_brand_id, 'ACCESSORIES', false, 145, 109, 109, 145, 25, '/insight/Beauty Blender Sponge Applicator (3 variants).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Hair Brush Round & Curl', insight_brand_id, 'ACCESSORIES', false, 240, 180, 180, 240, 25, '/insight/Hair Brush Round & Curl.png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Hair Brush Round (3 variants: Red, Blue, Black)', insight_brand_id, 'ACCESSORIES', false, 130, 98, 98, 130, 25, '/insight/Hair Brush Round (3 variants- Red, Blue, Black).png')
  ON CONFLICT DO NOTHING;

  INSERT INTO products (name, brand_id, category, has_variants, mrp_price, selling_price, price, original_price, discount, image_url)
  VALUES ('Hair Brush Flat', insight_brand_id, 'ACCESSORIES', false, 130, 98, 98, 130, 25, '/insight/Hair Brush Flat.png')
  ON CONFLICT DO NOTHING;

END $$;
