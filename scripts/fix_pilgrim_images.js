import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const exactMap = {
  '99% Aloe Vera Gel': '99% ALOE VERA GEL.png',
  '15% Vitamin C Face Serum': 'FACE SERUM with Ferulic Acid &  Australian Kakadu Plum.png',
  '10% Vitamin C Face Serum': 'FACE SERUM with 1% Zinc PCA.jpg',
  '10% Niacinamide Face Serum': 'FACE SERUM with 5% Niacinamide, Glutathione, Australian Kakadu Plum.jpg',
  '24K Gold Gel Face Wash': 'GEL FACE WASH.png',
  'Australian Tea Tree Oil-Balance Gel Face Wash': 'OIL-BALANCE GEL FACE WASH.png',
  'Advanced Hair Growth Serum': 'ADVANCED HAIR GROWTH SERUM.jpg',
  'Korean Black Rice & Rosemary Water Spray': 'KOREAN BLACK RICE AND ROSEMARY WATER SPRAY.png',
  'Anti-Hairfall Shampoo': 'ANTI-HAIRFALL SHAMPOO.png',
  'Non-Drying Anti-Dandruff Shampoo': 'NON-DRYING ANTI-DANDRUFF SHAMPOO.png',
  'Advanced Damage Repair Shampoo': 'ADVANCED DAMAGE REPAIR SHAMPOO.png',
  'Smoothening Shampoo': 'SMOOTHENING SHAMPOO.png',
  'Smoothening Conditioner': 'SMOOTHENING CONDITIONER.png',
  'Advanced Damage Repair Conditioner': 'ADVANCED DAMAGE REPAIR CONDITIONER.png',
  'Anti-Dandruff Conditioner': 'ANTI-DANDRUFF CONDITIONER.png',
  'Smoothening Hair Mask': 'SMOOTHENING HAIR MASK.png',
  '25% AHA, 2% BHA, 5% PHA Peeling Solution': 'PEELING SOLUTION.jpg',
  'Hydra Glow Gel Sunscreen SPF 50+ PA++++': 'HYDRA GLOW GEL SUNSCREEN.jpg',
  'Brightening Serum Sunscreen SPF 50+ PA++++': 'BRIGHTENING SERUM SUNSCREEN.jpg',
  'Korean Rice Water Hydra Glow Moisturizer': 'HYDRA GLOW MOISTURIZER.png',
  'French Red Vine Youthful Glow Moisturizer': 'YOUTHFUL GLOW MOISTURIZER.png',
  'French Red Vine & Retinol Youthful Glow Night Gel Crème': 'YOUTHFUL GLOW NIGHT GEL CRÈME.png',
  'Korean Rice Water Hydra Glow Gel Face Wash': 'HYDRA GLOW GEL FACE WASH.png',
  'Vitamin C Brightening Gel Face Wash': 'BRIGHTENING GEL FACE WASH.jpg'
};

async function fixImages() {
  const imagesDir = path.resolve(process.cwd(), 'public/pilgrims');
  
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Pilgrim').single();

  const { data: products } = await supabase.from('products').select('id, name').eq('brand_id', brand.id);

  for (const product of products) {
    const originalFile = exactMap[product.name];
    if (!originalFile) {
      console.log(`No manual mapping found for product: ${product.name}`);
      continue;
    }

    const oldPath = path.join(imagesDir, originalFile);
    if (!fs.existsSync(oldPath)) {
      console.log(`File not found: ${oldPath}`);
      continue;
    }

    // Create a URL-safe filename
    const ext = path.extname(originalFile);
    const newFileName = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + ext;

    const newPath = path.join(imagesDir, newFileName);

    // Rename the file
    if (oldPath !== newPath) {
      fs.renameSync(oldPath, newPath);
      console.log(`Renamed: ${originalFile} -> ${newFileName}`);
    }

    // Update DB
    const imageUrl = `/pilgrims/${newFileName}`;
    await supabase.from('products').update({ image_url: imageUrl }).eq('id', product.id);
    console.log(`Updated DB for: ${product.name} with ${imageUrl}`);
  }
}

fixImages();
