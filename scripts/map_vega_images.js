import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function mapImages() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Vega').single();
  if (!brand) { console.error('Vega brand not found'); return; }

  const { data: products } = await supabase.from('products').select('id, name').eq('brand_id', brand.id);
  
  const publicVegaPath = path.join(process.cwd(), 'public', 'vega');
  const files = fs.readdirSync(publicVegaPath);

  let updated = 0;
  let missed = 0;

  for (const product of products) {
    // 1. match the name of the product and name of the image
    let match = files.find(f => f.replace(/\.[^/.]+$/, "").toLowerCase() === product.name.toLowerCase());
    
    // 2. check for the code of the product and name code saved in the image
    if (!match) {
      const codeMatch = product.name.match(/\(([^)]+)\)/);
      if (codeMatch) {
        const code = codeMatch[1].toLowerCase().replace(/\//g, '-');
        
        const escapedCode = code.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(^|[^a-z0-9])${escapedCode}([^a-z0-9]|$)`, 'i');
        
        const possibleMatches = files.filter(f => regex.test(f));
        if (possibleMatches.length === 1) {
          match = possibleMatches[0];
        } else if (possibleMatches.length > 1) {
          match = possibleMatches[0]; 
        }
      }
    }

    if (match) {
      const imageUrl = `/vega/${match}`;
      const { error } = await supabase.from('products').update({ image_url: imageUrl }).eq('id', product.id);
      if (error) {
        console.error(`Error updating ${product.name}:`, error.message);
      } else {
        console.log(`✅ ${product.name} → ${imageUrl}`);
        updated++;
      }
    } else {
      console.warn(`❌ No image mapping for: "${product.name}"`);
      missed++;
    }
  }
  console.log(`\nDone! ${updated} updated, ${missed} missed.`);
}

mapImages();
