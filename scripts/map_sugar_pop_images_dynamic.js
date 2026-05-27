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

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SUGAR_POP_DIR = path.join(process.cwd(), 'public', 'sugar pop');

function getImageFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return [];
  }
  return fs.readdirSync(dir).filter(f => {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) return false;
    return /\.(png|jpg|jpeg|jfif|webp|avif)$/i.test(f);
  });
}

const images = getImageFiles(SUGAR_POP_DIR);

function normalizeName(name) {
  // Replace symbols and extra spaces, lowercase
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function mapImages() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Sugar Pop').single();
  if (!brand) { console.error('Sugar Pop brand not found'); return; }

  const { data: products } = await supabase.from('products').select('id, name').eq('brand_id', brand.id);

  let updated = 0;
  let missed = 0;

  for (const product of products) {
    const prodNorm = normalizeName(product.name);
    
    // Find matching image
    let bestMatch = null;
    for (const img of images) {
      const imgNorm = normalizeName(path.parse(img).name);
      if (prodNorm.includes(imgNorm) || imgNorm.includes(prodNorm)) {
        bestMatch = img;
        break;
      }
    }

    // fallback for specific naming issues
    if (!bestMatch) {
       for (const img of images) {
         const imgNorm = normalizeName(path.parse(img).name);
         // Example: Longwear Kajal (Black) matches longwearkajal
         const prodNormNoBrackets = normalizeName(product.name.replace(/\(.*?\)/g, ''));
         if (prodNormNoBrackets.includes(imgNorm) || imgNorm.includes(prodNormNoBrackets)) {
           bestMatch = img;
           break;
         }
       }
    }

    if (!bestMatch) {
      console.warn(`❌ No image mapping for: "${product.name}"`);
      missed++;
      continue;
    }

    const imageUrl = `/sugar pop/${bestMatch}`;
    const { error } = await supabase.from('products').update({ image_url: imageUrl }).eq('id', product.id);
    if (error) {
      console.error(`Error updating ${product.name}:`, error.message);
    } else {
      console.log(`✅ ${product.name} → ${imageUrl}`);
      updated++;
    }
  }

  console.log(`\nDone! ${updated} updated, ${missed} missed.`);
}

mapImages();
