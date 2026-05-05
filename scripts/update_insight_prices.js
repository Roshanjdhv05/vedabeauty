import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
  { match: 'L-21', price: 110 },
  { match: 'L-23', price: 180 },
  { match: 'L-24', price: 90 },
  { match: 'L-29', price: 599 },
  { match: 'L-30', price: 215 },
  { match: 'L-31', price: 240 },
  { match: 'L-36', price: 160 },
  { match: 'L-37', price: 345 },
  { match: 'LG-40', price: 130 }, // More specific than L-40
  { match: 'L-40', price: 349 }, // Will check LG-40 first if ordered correctly
  { match: 'LG-41', price: 110 },
  { match: 'LG-43', price: 170 },
  { match: 'LG-45', price: 240 },
  { match: 'LG-49', price: 305 },
  { match: 'LG-50', price: 250 },
  { match: 'LG-54', price: 240 },
  { match: 'LG-55', price: 280 },
  { match: 'LG-56', price: 215 },
  { match: 'LG-57', price: 200 },
  { match: 'LG-59', price: 185 },
  { match: 'LG-60', price: 200 },
  { match: 'LG-64', price: 600 },
  { match: 'LG-65', price: 250 },
  { match: 'LL-03', price: 310 },
  { match: 'LL-04', price: 350 },
  { match: 'LL-05', price: 280 },
  { match: 'LL-06', price: 380 },
  { match: 'LL-10', price: 240 },
  { match: 'LL-11', price: 345 },
  { match: 'LL-12', price: 240 },
  { match: 'LL-14', price: 260 },
  { match: 'LP-06', price: 115 },
  { match: 'LP-07', price: 175 },
  { match: 'LP-09', price: 110 },
  { match: 'LES-03', price: 155 },
  { match: 'K-01 Black', price: 175 },
  { match: 'K-01 Colours', price: 165 },
  { match: 'K-02 Black', price: 130 },
  { match: 'K-02 White', price: 130 },
  { match: 'K-02 Colours', price: 120 },
  { match: 'K-09', price: 220 },
  { match: 'MAS-07', price: 280 },
  { match: 'MAS-202', price: 150 },
  { match: 'MAS-21', price: 180 },
  { match: 'MAS-23', price: 170 },
  { match: 'IN PRIMER', price: 340 },
  { match: 'INSTA READY', price: 275 },
  { match: 'MAKEUP BRUSH CLEANER', price: 160 },
];

async function updatePrices() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Insight').single();

  if (!brand) {
    console.error('Insight brand not found.');
    return;
  }

  const { data: products } = await supabase.from('products').select('*').eq('brand_id', brand.id);

  console.log(`Found ${products.length} Insight products.`);

  let updatedCount = 0;

  for (const product of products) {
    // Find matching update
    let matchedUpdate = null;
    for (const update of updates) {
      // Need to avoid matching 'L-40' when it's 'LG-40'
      // Best way: string search with word boundaries or just exact include
      if (product.name.includes(update.match)) {
        // Special case for L-40 vs LG-40
        if (update.match === 'L-40' && product.name.includes('LG-40')) {
          continue; // skip, it's not a match for L-40
        }
        matchedUpdate = update;
        break; // Match found, stop checking
      }
    }

    if (matchedUpdate) {
      const mrp = matchedUpdate.price;
      const discount = 25; // standard discount for insight
      const sellingPrice = Math.round(mrp * (1 - discount / 100));

      const { error } = await supabase.from('products').update({
        mrp_price: mrp,
        original_price: mrp,
        selling_price: sellingPrice,
        price: sellingPrice
      }).eq('id', product.id);

      if (error) {
        console.error(`Failed to update ${product.name}:`, error);
      } else {
        console.log(`Updated: ${product.name} -> MRP: ₹${mrp}, Price: ₹${sellingPrice}`);
        updatedCount++;
      }
    }
  }

  console.log(`\nPrice update complete. Updated ${updatedCount} products.`);
}

updatePrices();
