import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// 1. Setup Supabase
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

// 2. Paths and logic
const SHADES_DIR = path.join(process.cwd(), 'public', 'mars', 'shades');

function normalizeName(name) {
  return (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

async function run() {
  console.log('Connecting to Supabase...');
  
  // Find MARS brands (might be "Mars" or "MARS")
  const { data: brands, error: brandErr } = await supabase
    .from('brands')
    .select('id, name')
    .ilike('name', '%mars%');
    
  if (brandErr || !brands || brands.length === 0) {
    console.error('MARS brand not found');
    return;
  }
  
  const brandIds = brands.map(b => b.id);
  console.log(`Found ${brands.length} MARS brands. Fetching products...`);

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .in('brand_id', brandIds);

  if (!fs.existsSync(SHADES_DIR)) {
    console.error('Shades directory not found:', SHADES_DIR);
    return;
  }

  const productFolders = fs.readdirSync(SHADES_DIR).filter(f => fs.statSync(path.join(SHADES_DIR, f)).isDirectory());
  
  let inserted = 0;
  let updated = 0;

  for (const product of products) {
    const prodNorm = normalizeName(product.name);
    
    // Find matching folder
    let bestFolder = null;
    
    // 1. Try exact normalized match
    bestFolder = productFolders.find(f => normalizeName(f) === prodNorm);
    
    // 2. Try partial match
    if (!bestFolder) {
      for (const folder of productFolders) {
        const folderNorm = normalizeName(folder);
        if (prodNorm.includes(folderNorm) || folderNorm.includes(prodNorm)) {
          bestFolder = folder;
          break;
        }
      }
    }
    
    // Special hardcodes if needed based on known discrepancies
    if (!bestFolder) {
      if (prodNorm === 'coverrangers') bestFolder = 'MARS Cover Rangers';
      if (prodNorm === 'wondercover') bestFolder = 'MARS Wonder Cover';
      if (prodNorm === 'contourpalette') bestFolder = 'MARS Contour Palette';
      if (prodNorm.includes('cityparadise')) {
         if (prodNorm.includes('delhi')) bestFolder = 'The  City Paradise';
         if (prodNorm.includes('mumbai')) bestFolder = 'The City Paradise 2';
         if (prodNorm.includes('kolkata')) bestFolder = 'The City Paradise 3';
         if (prodNorm.includes('chandigarh')) bestFolder = 'The City Paradise 4';
         if (prodNorm.includes('bangalore')) bestFolder = 'The City Paradise 5';
         if (prodNorm.includes('lucknow')) bestFolder = 'The City Paradise 6';
         if (prodNorm.includes('ahmedabad')) bestFolder = 'The City Paradise 7';
         if (prodNorm.includes('jaipur')) bestFolder = 'The City Paradise 8';
      }
    }

    if (!bestFolder) {
      console.log(`⚠️  No folder found for product: ${product.name}`);
      continue;
    }

    console.log(`Processing product: ${product.name} (Matched Folder: ${bestFolder})`);
    
    const folderPath = path.join(SHADES_DIR, bestFolder);
    const shadeImages = fs.readdirSync(folderPath).filter(f => /\.(png|jpg|jpeg|jfif|webp|avif)$/i.test(f));

    for (const img of shadeImages) {
      const shadeName = path.parse(img).name; // the file name without extension
      const imageUrl = `/mars/shades/${bestFolder}/${img}`;
      
      // Look for existing variant by name case-insensitive
      const { data: existingVariants } = await supabase
        .from('product_variants')
        .select('id, name')
        .eq('product_id', product.id);
        
      const existingVariant = (existingVariants || []).find(v => v.name.toLowerCase() === shadeName.toLowerCase());

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
          console.log(`  ✅ Inserted new shade: ${shadeName}`);
          inserted++;
        }
      } else {
        const { error } = await supabase.from('product_variants')
          .update({ image_url: imageUrl })
          .eq('id', existingVariant.id);
          
        if (error) {
           console.error(`  ❌ Error updating shade ${shadeName}:`, error.message);
        } else {
           console.log(`  ✅ Updated image for existing shade: ${shadeName}`);
           updated++;
        }
      }
    }
    
    // Update product to has_variants = true
    await supabase.from('products').update({ has_variants: true }).eq('id', product.id);
  }

  console.log(`\nDone! Inserted ${inserted}, Updated ${updated} Mars shades.`);
}

run();
