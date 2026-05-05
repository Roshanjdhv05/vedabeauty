import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase.from('products').select('id, name').eq('brand_id', 'fb4299f8-55d5-4a8b-9b20-b0265438bcee');
  console.log('Products found:', data ? data.length : 0);
  if (error) console.error(error);
}
check();
