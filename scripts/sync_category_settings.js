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

async function syncCategorySettings() {
  console.log("Syncing category settings with actual product categories...");

  try {
    const { data: brands } = await supabase.from('brands').select('id, name');

    for (const brand of brands) {
      console.log(`Processing brand: ${brand.name}`);

      // Get distinct categories from products
      const { data: products } = await supabase
        .from('products')
        .select('category')
        .eq('brand_id', brand.id);
      
      const actualCategories = [...new Set(products.map(p => p.category))].filter(Boolean);

      for (const cat of actualCategories) {
        // Check if setting exists
        const { data: existing } = await supabase
          .from('category_settings')
          .select('id')
          .eq('brand_id', brand.id)
          .ilike('name', cat)
          .single();

        if (!existing) {
          console.log(`  Adding missing category setting: ${cat} for ${brand.name}`);
          await supabase.from('category_settings').insert({
            brand_id: brand.id,
            name: cat,
            image_url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=800' // Temporary
          });
        }
      }
    }

    console.log("\nSync complete!");
  } catch (err) {
    console.error("❌ Error:", err);
  }
}

syncCategorySettings();
