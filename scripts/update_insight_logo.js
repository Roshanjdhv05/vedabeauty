import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateBrandLogo() {
  console.log("Updating Insight brand logo to /brands/insight.png...");
  
  const { error } = await supabase
    .from('brands')
    .update({ logo_url: '/brands/insight.png' })
    .eq('name', 'Insight');

  if (error) {
    console.error("Error updating brand logo:", error.message);
  } else {
    console.log("✅ Successfully updated Insight brand logo to /brands/insight.png");
  }
}

updateBrandLogo();
