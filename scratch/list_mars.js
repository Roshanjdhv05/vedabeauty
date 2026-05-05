
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function listMars() {
  const { data: brands } = await supabase.from('brands').select('id').ilike('name', '%MARS%');
  if (!brands || brands.length === 0) {
    console.log('No MARS brand found');
    return;
  }
  
  const brandIds = brands.map(b => b.id);
  
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, mrp_price, selling_price, category')
    .in('brand_id', brandIds);
    
  if (error) {
    console.error(error);
    return;
  }
  
  console.log(JSON.stringify(products, null, 2));
}

listMars();
