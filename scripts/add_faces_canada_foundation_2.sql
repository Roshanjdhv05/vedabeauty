-- Add new product: "3 in 1 All Day Hydra Matte Foundation 2" for Faces Canada
DO $$
DECLARE
    brand_id_val uuid;
    product_id_val uuid;
    selling_price_val numeric := 260; -- 20% discount on 325
BEGIN
    -- 1. Get Faces Canada brand ID
    SELECT id INTO brand_id_val FROM brands WHERE name ILIKE 'Faces Canada' LIMIT 1;
    
    IF brand_id_val IS NULL THEN
        RAISE EXCEPTION 'Faces Canada brand not found';
    END IF;

    -- 2. Insert the new Product
    INSERT INTO products (
        name,
        brand_id,
        category,
        has_variants,
        mrp_price,
        selling_price,
        price,
        original_price,
        discount,
        image_url
    )
    VALUES (
        '3 in 1 All Day Hydra Matte Foundation 2',
        brand_id_val,
        'FACE',
        true,
        325,               -- MRP
        selling_price_val, -- Selling Price (after 20% discount)
        selling_price_val, -- Price
        325,               -- Original Price
        20,                -- Discount percentage
        '/facescanada/3 in 1 All Day Hydra Matte Foundation(1)/Absolute Ivory.png' -- Using an image from the (1) folder as fallback
    )
    RETURNING id INTO product_id_val;

    -- 3. Insert the variant (18 ml)
    INSERT INTO product_variants (
        product_id,
        name,
        type,
        mrp_price,
        selling_price,
        price,
        stock,
        image_url
    )
    VALUES (
        product_id_val,
        '18 ml',
        'volume',
        325,
        selling_price_val,
        selling_price_val,
        100,
        '/facescanada/3 in 1 All Day Hydra Matte Foundation(1)/Absolute Ivory.png'
    );

    RAISE NOTICE 'Product and variant added successfully!';
END $$;
