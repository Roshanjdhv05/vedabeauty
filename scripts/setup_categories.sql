
-- 1. Create the category_settings table
CREATE TABLE IF NOT EXISTS public.category_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL, -- e.g., 'Lips', 'Eyes', 'Face', 'Brushes'
    image_url TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.category_settings ENABLE ROW LEVEL SECURITY;

-- 3. Create public read policy
CREATE POLICY "Public Read Access" ON public.category_settings
    FOR SELECT USING (true);

-- 4. Create admin full access policy (Authenticated users)
CREATE POLICY "Admin Full Access" ON public.category_settings
    FOR ALL USING (auth.role() = 'authenticated');

-- 5. Seed initial categories (matching current hardcoded list)
INSERT INTO public.category_settings (name, image_url, display_order)
VALUES 
    ('Lips', 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400', 1),
    ('Eyes', 'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=400', 2),
    ('Face', 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400', 3),
    ('Brushes', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=400', 4),
    ('Tools & Accessories', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400', 5),
    ('Sponges & Blenders', 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400', 6)
ON CONFLICT (name) DO NOTHING;
