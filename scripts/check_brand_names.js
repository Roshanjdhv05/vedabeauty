import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser for scripts
const envPath = path.resolve(process.cwd(), '.env');
const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
const env = envLines.reduce((acc, line) => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function checkBrandNames() {
  const { data, error } = await supabase.from('products').select('brand_name').limit(10);
  if (error) {
    console.error(error);
  } else {
    console.log('Brand names in products:', [...new Set(data.map(d => d.brand_name))]);
  }
}

checkBrandNames();
