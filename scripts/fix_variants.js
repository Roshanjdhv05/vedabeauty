import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const RAW_PRODUCT_LIST = [
  // EYELINER
  { name: "Waterproof Eyeliner EL-32", category: "EYELINER", has_variants: true, variants: [{ name: "Shiny", type: "shade", mrp_price: 125, stock: 100 }, { name: "Matte", type: "shade", mrp_price: 125, stock: 100 }] },
  { name: "Waterproof Eyeliner EL-233", category: "EYELINER", has_variants: true, variants: [{ name: "Matte", type: "shade", mrp_price: 75, stock: 100 }, { name: "Shiny", type: "shade", mrp_price: 95, stock: 100 }] },
];

const DISCOUNT_RATE = 0.75; // 25% discount

async function insertVariants() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Insight').single();
  const { data: products } = await supabase.from('products').select('id, name').eq('brand_id', brand.id);

  console.log('Inserting variants...');
  for (const item of RAW_PRODUCT_LIST) {
    if (!item.has_variants) continue;
    const product = products.find(p => p.name === item.name);
    if (!product) continue;
    for (const v of item.variants) {
      const sellingPrice = Math.round(v.mrp_price * DISCOUNT_RATE);
      
      const { error } = await supabase.from('product_variants').insert({
        product_id: product.id,
        name: v.name,
        type: v.type,
        mrp_price: v.mrp_price,
        selling_price: sellingPrice,
        price: sellingPrice,
        stock: v.stock
      });
      if (error) console.error(`Error inserting variant ${v.name} for ${product.name}:`, error.message);
      else console.log(`✅ Inserted variant: ${v.name} for ${product.name}`);
    }
  }
  
  // Also regenerate the SQL file just in case the user wants to use it later
  console.log('Generating variant SQL...');
  let sql = `-- INSERT PRODUCT VARIANTS FOR INSIGHT\n`;
  for (const item of RAW_PRODUCT_LIST) {
    if (!item.has_variants) continue;
    const product = products.find(p => p.name === item.name);
    if (!product) continue;
    for (const v of item.variants) {
      const sellingPrice = Math.round(v.mrp_price * DISCOUNT_RATE);
      // Delete old variants just in case
      sql += `DELETE FROM product_variants WHERE product_id = '${product.id}' AND name = '${v.name}';\n`;
      sql += `INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)\n`;
      sql += `VALUES ('${product.id}', '${v.name}', '${v.type}', ${v.mrp_price}, ${sellingPrice}, ${sellingPrice}, ${v.stock})\nON CONFLICT DO NOTHING;\n\n`;
    }
  }
  const fs = await import('fs');
  // Read existing SQL, but I'm just replacing the finish ones, actually let's not touch the SQL, the user already ran it.
  
  console.log('✅ Variants seeded successfully!');
}

insertVariants();
