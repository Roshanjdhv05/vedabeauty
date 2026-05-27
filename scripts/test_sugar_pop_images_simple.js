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

// Copy from imageResolver.js and brandImageMap.js
import { BRAND_IMAGE_MAP } from '../src/lib/brandImageMap.js';

const toUpper = (s) => (s || '').trim().toUpperCase();
const toSlug = (s) =>
  (s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const isBrand = (brandRaw, keyword) =>
  (brandRaw || '').toLowerCase().includes(keyword.toLowerCase());

export const encodePath = (p) => {
  if (!p || p.startsWith('http') || p.startsWith('data:')) return p;
  return p.split('/').map(encodeURIComponent).join('/').replace(/%3A/g, ':');
};

const getTokens = (str) => {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
};

const normalizeStr = (str) => {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim();
};

export function findBestImageCandidates(brandKey, productName) {
  const files = BRAND_IMAGE_MAP[brandKey];
  if (!files || files.length === 0) return [];

  const dbTokens = getTokens(productName);
  const dbNorm = normalizeStr(productName);
  if (dbTokens.length === 0) return [];

  const scored = files.map(file => {
    const filenameNoExt = file.replace(/\.[^/.]+$/, "");
    const fileNorm = normalizeStr(filenameNoExt);
    const fileTokens = getTokens(filenameNoExt);

    let score = 0;

    if (dbNorm === fileNorm) {
      score += 100;
    } else if (fileNorm.includes(dbNorm) || dbNorm.includes(fileNorm)) {
      score += 50;
    }

    let tokenMatches = 0;
    dbTokens.forEach(t => {
      const match = fileTokens.some(ft => {
        if (ft === t) return true;
        if (ft.length > 3 && t.length > 3) {
          return ft.startsWith(t) || t.startsWith(ft);
        }
        return false;
      });
      if (match) tokenMatches++;
    });

    score += tokenMatches * 10;

    return { file, score, fileTokenCount: fileTokens.length };
  });

  const sorted = scored
    .filter(m => m.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.fileTokenCount - b.fileTokenCount;
    });

  if (sorted.length === 0) return [];

  const bestScore = sorted[0].score;
  const brandFolder = brandKey === 'sugarPop' ? 'sugar pop' : brandKey;
  
  return sorted
    .filter(m => m.score >= bestScore - 10)
    .map(m => encodePath(`/${brandFolder}/${m.file}`));
}

export function getProductImageCandidates(product) {
  const name = (product?.name || '').trim();
  const matched = findBestImageCandidates('sugarPop', name);
  if (matched.length > 0) return matched;
  
  const upper = toUpper(name);
  return [
    encodePath(`/sugar pop/${upper}.png`),
    encodePath(`/sugar pop/${upper}.jpg`),
    encodePath(`/sugar pop/${upper}.jfif`),
    encodePath(`/sugar pop/${upper}.avif`),
  ];
}

export function getShadeCandidates(product, variant) {
  const productName = (product?.name || '').trim();
  const shadeName = (variant?.name || variant?.variant_name || product?.variant_name || product?.variant || '').trim();

  const productFolder = toUpper(productName);
  const shadeFile = toUpper(shadeName);

  return [
    encodePath(`/sugar pop/shades/${productFolder}/${shadeFile}.jpg`),
    encodePath(`/sugar pop/shades/${productFolder}/${shadeFile}.png`),
    encodePath(`/sugar pop/shades/${productFolder}/${shadeFile}.jfif`),
    encodePath(`/sugar pop/shades/${productFolder}/${shadeFile}.avif`),
  ];
}

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
    const candidates = getProductImageCandidates(p);
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

    const { data: variants } = await supabase.from('product_variants').select('*').eq('product_id', p.id);
    if (variants && variants.length > 0) {
      console.log(`  Variants (${variants.length}):`);
      for (const v of variants) {
        if (v.type === 'shade') {
          const shadeCands = getShadeCandidates(p, v);
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
