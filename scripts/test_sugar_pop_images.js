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

// We need to import getProductImageCandidates, getShadeCandidates from imageResolver
// Since imageResolver uses ES modules, let's implement a test function or import it
import { getProductImageCandidates, getShadeCandidates, getShadeImage } from '../src/lib/imageResolver.js';

async function testImages() {
  const { data: brand } = await supabase.from('brands').select('id, name').eq('name', 'Sugar Pop').single();
  if (!brand) {
    console.error('Brand Sugar Pop not found!');
    return;
  }

  const { data: products } = await supabase.from('products').select('*').eq('brand_id', brand.id);
  console.log(`Checking ${products.length} products...\n`);

  let failCount = 0;

  for (const p of products) {
    // Add brands name so that isBrand check works
    const productWithBrand = {
      ...p,
      brands: { name: 'Sugar Pop' }
    };
    const candidates = getProductImageCandidates(productWithBrand);
    
    // Check if the first candidate exists in the public directory
    const firstCandidate = candidates[0];
    const decodedPath = decodeURIComponent(firstCandidate);
    const absolutePath = path.join(process.cwd(), 'public', decodedPath);
    const exists = fs.existsSync(absolutePath);

    console.log(`Product: "${p.name}"`);
    console.log(`  Resolved URL: "${firstCandidate}"`);
    console.log(`  File exists in public: ${exists ? '✅ YES' : '❌ NO'}`);
    if (!exists) {
      failCount++;
      console.log(`  Tried candidates:`, candidates);
    }

    // Check shades/variants as well
    const { data: variants } = await supabase.from('product_variants').select('*').eq('product_id', p.id);
    if (variants && variants.length > 0) {
      console.log(`  Variants (${variants.length}):`);
      for (const v of variants) {
        if (v.type === 'shade') {
          const shadeCands = getShadeCandidates(productWithBrand, v);
          const firstShade = shadeCands[0];
          const decodedShade = decodeURIComponent(firstShade);
          const absoluteShade = path.join(process.cwd(), 'public', decodedShade);
          const shadeExists = fs.existsSync(absoluteShade);
          console.log(`    - Shade: "${v.name}" -> "${firstShade}" (exists: ${shadeExists ? '✅' : '❌'})`);
          if (!shadeExists) {
            console.log(`      Tried shade candidates:`, shadeCands);
          }
        }
      }
    }
    console.log();
  }

  console.log(`\nVerification finished: ${failCount} product images failed.`);
}

testImages();
