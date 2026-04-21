import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const checkData = async () => {
  const { data: catSettings } = await supabase.from('category_settings').select('*');
  console.log('Category settings:', catSettings);

  const { data: products } = await supabase.from('products').select('category');
  
  const uniqueCategories = [...new Set(products.map(p => p.category))];
  console.log('Unique categories in products:', uniqueCategories);
};

checkData();
