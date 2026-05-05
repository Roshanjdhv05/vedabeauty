import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function runSQL() {
  const sql = fs.readFileSync(path.resolve(process.cwd(), 'scripts', 'insert_insight_variants.sql'), 'utf-8');
  // I can't execute raw SQL via anon client, so I will parse the SQL and do inserts using supabase.from().insert()
  // But wait, the RLS policies for products/variants might allow inserts?
  // Let's test inserting one variant to see if it works.
  
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Insight').single();
  const { data: product } = await supabase.from('products').select('id').eq('brand_id', brand.id).eq('has_variants', true).limit(1).single();
  
  if (product) {
    const { error } = await supabase.from('product_variants').insert({
      product_id: product.id,
      name: 'test_var',
      type: 'volume',
      mrp_price: 100,
      selling_price: 100,
      price: 100,
      stock: 100
    });
    console.log("Insert test error:", error ? error.message : "Success");
    if (!error) {
       await supabase.from('product_variants').delete().eq('product_id', product.id).eq('name', 'test_var');
    }
  }
}
runSQL();
