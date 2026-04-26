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

const MARS_IMAGES_DIR = path.resolve(process.cwd(), 'public', 'mars');

async function mapMarsImages() {
  console.log("Starting Mars image mapping...");

  try {
    const files = fs.readdirSync(MARS_IMAGES_DIR);
    console.log(`Found ${files.length} images in public/mars`);

    const { data: brand } = await supabase.from('brands').select('id').eq('name', 'MARS').single();
    if (!brand) return;

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name')
      .eq('brand_id', brand.id);

    if (error) throw error;
    console.log(`Mapping ${products.length} Mars products...`);

    function getWords(str) {
      if (!str) return [];
      return str.toLowerCase()
        .replace(/[^a-z0-9]/g, ' ')
        .split(' ')
        .filter(w => w.length >= 3);
    }

    function calculateMatchScore(productWords, fileWords) {
      if (productWords.length === 0) return 0;
      let matches = 0;
      for (const pWord of productWords) {
        if (fileWords.includes(pWord)) {
          matches++;
        }
      }
      return matches / productWords.length;
    }

    let updatedCount = 0;
    for (const product of products) {
      const pWords = getWords(product.name);
      let bestMatch = null;
      let bestScore = 0;

      for (const file of files) {
        const fName = path.parse(file).name;
        const fWords = getWords(fName);
        const score = calculateMatchScore(pWords, fWords);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = file;
        }
      }

      if (bestMatch && bestScore >= 0.5) {
        const imageUrl = `/mars/${encodeURIComponent(bestMatch)}`;
        await supabase.from('products').update({ image_url: imageUrl }).eq('id', product.id);
        console.log(`✅ [Score: ${Math.round(bestScore*100)}%] Mapped: ${product.name} -> ${bestMatch}`);
        updatedCount++;
      }
    }

    console.log(`\nMars mapping complete! Updated ${updatedCount} products.`);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

mapMarsImages();
