import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateCategoryImages() {
  console.log("Updating category images to match brand-specific products...");

  try {
    // 1. Get all brands
    const { data: brands } = await supabase.from('brands').select('id, name');

    for (const brand of brands) {
      console.log(`Processing brand: ${brand.name}`);

      // 2. Get all categories for this brand from category_settings
      const { data: settings } = await supabase
        .from('category_settings')
        .select('name')
        .eq('brand_id', brand.id);

      if (!settings) continue;

      for (const setting of settings) {
        // 3. Find one product in this brand and category with a valid image
        const { data: product } = await supabase
          .from('products')
          .select('image_url')
          .eq('brand_id', brand.id)
          .ilike('category', setting.name)
          .not('image_url', 'ilike', '%unsplash%') // Prefer local images
          .not('image_url', 'is', null)
          .limit(1)
          .single();

        if (product && product.image_url) {
          console.log(`  Updating ${setting.name} for ${brand.name} -> ${product.image_url}`);
          const { error: updateError } = await supabase
            .from('category_settings')
            .update({ image_url: product.image_url })
            .eq('brand_id', brand.id)
            .eq('name', setting.name);

          if (updateError) console.error(`  Error updating ${setting.name}:`, updateError.message);
        } else {
          // Fallback if no local image found
          const { data: fallbackProduct } = await supabase
            .from('products')
            .select('image_url')
            .eq('brand_id', brand.id)
            .ilike('category', setting.name)
            .not('image_url', 'is', null)
            .limit(1)
            .single();

          if (fallbackProduct && fallbackProduct.image_url) {
            console.log(`  Updating ${setting.name} for ${brand.name} (fallback) -> ${fallbackProduct.image_url}`);
            await supabase
              .from('category_settings')
              .update({ image_url: fallbackProduct.image_url })
              .eq('brand_id', brand.id)
              .eq('name', setting.name);
          } else {
            console.warn(`  ⚠️ No product found for ${brand.name} category ${setting.name}`);
          }
        }
      }
    }

    console.log("\nCategory image update complete!");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

updateCategoryImages();
