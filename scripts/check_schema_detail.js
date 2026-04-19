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

async function checkSchema() {
  const { data: products, error } = await supabase.from('products').select('*').limit(1);
  if (error) {
    console.error(error);
  } else {
    console.log('Product columns:', Object.keys(products[0]));
    const brandId = products[0].brand_id;
    console.log('Brand ID from product:', brandId);
    
    if (brandId) {
      const { data: brand, error: bError } = await supabase.from('brands').select('*').eq('id', brandId);
      console.log('Brand lookup result:', brand);
      if (bError) console.error('Brand lookup error:', bError);
    }
  }
}

checkSchema();
