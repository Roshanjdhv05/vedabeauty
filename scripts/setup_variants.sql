-- Add has_variants to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS has_variants BOOLEAN DEFAULT false;

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('shade', 'size', 'volume')),
    color_code TEXT, -- optional hex code for shades
    image_url TEXT, -- optional image override for variant
    price DECIMAL(10, 2), -- optional price override
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update cart table to support variants
ALTER TABLE cart ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL;

-- Enable RLS for product_variants
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Create policies for product_variants
-- Allow public to read
CREATE POLICY "Allow public read variants" ON product_variants
    FOR SELECT USING (true);

-- Allow authenticated users (admin) to manage variants
-- Note: Adjust this policy based on your actual admin role check if needed
CREATE POLICY "Allow admin to manage variants" ON product_variants
    FOR ALL USING (auth.role() = 'authenticated');
