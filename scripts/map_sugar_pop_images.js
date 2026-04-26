import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Manual mapping: product name in DB => image filename in public/sugar pop/
const imageMap = {
  "Ultrastay Transferproof Lipstick":               "/sugar pop/ULTRASTAY TRANSFERPROOF LIPSTICK.png",
  "Matte Lipcolour":                                "/sugar pop/MATTE LIPCOLOUR.png",
  "Satin Matte Lipstick":                           "/sugar pop/SATIN MATTE LIPSTICK.png",
  "4 in 1 Lip Twist":                               "/sugar pop/4 IN 1 LIP TWIST.png",
  "Nourishing Lip Balm":                            "/sugar pop/NOURISHING LIP BALM.png",
  "High Shine Lip Gloss":                           "/sugar pop/HIGH SINE LIP GLOSS.png",
  "Lip Liner Velvet Matte":                         "/sugar pop/LIP LINER VELVET MATTE.png",

  "HD Liquid Foundation":                           "/sugar pop/HD LIQUID FOUNDATION.png",
  "Banana Powder":                                  "/sugar pop/BANANA POWDER.png",
  "Full Coverage Concealer":                        "/sugar pop/FULL COVERRAGE CONCEALER.png",
  "Perfecting Primer":                              "/sugar pop/PERFECTING.png",
  "Ultra HD Blush":                                 "/sugar pop/ULTRA HD BLUSH.png",
  "Makeup Setting Spray":                           "/sugar pop/MAKEUP SETTING SPRAY.png",
  "Longwear Compact":                               "/sugar pop/LONGWEAR COMPACT.png",

  "Eyeshadow Palette":                              "/sugar pop/EYESHADOW PALETTE.png",
  "Intense Kohl":                                   "/sugar pop/INTENSE KOHL.png",
  "Longwear Kajal (Black)":                         "/sugar pop/LONGWEAR KAJAL.png",
  "Longwear Kajal (Blue / Brown)":                  "/sugar pop/LONGWEAR KAJAL.png",
  "24 Hour Waterproof Kajal":                       "/sugar pop/24 HOUR WATERPROOF KAJAL.png",
  "Brow Shaper":                                    "/sugar pop/BROW SHAPER.png",
  "Volumizing Mascara":                             "/sugar pop/VOLUMIZING MASCARA.png",
  "Waterproof Mascara":                             "/sugar pop/WATERPROOF MASCARA.png",
  "Matte Eyeliner":                                 "/sugar pop/MATTE EYELINER.png",
  "Waterproof Eyeliner":                            "/sugar pop/WATERPROOF EYELINER.png",

  "SPF 25 Brightening Lotion":                      "/sugar pop/SPF 25 BRIGHTENING LOTION.png",
  "Intense Nourishing Lotion":                      "/sugar pop/INTENSE NOURISHING LOTION.png",
  "Instant Brightening Serum":                      "/sugar pop/INSTANT BRIGHTENING SERUM.png",
  "SPF 50 Sunscreen":                               "/sugar pop/SPF 50 SUNSCREEN.png",
  "Vitamin C & Tea Tree Face Wash":                 "/sugar pop/VITAMIN TEA TREE FACE WASH.png",
  "Body Wash – Vitamin C & Aloe Vera":              "/sugar pop/BODY WASH VITAMIN C ALOE VERA.png",
  "Body Wash – Hyaluronic Acid & Moroccan Rose":    "/sugar pop/BODY WASH HYALURONIC ACID MOROCCAN ROSE.png",
  "Body Wash – Salicylic Acid with Coffee Extract": "/sugar pop/BODY WASH SALICYLIC ACID WITH COFFE EXTRACT.png",
  "Body Wash – Niacinamide & Acai Berry":           "/sugar pop/BODY WASH NIACINAMIDE ACAI BERRY.png",

  "Nail Lacquer Classic":                           "/sugar pop/NAIL LACQUER CLASSIC.png",
  "Glitter Nail Lacquer":                           "/sugar pop/GLITTER NAIL LACQUER.png",
  "Strengthening Base Coat":                        "/sugar pop/STRENGTHENING BASE COAT.png",
  "Dip & Twist Nail Lacquer Remover":               "/sugar pop/DIP TWIST NAIL LACQUER REMOVER.png",
  "Nail Lacquer Remover":                           "/sugar pop/NAIL LACQUER REMOVER.png",
};

async function mapImages() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Sugar Pop').single();
  if (!brand) { console.error('Sugar Pop brand not found'); return; }

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
