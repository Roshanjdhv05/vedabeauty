import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BRAND_LOGOS = [
  { name: "Faces Canada", logo: "/brands/faces canda.png" },
  { name: "Lotus", logo: "/brands/lotus.png" },
  { name: "MARS", logo: "/brands/mars_logo.png" },
  { name: "Pilgrim", logo: "/brands/pilgrim.jfif" },
  { name: "Sugar Pop", logo: "/brands/sugar pop.jfif" }
];

async function mapBrandLogos() {
  console.log("Updating brand logos...");

  for (const item of BRAND_LOGOS) {
    const { data, error } = await supabase
      .from('brands')
      .update({ logo_url: item.logo })
      .ilike('name', `%${item.name}%`);

    if (error) {
      console.error(`Error updating ${item.name}:`, error.message);
    } else {
      console.log(`✅ Updated logo for: ${item.name}`);
    }
  }

  console.log("Done!");
}

mapBrandLogos();
