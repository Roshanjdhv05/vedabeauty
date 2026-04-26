import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const defaultCategoryImages = {
  'Shampoos': 'https://images.unsplash.com/photo-1626806819282-2c1dc01a5e0c?w=400&q=80',
  'Conditioners': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400&q=80',
  'Hair Mask': 'https://images.unsplash.com/photo-1608248593842-8d76c34bc149?w=400&q=80',
  'Face Serums': 'https://images.unsplash.com/photo-1629198688000-71f23e745b6e?w=400&q=80',
  'Sunscreens': 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&q=80',
  'Moisturizers': 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80',
  'Night Cream': 'https://images.unsplash.com/photo-1617897903246-719242758050?w=400&q=80',
  'Face Washes': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
  'Face Gel': 'https://images.unsplash.com/photo-1611077544669-e0e64c399b00?w=400&q=80'
};

async function insertCategorySettings() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Pilgrim').single();

  if (!brand) {
    console.error('Pilgrim brand not found.');
    return;
  }

  // First, let's delete existing category settings for Pilgrim to avoid duplicates
  await supabase.from('category_settings').delete().eq('brand_id', brand.id);

  const inserts = Object.keys(defaultCategoryImages).map(catName => ({
    brand_id: brand.id,
    name: catName,
    image_url: defaultCategoryImages[catName],
    is_active: true
  }));

  const { error } = await supabase.from('category_settings').insert(inserts);

  if (error) {
    console.error('Error inserting category settings:', error);
  } else {
    console.log('Category settings for Pilgrim successfully inserted!');
  }
}

insertCategorySettings();
