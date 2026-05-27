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

async function insertShades() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Sugar Pop').single();
  if (!brand) { console.error('Sugar Pop brand not found'); return; }

  const { data: products } = await supabase.from('products').select('*').eq('brand_id', brand.id);

  if (!fs.existsSync(SHADES_DIR)) {
    console.error('Shades directory not found:', SHADES_DIR);
    return;
  }

  const productFolders = fs.readdirSync(SHADES_DIR).filter(f => fs.statSync(path.join(SHADES_DIR, f)).isDirectory());

  let inserted = 0;

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
      continue;
    }

    console.log(`Processing product: ${product.name} (Folder: ${bestFolder})`);

    const folderPath = path.join(SHADES_DIR, bestFolder);
    const shadeImages = fs.readdirSync(folderPath).filter(f => /\.(png|jpg|jpeg|jfif|webp|avif)$/i.test(f));

    // For each image, create a variant if it doesn't exist
    for (const img of shadeImages) {
      const shadeName = path.parse(img).name;
      const imageUrl = `/sugar pop/shades/${bestFolder}/${img}`;
      
      const { data: existingVariant } = await supabase
        .from('product_variants')
        .select('id')
        .eq('product_id', product.id)
        .eq('name', shadeName)
        .maybeSingle();

      if (!existingVariant) {
        const { error } = await supabase.from('product_variants').insert({
          product_id: product.id,
          name: shadeName,
          type: 'shade',
          image_url: imageUrl,
          price: product.price || product.selling_price || 0,
          mrp_price: product.mrp_price || 0,
          selling_price: product.selling_price || product.price || 0,
          stock: 100
        });

        if (error) {
          console.error(`  ❌ Error inserting shade ${shadeName}:`, error.message);
        } else {
          console.log(`  ✅ Inserted shade: ${shadeName}`);
          inserted++;
        }
      } else {
        // Update image url if variant exists
        const { error } = await supabase.from('product_variants').update({ image_url: imageUrl }).eq('id', existingVariant.id);
        if (error) {
           console.error(`  ❌ Error updating shade ${shadeName}:`, error.message);
        } else {
           console.log(`  ✅ Updated shade: ${shadeName}`);
           inserted++;
        }
      }
    }
    
    // Update product to has_variants = true
    await supabase.from('products').update({ has_variants: true }).eq('id', product.id);
  }

  console.log(`\nDone! ${inserted} shades processed.`);
}

insertShades();
