import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const INSIGHT_CATEGORY_MAPPING = {
  'FACE': ['PRIMER', 'BLUSHER', 'CONCEALER', 'FOUNDATION', 'COMPACT', 'POWDER', 'HIGHLIGHTER', 'FIXERS & REMOVERS', 'SINDOOR'],
  'LIPS': ['LIP LINER', 'LIPSTICK', 'LIP COLOR', 'LIP GLOSS', 'LIP BALM'],
  'EYES': ['EYEBROW', 'EYELINER', 'EYESHADOW', 'MASCARA & KAJAL'],
  'ACCESSORIES': ['ACCESSORIES'] 
};

async function updateCategoryImages() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Insight').single();
  
  if (!brand) {
    console.error('Brand Insight not found');
    return;
  }

  // Fetch all insight products
  const { data: products } = await supabase.from('products').select('name, category, image_url').eq('brand_id', brand.id);

  console.log('Updating category cover images...');

  for (const [topLevel, subcats] of Object.entries(INSIGHT_CATEGORY_MAPPING)) {
    // Find first product that belongs to one of these subcategories
    const product = products.find(p => subcats.includes(p.category.toUpperCase()));
    
    if (product) {
      console.log(`Found product "${product.name}" for category ${topLevel}. Image: ${product.image_url}`);
      
      const { error } = await supabase
        .from('category_settings')
        .update({ image_url: product.image_url })
        .eq('brand_id', brand.id)
        .eq('name', topLevel);
        
      if (error) {
        console.error(`Error updating ${topLevel}:`, error);
      } else {
        console.log(`✅ Successfully updated ${topLevel} cover image.`);
      }
    } else {
      console.log(`No product found for category ${topLevel}`);
    }
  }

  console.log('Done.');
}

updateCategoryImages();
