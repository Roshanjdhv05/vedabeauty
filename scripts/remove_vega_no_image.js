import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkAndDelete() {
  const { data: brand } = await supabase.from('brands').select('id, name').ilike('name', 'vega').single();
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
  
  console.log(`Found ${toDelete.length} products with missing local images or no image_url.`);
  
  let deleted = 0;
  for (const p of toDelete) {
    const { error } = await supabase.from('products').delete().eq('id', p.id);
    if (error) {
      console.error(`Failed to delete ${p.name}:`, error);
    } else {
      deleted++;
    }
  }
  
  console.log(`Deleted ${deleted} products successfully.`);
}

checkAndDelete();
