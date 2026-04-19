
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

async function checkMarsImages() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, image_url, brand_name, brand_id')
    .in('name', ['Master Blender', 'Highlashes Eyelashes', 'Fabulash Eyelashes']);

  if (error) {
    console.error(error);
    return;
  }

  console.log(JSON.stringify(products, null, 2));
}

checkMarsImages();
