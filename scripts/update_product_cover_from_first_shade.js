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

async function updateProductCoversFromFirstShade() {
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

  // Fetch all products
  const { data: products, error: pError } = await supabase
    .from('products')
    .select('id, name, image_url')
    .eq('brand_id', brand.id);

  if (pError) { console.error('❌ Error fetching products:', pError.message); process.exit(1); }

  // Fetch all variants that have an image_url set (shade images)
  const { data: variants, error: vError } = await supabase
    .from('product_variants')
    .select('id, name, product_id, image_url')
    .in('product_id', products.map(p => p.id))
    .not('image_url', 'is', null);

  if (vError) {
    console.error('❌ Error fetching variants:', vError.message);
    process.exit(1);
  }

  console.log(`\n📦 Found ${products.length} products and ${variants.length} variants with images.`);

  // Group variants by product_id
  const variantsByProduct = variants.reduce((acc, v) => {
    if (!acc[v.product_id]) acc[v.product_id] = [];
    acc[v.product_id].push(v);
    return acc;
  }, {});

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const productVariants = variantsByProduct[product.id];

    if (!productVariants || productVariants.length === 0) {
      console.log(`  ⏭️  Skipping "${product.name}" — no shade images found`);
      skipped++;
      continue;
    }

    // Sort variants by name (numeric prefix first, then alphabetical)
    const sorted = [...productVariants].sort((a, b) => {
      const aNum = parseInt(a.name);
      const bNum = parseInt(b.name);
      if (!isNaN(aNum) && !isNaN(bNum)) return aNum - bNum;
      return a.name.localeCompare(b.name);
    });

    const firstShade = sorted[0];
    const coverImageUrl = firstShade.image_url;

    if (product.image_url === coverImageUrl) {
      console.log(`  ✅ "${product.name}" — already set to first shade (${firstShade.name})`);
      skipped++;
      continue;
    }

    const { error } = await supabase
      .from('products')
      .update({ image_url: coverImageUrl })
      .eq('id', product.id);

    if (error) {
      console.error(`  ❌ Failed to update "${product.name}":`, error.message);
    } else {
      console.log(`  🖼️  "${product.name}" → cover set to shade "${firstShade.name}" (${coverImageUrl})`);
      updated++;
    }
  }

  console.log(`\n📊 Products updated: ${updated}, skipped: ${skipped}`);
  console.log('\n🎉 Product cover image update complete!');
  process.exit(0);
}

updateProductCoversFromFirstShade().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
