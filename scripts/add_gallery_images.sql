-- Step 1: Add gallery_images column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_images TEXT[] DEFAULT '{}';

-- Step 2: Set gallery images for Strobe Cream (Faces Canada)
UPDATE products
SET gallery_images = ARRAY[
  '/faces%20canada/STROBE%20CREAM(1).png',
  '/faces%20canada/STROBE%20CREAM(2).png',
  '/faces%20canada/STROBE%20CREAM(3).png',
  '/faces%20canada/STROBE%20CREAM(4).png'
]
WHERE name = 'Strobe Cream'
  AND brand_id = (SELECT id FROM brands WHERE name = 'Faces Canada');
