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

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const SHADES_DIR = path.join(process.cwd(), 'public', 'sugar pop', 'shades');

function normalizeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function mapShades() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Sugar Pop').single();
  if (!brand) { console.error('Sugar Pop brand not found'); return; }

  const { data: products } = await supabase.from('products').select('id, name').eq('brand_id', brand.id);

  if (!fs.existsSync(SHADES_DIR)) {
    console.error('Shades directory not found:', SHADES_DIR);
    return;
  }

  const productFolders = fs.readdirSync(SHADES_DIR).filter(f => fs.statSync(path.join(SHADES_DIR, f)).isDirectory());

  let updated = 0;
  let missed = 0;

  for (const product of products) {
    const prodNorm = normalizeName(product.name);
    
    // Find matching folder
    let bestFolder = null;
    for (const folder of productFolders) {
      const folderNorm = normalizeName(folder);
      if (prodNorm.includes(folderNorm) || folderNorm.includes(prodNorm)) {
        bestFolder = folder;
        break;
      }
    }

    if (!bestFolder) {
       for (const folder of productFolders) {
         const folderNorm = normalizeName(folder);
         const prodNormNoBrackets = normalizeName(product.name.replace(/\(.*?\)/g, ''));
         if (prodNormNoBrackets.includes(folderNorm) || folderNorm.includes(prodNormNoBrackets)) {
           bestFolder = folder;
           break;
         }
       }
    }

    if (!bestFolder) {
      // It's normal if a product doesn't have a shade folder (e.g. no variants)
      continue;
    }

    console.log(`Processing product: ${product.name} (Folder: ${bestFolder})`);

    const folderPath = path.join(SHADES_DIR, bestFolder);
    const shadeImages = fs.readdirSync(folderPath).filter(f => /\.(png|jpg|jpeg|jfif|webp|avif)$/i.test(f));

    const { data: variants } = await supabase.from('product_variants').select('*').eq('product_id', product.id);
    
    if (!variants || variants.length === 0) {
      console.warn(`No variants found in DB for product: ${product.name}`);
      continue;
    }

    for (const variant of variants) {
      const variantNorm = normalizeName(variant.value); // variant value holds the shade name
      
      let bestImage = null;
      for (const img of shadeImages) {
        const imgNorm = normalizeName(path.parse(img).name);
        if (imgNorm.includes(variantNorm) || variantNorm.includes(imgNorm)) {
          bestImage = img;
          break;
        }
      }

      if (bestImage) {
        const imageUrl = `/sugar pop/shades/${bestFolder}/${bestImage}`;
        const { error } = await supabase.from('product_variants').update({ image_url: imageUrl }).eq('id', variant.id);
        if (error) {
          console.error(`Error updating variant ${variant.value}:`, error.message);
        } else {
          console.log(`  ✅ ${variant.value} → ${imageUrl}`);
          updated++;
        }
      } else {
        console.warn(`  ❌ No image matched for variant: "${variant.value}"`);
        missed++;
      }
    }
  }

  console.log(`\nDone! ${updated} variants updated, ${missed} variants missed.`);
}

mapShades();
