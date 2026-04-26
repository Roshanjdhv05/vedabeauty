import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Manual mapping: product name in DB => image filename in public/faces canada/
const imageMap = {
  "Strobe Cream":                                              "/faces canada/STROBE CREAM.png",
  "3 in 1 All Day Hydra Matte Foundation":                     "/faces canada/3IN1 ALL DAY HYDRA MATTE FOUNDATION.png",
  "Weightless Stay Matte Compact":                             "/faces canada/WEIGHTLESS STAY MATTE COMPACT.jpg",
  "Peaches N Cream Tinted Moisturizer":                        "/faces canada/PEACHES N CREAM.jpg",
  "UltimePro Hydrating Makeup Fixer":                          "/faces canada/ULTIMEPRO HYDRATING MAKEUP FIXER.jpg",
  "BB Gel Crème":                                              "/faces canada/BB GEL CREME.jpg",
  "Weightless Matte Foundation":                               "/faces canada/WEIGHTLESS MATTE FOUNDATION.jpg",
  "High Cover Concealer":                                      "/faces canada/HIGH COVER CONCEALER.jpg",
  "3in1 Primer":                                               "/faces canada/3IN1 PRIMER.png",
  "Fresh Clean Glow Makeup Remover Wipes":                     "/faces canada/FRESH CLEAN GLOW MAKEUP REMOVER WIPES.png",
  "Liquid Sindoor":                                            "/faces canada/LIQUID SINDOOR.jpg",

  "UltimePro HD Intense Matte Lips + Primer – Festive Edition": "/faces canada/ULTIMEPRO HD INTENSE MATEE LIPS PRIMER FESTIVE EDITION.jpg",
  "Comfy Matte WOW Liquid Lipstick":                           "/faces canada/COMFY MATTE WOW LIQUID LIPSTICK.png",
  "Comfy Matte Velvet Touch Lipstick":                         "/faces canada/COMFY MATTE VELVET TOUCH LIPSTICK.jpg",
  "Vitamin C Lip Balm":                                        "/faces canada/VITAMIN C LIP BALM.jpg",

  "Fresh Eyes Kajal":                                          "/faces canada/FRESH EYES KAJAL.jpg",
  "Magneteyes Kajal":                                          "/faces canada/MAGNETEYES KAJAL.jpg",
  "Magneteyes Matte Eyeliner":                                 "/faces canada/MAGNETEYES MATTE EYELINER.png",
  "Magneteyes Mascara":                                        "/faces canada/MAGNETEYES MASCARA.jpg",
  "Magneteyes Trio Pack":                                      "/faces canada/Screenshot_1.png",
  "UltimePro Intense Gel Kajal Black":                         "/faces canada/ULTIME PRO INTENSE GEL KAJAL BLACK.png",
  "Longwear Eye Pencil Solid Black":                           "/faces canada/LONGWEAR EYE PENCIL SOLID BLACK.png",

  "Ultime Pro Splash Nail Enamel":                             "/faces canada/ULTIMEPRO SPLASH NAIL ENAMEL.png",
  "InstaRemove Dip & Twist Nail Enamel Remover":               "/faces canada/INSTAREMOVER.png",
  "Nail Enamel Remover":                                       "/faces canada/NAIL ENAMEL.png",
};

async function mapImages() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Faces Canada').single();
  if (!brand) { console.error('Faces Canada brand not found'); return; }

  const { data: products } = await supabase.from('products').select('id, name').eq('brand_id', brand.id);

  let updated = 0;
  let missed = 0;

  for (const product of products) {
    const imageUrl = imageMap[product.name];
    if (!imageUrl) {
      console.warn(`❌ No image mapping for: "${product.name}"`);
      missed++;
      continue;
    }
    const { error } = await supabase.from('products').update({ image_url: imageUrl }).eq('id', product.id);
    if (error) {
      console.error(`Error updating ${product.name}:`, error.message);
    } else {
      console.log(`✅ ${product.name} → ${imageUrl}`);
      updated++;
    }
  }

  console.log(`\nDone! ${updated} updated, ${missed} missed.`);
}

mapImages();
