import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TOP_LEVEL_CATEGORIES = {
  'FACE': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400',
  'LIPS': 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
  'EYES': 'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=400',
  'NAILS': 'https://images.unsplash.com/photo-1634749377443-6902409746e0?auto=format&fit=crop&q=80&w=400',
  'ACCESSORIES': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400'
};

async function updateCategorySettings() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Insight').single();
  
  if (!brand) {
    console.error('Brand Insight not found');
    return;
  }

  // Delete all old category settings for Insight
  await supabase.from('category_settings').delete().eq('brand_id', brand.id);

  // Insert the top-level categories
  const { error } = await supabase.from('category_settings').insert(
    Object.keys(TOP_LEVEL_CATEGORIES).map(name => ({
      brand_id: brand.id,
      name,
      image_url: TOP_LEVEL_CATEGORIES[name],
      is_active: true
    }))
  );

  if (error) console.error('Error inserting top level categories:', error);
  else console.log('Successfully updated Insight category settings to use Top Level categories.');
}

updateCategorySettings();
