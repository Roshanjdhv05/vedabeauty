import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser for scripts
const envPath = path.resolve(process.cwd(), '.env');
const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
const env = envLines.reduce((acc, line) => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkSugarPop() {
  const { data: brand } = await supabase.from('brands').select('id, name').eq('name', 'Sugar Pop').single();
  if (!brand) {
    console.log('Brand Sugar Pop not found!');
    return;
  }
  console.log('Found brand:', brand);

  const { data: products } = await supabase.from('products').select('*').eq('brand_id', brand.id);
  console.log(`Found ${products.length} products for Sugar Pop.`);
  
  for (const product of products) {
    const { data: variants } = await supabase.from('product_variants').select('*').eq('product_id', product.id);
    console.log(`Product: "${product.name}" (ID: ${product.id}, image_url: ${product.image_url}, has_variants: ${product.has_variants})`);
    if (variants && variants.length > 0) {
      console.log(`  Variants (${variants.length}):`);
      variants.forEach(v => {
        console.log(`    - Name: "${v.name}", Type: "${v.type}", Image URL: "${v.image_url}", Selling Price: ${v.selling_price}`);
      });
    } else {
      console.log('  No variants in DB.');
    }
  }
}

checkSugarPop();
