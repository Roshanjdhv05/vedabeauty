import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function removeNailsCategory() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Insight').single();
  
  if (!brand) {
    console.error('Brand Insight not found');
    return;
  }

  console.log('Removing NAILS category and products from Insight...');

  // 1. Remove from category_settings
  const { error: catError } = await supabase
    .from('category_settings')
    .delete()
    .eq('brand_id', brand.id)
    .eq('name', 'NAILS');

  if (catError) console.error('Error deleting NAILS category setting:', catError);
  else console.log('Successfully deleted NAILS category setting');

  // 2. Remove products
  const { error: prodError } = await supabase
    .from('products')
    .delete()
    .eq('brand_id', brand.id)
    .eq('category', 'NAIL POLISH REMOVER');

  if (prodError) console.error('Error deleting nail polish remover products:', prodError);
  else console.log('Successfully deleted nail polish remover products');

  console.log('Done.');
}

removeNailsCategory();
