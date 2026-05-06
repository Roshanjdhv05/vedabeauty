-- Insert Insight Combo Offer Product (Corrected Schema)
INSERT INTO products (
    id,
    name,
    description,
    brand_id,
    category,
    mrp_price,
    selling_price,
    price,
    original_price,
    discount,
    image_url,
    has_variants
) VALUES (
    'e1f8c14a-5f6b-4e1a-8c1d-9e2f3a4b5c6d',
    'Insight Luxury Combo Offer',
    'Experience luxury beauty with our curated Insight Combo. Includes Primer, Foundation, Compact, Lip Liner, Eyeliner, and Fixer for the perfect professional look.',
    'f1156917-d78d-4f25-95df-1d4b7b6ae163',
    'FACE',
    1265,
    885,
    885,
    1265,
    30,
    '/insight_combo_offer.png',
    false
) ON CONFLICT (id) DO UPDATE SET
    selling_price = EXCLUDED.selling_price,
    mrp_price = EXCLUDED.mrp_price,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    discount = EXCLUDED.discount,
    image_url = EXCLUDED.image_url;
