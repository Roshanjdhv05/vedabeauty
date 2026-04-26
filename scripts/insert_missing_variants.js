import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const RAW_PRODUCT_LIST = [
  {
    "name": "Advanced Hair Growth Serum",
    "variants": [
      { "name": "25 ml", "type": "volume", "mrp_price": 595, "stock": 100 },
      { "name": "50 ml", "type": "volume", "mrp_price": 995, "stock": 100 }
    ]
  },
  {
    "name": "Korean Black Rice & Rosemary Water Spray",
    "variants": [
      { "name": "100 ml", "type": "volume", "mrp_price": 225, "stock": 100 },
      { "name": "200 ml", "type": "volume", "mrp_price": 345, "stock": 100 }
    ]
  },
  {
    "name": "Non-Drying Anti-Dandruff Shampoo",
    "variants": [
      { "name": "200 ml", "type": "volume", "mrp_price": 345, "stock": 100 },
      { "name": "650 ml", "type": "volume", "mrp_price": 895, "stock": 100 }
    ]
  },
  {
    "name": "Advanced Damage Repair Shampoo",
    "variants": [
      { "name": "200 ml", "type": "volume", "mrp_price": 305, "stock": 100 },
      { "name": "400 ml", "type": "volume", "mrp_price": 485, "stock": 100 }
    ]
  },
  {
    "name": "Smoothening Shampoo",
    "variants": [
      { "name": "200 ml", "type": "volume", "mrp_price": 345, "stock": 100 },
      { "name": "400 ml", "type": "volume", "mrp_price": 545, "stock": 100 }
    ]
  },
  {
    "name": "Korean Rice Water Hydra Glow Moisturizer",
    "variants": [
      { "name": "50 g", "type": "size", "mrp_price": 275, "stock": 100 },
      { "name": "100 g", "type": "size", "mrp_price": 395, "stock": 100 }
    ]
  }
];

async function insertVariants() {
  const { data: products } = await supabase.from('products').select('id, name');

  for (const item of RAW_PRODUCT_LIST) {
    const product = products.find(p => p.name === item.name);
    if (!product) continue;

    for (const v of item.variants) {
      const sellingPrice = Math.round(v.mrp_price * 0.75);

      const { data, error } = await supabase
        .from('product_variants')
        .insert({
          product_id: product.id,
          name: v.name,
          type: v.type,
          mrp_price: v.mrp_price,
          selling_price: sellingPrice,
          price: sellingPrice, // Fallback
          stock: v.stock
        })
        .select();

      if (error) {
        console.error(`Error inserting ${v.name} for ${item.name}:`, error);
      } else {
        console.log(`Inserted variant ${v.name} for ${item.name}`);
      }
    }
  }
}

insertVariants();
