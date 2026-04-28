-- 1. FIX STORAGE PERMISSIONS
-- Create policies for 'product-images' bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Drop existing policies if they exist to avoid errors
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload" ON storage.objects;
DROP POLICY IF EXISTS "Public Update" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete" ON storage.objects;

-- Policy to allow anyone to view images
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (true);

-- Policy to allow anyone to upload images (This fixes the RLS error)
CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK (true);

-- Policy to allow anyone to update/delete images
CREATE POLICY "Public Update" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "Public Delete" ON storage.objects FOR DELETE USING (true);

-- Also fix for 'images' bucket used in Category Management
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Upload Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update Images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete Images" ON storage.objects;

CREATE POLICY "Public Access Images" ON storage.objects FOR SELECT USING (true);
CREATE POLICY "Public Upload Images" ON storage.objects FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Images" ON storage.objects FOR UPDATE USING (true);
CREATE POLICY "Public Delete Images" ON storage.objects FOR DELETE USING (true);

-- 2. FIX TABLE PERMISSIONS (Since app uses custom Admin login instead of Supabase Auth)
-- This ensures that after uploading, the admin can actually save the data.

ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Allow anon to do everything on variants
DROP POLICY IF EXISTS "Allow anon all variants" ON product_variants;
DROP POLICY IF EXISTS "Allow public read variants" ON product_variants;
DROP POLICY IF EXISTS "Allow admin to manage variants" ON product_variants;
CREATE POLICY "Allow anon all variants" ON product_variants FOR ALL USING (true) WITH CHECK (true);

-- Ensure products table also allows anon modifications
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all products" ON products;
CREATE POLICY "Allow anon all products" ON products FOR ALL USING (true) WITH CHECK (true);

-- Ensure brands table also allows anon modifications
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anon all brands" ON brands;
CREATE POLICY "Allow anon all brands" ON brands FOR ALL USING (true) WITH CHECK (true);
