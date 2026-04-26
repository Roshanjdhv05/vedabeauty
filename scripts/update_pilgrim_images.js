import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getMatch(filename, products) {
  const nameOnly = filename.replace(/\.(png|jpg|jpeg)$/i, '').toLowerCase();
  
  // 1. Direct match
  for (let p of products) {
    if (p.name.toLowerCase() === nameOnly) return p;
  }
  
  // 2. Contains match (file name is substring of product name)
  for (let p of products) {
    if (p.name.toLowerCase().includes(nameOnly)) return p;
  }
  
  // 3. Contains match (product name is substring of file name)
  for (let p of products) {
    if (nameOnly.includes(p.name.toLowerCase())) return p;
  }
  
  // 4. Token overlap
  let bestMatch = null;
  let maxOverlap = 0;
  const fileTokens = nameOnly.split(/[^a-z0-9]+/).filter(t => t.length > 2);
  
  for (let p of products) {
    const pTokens = p.name.toLowerCase().split(/[^a-z0-9]+/).filter(t => t.length > 2);
    let overlap = 0;
    for (let ft of fileTokens) {
      if (pTokens.includes(ft)) overlap++;
    }
    if (overlap > maxOverlap && overlap > 1) { // Require at least 2 tokens to match to be safe
      maxOverlap = overlap;
      bestMatch = p;
    }
  }
  
  return bestMatch;
}

async function updateImages() {
  console.log('Fetching Pilgrim products...');
  
  const { data: brand } = await supabase
    .from('brands')
    .select('id')
    .eq('name', 'Pilgrim')
    .single();
    
  if (!brand) {
    console.error('Pilgrim brand not found.');
    return;
  }

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name')
    .eq('brand_id', brand.id);
    
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  const imagesDir = path.resolve(process.cwd(), 'public/pilgrims');
  const files = fs.readdirSync(imagesDir);
  
  let matchCount = 0;

  for (const file of files) {
    const match = getMatch(file, products);
    if (match) {
      const imageUrl = `/pilgrims/${file}`;
      console.log(`Matched: "${file}" -> "${match.name}"`);
      
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: imageUrl })
        .eq('id', match.id);
        
      if (updateError) {
        console.error(`Error updating ${match.name}:`, updateError);
      } else {
        matchCount++;
      }
    } else {
      console.log(`❌ No match found for file: "${file}"`);
    }
  }
  
  console.log(`\nUpdated images for ${matchCount} out of ${files.length} files.`);
}

updateImages();
