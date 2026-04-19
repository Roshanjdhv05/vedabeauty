const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env');
const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
const env = envLines.reduce((acc, line) => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function check() {
  // Check brands
  const { data: brandsData, error: bError } = await supabase.from('brands').select('*');
  console.log("Brands Table:", brandsData, bError);

  // Check unique brands in products
  const { data: pData, error: pError } = await supabase.from('products').select('*');
  if (pData) {
    const uniqueBrands = [...new Set(pData.map(p => p.brand || p.brand_name).filter(Boolean))];
    console.log("Unique Brands in Products Table:", uniqueBrands);
  } else {
    console.log("Products error:", pError);
  }
}

check();
