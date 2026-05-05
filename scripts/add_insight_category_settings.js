import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Need to load env if running via node directly
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const defaultCategoryImages = {
  'PRIMER': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400',
  'BLUSHER': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
  'CONCEALER': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400',
  'FOUNDATION': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400',
  'COMPACT': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400',
  'POWDER': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400',
  'HIGHLIGHTER': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
  'FIXERS & REMOVERS': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400',
  'SINDOOR': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
  'LIP LINER': 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
  'LIPSTICK': 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
  'LIP COLOR': 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
  'LIP GLOSS': 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
  'LIP BALM': 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
  'EYEBROW': 'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=400',
  'EYELINER': 'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=400',
  'EYESHADOW': 'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=400',
  'MASCARA & KAJAL': 'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=400',
  'NAIL POLISH': 'https://images.unsplash.com/photo-1634749377443-6902409746e0?auto=format&fit=crop&q=80&w=400',
  'NAIL POLISH REMOVER': 'https://images.unsplash.com/photo-1634749377443-6902409746e0?auto=format&fit=crop&q=80&w=400',
  'ACCESSORIES': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400'
};

async function insertCategorySettings() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Insight').single();

  if (!brand) {
    console.error('Insight brand not found.');
    return;
  }

  // First, let's delete existing category settings for Insight to avoid duplicates
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
    console.log('Category settings for Insight successfully inserted!');
  }
}

insertCategorySettings();
