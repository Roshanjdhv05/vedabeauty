import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
const env = envLines.reduce((acc, line) => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data: brand } = await supabase.from('brands').select('id, name').ilike('name', '%insight%').limit(1).single();
  const { data: products } = await supabase.from('products').select('id, name').eq('brand_id', brand.id);
  const { data: variants, error } = await supabase.from('product_variants').select('*').in('product_id', products.map(p => p.id));
  
  if (error) console.error("Error:", error);
  console.log("Products length:", products.length);
  console.log("Variants length:", variants?.length || 0);
  if (variants && variants.length > 0) {
      console.log("First variant:", variants[0]);
  }
}

test();
