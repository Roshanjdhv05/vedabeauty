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

async function generateSQL() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Pilgrim').single();
  const { data: products } = await supabase.from('products').select('id, name').eq('brand_id', brand.id);

  let sql = `-- INSERT PRODUCT VARIANTS FOR PILGRIM\n`;

  for (const item of RAW_PRODUCT_LIST) {
    const product = products.find(p => p.name === item.name);
    if (!product) continue;

    for (const v of item.variants) {
      const sellingPrice = Math.round(v.mrp_price * 0.75);
      
      sql += `INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) \n`;
      sql += `VALUES ('${product.id}', '${v.name}', '${v.type}', ${v.mrp_price}, ${sellingPrice}, ${sellingPrice}, ${v.stock})\n`;
      sql += `ON CONFLICT DO NOTHING;\n\n`;
    }
  }

  fs.writeFileSync(path.resolve(process.cwd(), 'scripts', 'insert_pilgrim_variants.sql'), sql);
  console.log('SQL generated!');
}

generateSQL();
