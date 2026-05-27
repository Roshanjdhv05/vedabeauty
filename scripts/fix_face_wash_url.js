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

async function fix() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Sugar Pop').single();
  
  const { error } = await supabase.from('products').update({ image_url: '/sugar pop/VITAMIN C TEA TREE FACE WASH.jpg' })
    .eq('brand_id', brand.id)
    .ilike('name', '%Vitamin C & Tea Tree Face Wash%');
  
  if (error) {
    console.error('DB Update Error:', error);
  } else {
    console.log('Fixed DB mapping for Vitamin C & Tea Tree Face Wash');
  }
}
fix();
