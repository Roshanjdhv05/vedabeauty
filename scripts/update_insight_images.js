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

const insightDir = path.resolve(process.cwd(), 'public/insight');
const publicPrefix = '/insight';

// Helper to normalize strings for comparison
const normalize = (str) => str ? str.toLowerCase().trim().replace(/\s+/g, ' ') : '';

async function updateInsightImages() {
  console.log('🔍 Fetching Insight brand...');

  // Fetch Insight brand
  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('id, name')
    .ilike('name', '%insight%')
    .limit(1)
    .single();

  if (brandError || !brand) {
    console.error('❌ Insight brand not found:', brandError?.message);
    process.exit(1);
  }

  console.log(`✅ Found brand id: ${brand.id} (${brand.name})`);

  // Read local directory
  const entries = fs.readdirSync(insightDir, { withFileTypes: true });
  
  const productImages = {}; 
  const shadeImages = {};   // key: norm product name -> { shade name (original) -> image path }

  for (const entry of entries) {
    const entryName = entry.name;
    const normEntryName = normalize(entryName.replace(/\.[^/.]+$/, "")); // remove extension
    
    if (entry.isDirectory()) {
      const shadeDir = path.join(insightDir, entryName);
      const shadeFiles = fs.readdirSync(shadeDir).filter(f => !f.startsWith('.'));
      
      if (shadeFiles.length > 0) {
        // First image is product cover
        productImages[normEntryName] = `${publicPrefix}/${entryName}/${shadeFiles[0]}`;
        
        shadeImages[normEntryName] = {};
        for (const shadeFile of shadeFiles) {
          const shadeName = shadeFile.replace(/\.[^/.]+$/, ""); // original case shade name
          shadeImages[normEntryName][shadeName] = `${publicPrefix}/${entryName}/${shadeFile}`;
        }
      }
    } else {
      productImages[normEntryName] = `${publicPrefix}/${entryName}`;
    }
  }

  console.log('\n📸 Fetching products...');

  const { data: products, error: pError } = await supabase
    .from('products')
    .select('id, name, image_url, mrp_price, selling_price')
    .eq('brand_id', brand.id);

  if (pError) { console.error('❌ Error fetching products:', pError.message); process.exit(1); }

  let productUpdated = 0;
  let variantInserted = 0;
  let variantUpdated = 0;

  for (const product of products) {
    const normProductName = normalize(product.name);
    
    // Find matching product
    const matchProductKey = Object.keys(productImages).find(k => k === normProductName || normProductName.includes(k) || k.includes(normProductName));

    if (!matchProductKey) {
      console.warn(`⚠️  No image mapped for: "${product.name}"`);
      continue;
    }

    const imageUrl = productImages[matchProductKey];

    // Update Product Image
    await supabase.from('products').update({ image_url: imageUrl }).eq('id', product.id);
    productUpdated++;

    // Process Variants
    if (shadeImages[matchProductKey]) {
      const shadeMap = shadeImages[matchProductKey];
      
      // Fetch existing variants
      const { data: existingVariants } = await supabase
        .from('product_variants')
        .select('id, name')
        .eq('product_id', product.id);

      for (const [shadeName, shadeImageUrl] of Object.entries(shadeMap)) {
        const normShadeName = normalize(shadeName);
        
        const existing = existingVariants?.find(v => normalize(v.name) === normShadeName);
        
        if (existing) {
          // Update existing variant image
          await supabase.from('product_variants').update({ image_url: shadeImageUrl }).eq('id', existing.id);
          variantUpdated++;
          console.log(`  🎨 Updated Variant: ${product.name} / ${shadeName}`);
        } else {
          // Insert new variant
          const mrp = product.mrp_price || 200;
          const selling = product.selling_price || 150;
          
          await supabase.from('product_variants').insert({
            product_id: product.id,
            name: shadeName,
            type: 'shade',
            image_url: shadeImageUrl,
            mrp_price: mrp,
            selling_price: selling,
            price: selling,
            stock: 100
          });
          variantInserted++;
          console.log(`  ✨ Inserted Variant: ${product.name} / ${shadeName}`);
        }
      }
    }
  }

  console.log(`\n📊 Complete: ${productUpdated} products mapped, ${variantInserted} variants inserted, ${variantUpdated} variants updated.`);
  process.exit(0);
}

updateInsightImages().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
