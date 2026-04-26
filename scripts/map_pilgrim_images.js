import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const PILGRIM_IMAGES_DIR = path.resolve(process.cwd(), 'public', 'pilgrims');

async function mapPilgrimImages() {
  console.log("Starting Pilgrim image mapping...");

  try {
    const files = fs.readdirSync(PILGRIM_IMAGES_DIR);
    console.log(`Found ${files.length} images in public/pilgrims`);

    const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Pilgrim').single();
    if (!brand) return;

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name')
      .eq('brand_id', brand.id);

    if (error) throw error;

    function normalize(str) {
      if (!str) return '';
      return str.toLowerCase()
        .replace(/%/g, '')
        .replace(/&/g, '')
        .replace(/\+/g, '')
        .replace(/,/g, '')
        .replace(/\./g, '')
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
    }

    let updatedCount = 0;
    for (const product of products) {
      const pNorm = normalize(product.name);
      
      let match = files.find(file => {
        const fName = path.parse(file).name.toLowerCase();
        return fName === pNorm || fName.includes(pNorm) || pNorm.includes(fName);
      });

      if (match) {
        const imageUrl = `/pilgrims/${match}`;
        await supabase.from('products').update({ image_url: imageUrl }).eq('id', product.id);
        console.log(`✅ Mapped: ${product.name} -> ${match}`);
        updatedCount++;
      } else {
        console.warn(`⚠️ No match for: ${product.name} (Normalized: ${pNorm})`);
      }
    }

    console.log(`\nPilgrim mapping complete! Updated ${updatedCount} products.`);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

mapPilgrimImages();
