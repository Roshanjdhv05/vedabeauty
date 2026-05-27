/**
 * insert_sugar_pop_variants_js.js
 *
 * Inserts Sugar Pop product variants directly via Supabase JS client.
 * Uses the anon key — run after seed_sugar_pop.js.
 *
 * Run with:  node scripts/insert_sugar_pop_variants_js.js
 */
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser
const envPath = path.resolve(process.cwd(), '.env');
const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
const env = envLines.reduce((acc, line) => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const DISCOUNT_RATE = 0.80;

// Products that have variants
const VARIANT_PRODUCTS = [
  {
    name: 'SPF 25 Brightening Lotion',
    variants: [
      { name: '75 ml', type: 'volume', mrp_price: 99, stock: 100 },
      { name: '200 ml', type: 'volume', mrp_price: 259, stock: 100 },
    ],
  },
  {
    name: 'Intense Nourishing Lotion',
    variants: [
      { name: '75 ml', type: 'volume', mrp_price: 99, stock: 100 },
      { name: '200 ml', type: 'volume', mrp_price: 239, stock: 100 },
    ],
  },
  {
    name: 'SPF 50 Sunscreen',
    variants: [
      { name: '30g', type: 'size', mrp_price: 199, stock: 100 },
      { name: '50g', type: 'size', mrp_price: 249, stock: 100 },
    ],
  },
  {
    name: 'Vitamin C & Tea Tree Face Wash',
    variants: [
      { name: '40 ml', type: 'volume', mrp_price: 99, stock: 100 },
      { name: '80 ml', type: 'volume', mrp_price: 159, stock: 100 },
    ],
  },
];

async function insertVariants() {
  // Get Sugar Pop brand ID
  const { data: brand, error: brandErr } = await supabase
    .from('brands')
    .select('id')
    .eq('name', 'Sugar Pop')
    .maybeSingle();

  if (brandErr || !brand) {
    console.error('Sugar Pop brand not found. Run seed_sugar_pop.js first.');
    return;
  }

  let inserted = 0;
  let skipped = 0;
  let errors = 0;

  for (const item of VARIANT_PRODUCTS) {
    // Find the product
    const { data: product, error: prodErr } = await supabase
      .from('products')
      .select('id, name')
      .eq('brand_id', brand.id)
      .eq('name', item.name)
      .maybeSingle();

    if (prodErr || !product) {
      console.warn(`⚠️  Product not found: "${item.name}"`);
      skipped++;
      continue;
    }

    // Check existing variants
    const { data: existing } = await supabase
      .from('product_variants')
      .select('id')
      .eq('product_id', product.id);

    if (existing && existing.length > 0) {
      console.log(`⏭  Variants already exist for "${product.name}" (${existing.length} variants). Skipping.`);
      skipped++;
      continue;
    }

    // Insert variants
    const variantsToInsert = item.variants.map(v => ({
      product_id: product.id,
      name: v.name,
      type: v.type,
      mrp_price: v.mrp_price,
      selling_price: Math.round(v.mrp_price * DISCOUNT_RATE),
      price: Math.round(v.mrp_price * DISCOUNT_RATE),
      stock: v.stock,
    }));

    const { error: insertErr } = await supabase
      .from('product_variants')
      .insert(variantsToInsert);

    if (insertErr) {
      console.error(`❌ Error inserting variants for "${product.name}":`, insertErr.message);
      console.log('   → Please run insert_sugar_pop_variants.sql in Supabase SQL editor instead.');
      errors++;
    } else {
      console.log(`✅ Inserted ${variantsToInsert.length} variants for "${product.name}"`);
      inserted += variantsToInsert.length;
    }
  }

  console.log(`\nDone! ${inserted} variants inserted, ${skipped} products skipped, ${errors} errors.`);
  if (errors > 0) {
    console.log('\nTo fix errors, run scripts/insert_sugar_pop_variants.sql in the Supabase SQL editor.');
  }
}

insertVariants();
