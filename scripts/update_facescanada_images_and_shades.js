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

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const PUBLIC_DIR = path.resolve(process.cwd(), 'public');
const FC_DIR = path.join(PUBLIC_DIR, 'facescanada');

const fcPath = (absolutePath) => {
  return '/' + path.relative(PUBLIC_DIR, absolutePath).replace(/\\/g, '/');
};

async function updateFacesCanadaImagesAndShades() {
  console.log('🔍 Fetching Faces Canada brand...');

  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('id')
    .ilike('name', 'Faces Canada')
    .single();

  if (brandError || !brand) {
    console.error('❌ Faces Canada brand not found:', brandError?.message);
    process.exit(1);
  }

  console.log(`✅ Found brand id: ${brand.id}`);

  console.log('\n📸 Fetching products...');

  const { data: products, error: pError } = await supabase
    .from('products')
    .select('id, name')
    .eq('brand_id', brand.id);

  if (pError) { console.error('❌ Error fetching products:', pError.message); process.exit(1); }

  console.log('\n🎨 Updating shade variant images and names...');

  const { data: variants, error: vError } = await supabase
    .from('product_variants')
    .select('id, name, product_id')
    .in('product_id', products.map(p => p.id));

  if (vError) {
    console.warn('⚠️  Could not fetch variants:', vError.message);
    process.exit(1);
  }

  // Create a map of product_id to product name for easy lookup
  const productMap = products.reduce((acc, p) => {
    acc[p.id] = p.name;
    return acc;
  }, {});

  let variantUpdated = 0;
  let variantMissed = 0;

  for (const variant of variants) {
    const productName = productMap[variant.product_id];
    const oldShadeName = variant.name;

    if (!productName) continue;

    // We will search for a folder in public/facescanada that matches the product name
    const productFolders = fs.readdirSync(FC_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);
    
    let folderName = productFolders.find(f => f.toLowerCase() === productName.toLowerCase() || productName.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(productName.toLowerCase()));

    // Custom mappings
    if (productName === '3in1 Primer') folderName = '3 in 1 Primer';
    if (productName === 'BB Gel Crème') folderName = 'BB Gel Creme';
    if (productName === '3 in 1 All Day Hydra Matte Foundation 2') folderName = '3 in 1 All Day Hydra Matte Foundation 2';

    if (!folderName) {
      console.warn(`  ⚠️  No folder found for product "${productName}"`);
      variantMissed++;
      continue;
    }

    const folderPath = path.join(FC_DIR, folderName);
    const images = fs.readdirSync(folderPath).filter(f => f.endsWith('.png') || f.endsWith('.jpg'));

    // Find the matching image by substring
    const matchingImage = images.find(img => {
      const base = path.basename(img, path.extname(img));
      return base.toLowerCase().includes(oldShadeName.toLowerCase()) || oldShadeName.toLowerCase().includes(base.toLowerCase());
    });

    if (!matchingImage) {
      console.warn(`  ⚠️  No matching image for shade "${oldShadeName}" in folder "${folderName}"`);
      variantMissed++;
      continue;
    }

    const newShadeName = path.basename(matchingImage, path.extname(matchingImage));
    const imageUrl = fcPath(path.join(folderPath, matchingImage));

    const { error } = await supabase
      .from('product_variants')
      .update({ image_url: imageUrl, name: newShadeName })
      .eq('id', variant.id);

    if (error) {
      console.error(`  ❌ Failed to update variant "${oldShadeName}":`, error.message);
    } else {
      console.log(`  🎨 ${productName}: "${oldShadeName}" → "${newShadeName}" (${imageUrl})`);
      variantUpdated++;
    }
  }

  console.log(`\n📊 Variants: ${variantUpdated} updated, ${variantMissed} missed.`);
  console.log('\n🎉 Faces Canada images and shades update complete!');
  process.exit(0);
}

updateFacesCanadaImagesAndShades().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
