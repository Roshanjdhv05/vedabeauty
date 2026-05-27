/**
 * update_sugar_pop_image_map.js
 * 
 * Scans public/sugar pop/ for product images and updates
 * BRAND_IMAGE_MAP.sugarPop in src/lib/brandImageMap.js automatically.
 * 
 * Run after placing images in public/sugar pop/:
 *   node scripts/update_sugar_pop_image_map.js
 */
import fs from 'fs';
import path from 'path';

const SUGAR_POP_DIR = path.join(process.cwd(), 'public', 'sugar pop');
const BRAND_IMAGE_MAP_FILE = path.join(process.cwd(), 'src', 'lib', 'brandImageMap.js');

function getImageFiles(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return [];
  }
  return fs.readdirSync(dir).filter(f => {
    // Only direct images, not subdirectories
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) return false;
    return /\.(png|jpg|jpeg|jfif|webp|avif)$/i.test(f);
  });
}

function updateBrandImageMap(files) {
  let content = fs.readFileSync(BRAND_IMAGE_MAP_FILE, 'utf8');

  // Build new sugarPop array content
  const fileLines = files.map(f => `  "${f}"`).join(',\n');
  const newArray = files.length > 0
    ? `sugarPop: [\n${fileLines}\n]`
    : `sugarPop: []`;

  // Replace the sugarPop: [...] block
  const updated = content.replace(/sugarPop:\s*\[[\s\S]*?\]/, newArray);

  if (updated === content) {
    console.warn('⚠️  Could not find sugarPop key in brandImageMap.js to replace. No changes made.');
    return;
  }

  fs.writeFileSync(BRAND_IMAGE_MAP_FILE, updated, 'utf8');
  console.log(`✅ brandImageMap.js updated with ${files.length} Sugar Pop images.`);
}

const imageFiles = getImageFiles(SUGAR_POP_DIR);
console.log(`Found ${imageFiles.length} images in public/sugar pop/:`);
imageFiles.forEach(f => console.log(` - ${f}`));

updateBrandImageMap(imageFiles);
