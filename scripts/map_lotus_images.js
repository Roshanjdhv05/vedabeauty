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

const LOTUS_IMAGES_DIR = path.resolve(process.cwd(), 'public', 'lotus');

async function mapLotusImages() {
  console.log("Starting Advanced Lotus image mapping...");

  try {
    const files = fs.readdirSync(LOTUS_IMAGES_DIR);
    console.log(`Found ${files.length} images in public/lotus`);

    const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Lotus').single();
    if (!brand) return;

    const { data: products, error } = await supabase
      .from('products')
      .select('id, name')
      .eq('brand_id', brand.id);

    if (error) throw error;

    function getWords(str) {
      if (!str) return [];
      return str.toLowerCase()
        .replace(/[^a-z]/g, ' ') // Only keep letters
        .split(' ')
        .filter(w => w.length >= 3) // Only keep words with 3+ chars
        .map(w => {
          // Normalization within words
          return w
            .replace(/shin/g, 'skin')
            .replace(/punk/g, 'pink')
            .replace(/nigth/g, 'night')
            .replace(/matta/g, 'matte')
            .replace(/facical/g, 'facial')
            .replace(/brighting/g, 'brightening')
            .replace(/sunbloack/g, 'sunblock')
            .replace(/cerem/g, 'creme')
            .replace(/moisturing/g, 'moisturising')
            .replace(/moidturizer/g, 'moisturiser')
            .replace(/conpact/g, 'compact')
            .replace(/papyablem/g, 'papayablem')
            .replace(/ampoula/g, 'ampoule')
            .replace(/rediance/g, 'radiance')
            .replace(/complextion/g, 'complexion')
            .replace(/ibtan/g, 'ubtan')
            .replace(/cleaning/g, 'cleansing')
            .replace(/whitning/g, 'whitening')
            .replace(/z/g, 's');
        });
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

      // Specific Overrides for tricky items
      if (product.name.includes("Lip Balms")) bestMatch = "LIP BALMS RANGE (1).png";
      if (product.name.includes("Lip Therapy")) bestMatch = "LIP THERAPY RANGE.png";
      if (product.name.includes("Deep Hydra Crème")) bestMatch = "DEEP HYDRA CREME.png";
      if (product.name.includes("Deep Hydra Serum")) bestMatch = "DEEP HYDRA SERUM.png";
      if (product.name.includes("3 in 1 Deep Cleansing")) bestMatch = "3 IN 1 DEEP CLEANSING SKIN WHITENING FACICAL FORM.png";
      if (product.name.includes("Forever Young")) bestMatch = "INSTA GLOW FAIRNESS KIT.png"; // Fallback for Regimen Kit

      // Threshold: at least 50% of product words should match, or use specific overrides
      if (bestMatch && (bestScore >= 0.5 || bestMatch.includes("RANGE") || bestMatch.includes("DEEP HYDRA"))) {
        const imageUrl = `/lotus/${encodeURIComponent(bestMatch)}`;
        await supabase.from('products').update({ image_url: imageUrl }).eq('id', product.id);
        console.log(`✅ [Score: ${Math.round(bestScore*100)}%] Mapped: ${product.name} -> ${bestMatch}`);
        updatedCount++;
      } else {
        console.warn(`⚠️ No strong match for: ${product.name} (Best was ${Math.round(bestScore*100)}% with ${bestMatch})`);
      }
    }

    console.log(`\nAdvanced mapping complete! Updated ${updatedCount} products.`);
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

mapLotusImages();
