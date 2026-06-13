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

async function checkAndDelete() {
  const { data: brand } = await supabase.from('brands').select('id, name').ilike('name', '%insight%').single();
  const { data: products } = await supabase.from('products').select('id, name, image_url').eq('brand_id', brand.id);
  
  const toDelete = [];
  for (const p of products) {
    if (!p.image_url) {
      toDelete.push(p);
      continue;
    }
    
    // Check if the image file exists locally
    // Remove query params if any, and decode URI just in case
    const localPath = path.join(process.cwd(), 'public', decodeURIComponent(p.image_url.split('?')[0]));
    
    if (!fs.existsSync(localPath)) {
      console.log(`Missing file for: ${p.name} - ${localPath}`);
      toDelete.push(p);
    }
  }
  
  console.log(`Found ${toDelete.length} products with missing local images.`);
  
  let deleted = 0;
  for (const p of toDelete) {
    const { error } = await supabase.from('products').delete().eq('id', p.id);
    if (!error) deleted++;
  }
  
  console.log(`Deleted ${deleted} products successfully.`);
}

checkAndDelete();
