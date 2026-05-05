import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const RAW_PRODUCT_LIST = [
  // PRIMER
  { name: "3 in 1 Primer 30ml", category: "PRIMER", mrp_price: 310 },
  { name: "3 in 1 Primer 10ml", category: "PRIMER", mrp_price: 150 },
  { name: "Pore Primer 10ml", category: "PRIMER", mrp_price: 140 },
  { name: "Pore Primer 30ml", category: "PRIMER", mrp_price: 415 },
  { name: "Prime N Perfect Hydrating Primer 10ml", category: "PRIMER", mrp_price: 140 },
  { name: "Prime N Perfect Hydrating Primer 30ml", category: "PRIMER", mrp_price: 380 },

  // BLUSHER
  { name: "Blusher (06 shades)", category: "BLUSHER", mrp_price: 105 },
  { name: "Glow Blusher Palette", category: "BLUSHER", mrp_price: 265 },
  { name: "Face Glow Blusher Palette", category: "BLUSHER", mrp_price: 230 },
  { name: "Lip & Cheek Tint Blusher (06 shades)", category: "BLUSHER", mrp_price: 115 },
  { name: "Cream Blush (06 shades)", category: "BLUSHER", mrp_price: 220 },
  { name: "Cheek Tint Blush (03 shades)", category: "BLUSHER", mrp_price: 155 },
  { name: "Creamy Lip & Cheek Tint (05 shades)", category: "BLUSHER", mrp_price: 235 },
  { name: "On The Go Blush Stick (05 shades)", category: "BLUSHER", mrp_price: 230 },
  { name: "Blush (05 shades)", category: "BLUSHER", mrp_price: 305 },
  { name: "Baked Blush (05 shades)", category: "BLUSHER", mrp_price: 170 },
  { name: "I'm Tinted Blush (04 shades)", category: "BLUSHER", mrp_price: 260 },
  { name: "Glow Play Blush & Highlighter (2 variants)", category: "BLUSHER", mrp_price: 200 },
  { name: "Brick Blusher (05 shades)", category: "BLUSHER", mrp_price: 220 },

  // CONCEALER
  { name: "Blemish Free Concealer (06 shades)", category: "CONCEALER", mrp_price: 135 },
  { name: "Pro Concealer Palette (2 variants)", category: "CONCEALER", mrp_price: 255 },
  { name: "HD Conceal, Correct & Contour (3 variants)", category: "CONCEALER", mrp_price: 345 },
  { name: "Concealer Corrector Palette", category: "CONCEALER", mrp_price: 420 },
  { name: "HD Concealer (11 shades)", category: "CONCEALER", mrp_price: 310 },
  { name: "Pro Conceal HD (11 shades)", category: "CONCEALER", mrp_price: 245 },
  { name: "No Smudge Concealer (09 shades)", category: "CONCEALER", mrp_price: 150 },
  { name: "Skin Touch Longwear Stick Concealer (18 shades)", category: "CONCEALER", mrp_price: 255 },
  { name: "Mega Cover Concealer (09 shades)", category: "CONCEALER", mrp_price: 270 },

  // FOUNDATION
  { name: "Concealer Foundation (10 shades)", category: "FOUNDATION", mrp_price: 260 },
  { name: "HD Foundation (11 shades)", category: "FOUNDATION", mrp_price: 170 },
  { name: "SPF-15 BB Foundation (04 shades)", category: "FOUNDATION", mrp_price: 300 },
  { name: "Ultra Thin Second Skin Long Wear Foundation (07 shades)", category: "FOUNDATION", mrp_price: 315 },
  { name: "Stay Matte Liquid Foundation Studio Finish (10 shades)", category: "FOUNDATION", mrp_price: 300 },
  { name: "True Skin Serum Foundation (06 shades)", category: "FOUNDATION", mrp_price: 345 },
  { name: "Matte Finish Full Cover Foundation (06 shades)", category: "FOUNDATION", mrp_price: 365 },
  { name: "Mousse Foundation Pore Filler (03 shades)", category: "FOUNDATION", mrp_price: 320 },
  { name: "Radiance Filter (06 shades)", category: "FOUNDATION", mrp_price: 270 },

  // COMPACT
  { name: "Mineralized Pressed Powder C-33 (13 shades)", category: "COMPACT", mrp_price: 185 },
  { name: "Flawless Finish Setting Powder C-40 (13 shades)", category: "COMPACT", mrp_price: 200 },
  { name: "Prime Perfect Compact Plus Foundation C-41 (07 shades)", category: "COMPACT", mrp_price: 260 },
  { name: "Flawless Finish Setting Powder C-42 (13 shades)", category: "COMPACT", mrp_price: 215 },

  // POWDER
  { name: "HD Finishing Loose Powder TR-202 (03 shades)", category: "POWDER", mrp_price: 160 },
  { name: "Banana Powder", category: "POWDER", mrp_price: 230 },

  // HIGHLIGHTER
  { name: "Blush & Highlighter Palette MK-05", category: "HIGHLIGHTER", mrp_price: 335 },
  { name: "Cheek Highlighter H-01 (06 shades)", category: "HIGHLIGHTER", mrp_price: 135 },
  { name: "Baked Highlighter H-12 (05 shades)", category: "HIGHLIGHTER", mrp_price: 235 },
  { name: "Halo Glow Illuminator H-16 (04 shades)", category: "HIGHLIGHTER", mrp_price: 320 },
  { name: "Duo Stick (3 variants)", category: "HIGHLIGHTER", mrp_price: 245 },

  // FIXERS & REMOVERS
  { name: "Makeup Fixer 75ml", category: "FIXERS & REMOVERS", mrp_price: 240 },
  { name: "Clean & Win Makeup Remover (3 variants)", category: "FIXERS & REMOVERS", mrp_price: 260 },
  { name: "Makeup Remover Wipes", category: "FIXERS & REMOVERS", mrp_price: 75 },

  // SINDOOR
  { name: "Organic Sindoor SND-16 (02 shades: Red, Maroon)", category: "SINDOOR", mrp_price: 60 },
  { name: "Liquid Sindoor SND-19 (Red, Maroon)", category: "SINDOOR", mrp_price: 130 },

  // LIP LINER
  { name: "Glide On Lip Liner (24 shades)", category: "LIP LINER", mrp_price: 95 },
  { name: "Glide On Lip Liner Set of 12 Tin Combo", category: "LIP LINER", mrp_price: 945 },
  { name: "Color Rich Lip Liner LP-09 (14 shades)", category: "LIP LINER", mrp_price: 100 },

  // LIPSTICK
  { name: "Matte Lipstick L-21 (24 shades)", category: "LIPSTICK", mrp_price: 120 },
  { name: "Color Rich Lipstick L-23 (24 shades)", category: "LIPSTICK", mrp_price: 120 },
  { name: "Prime Matte Lipstick L-30 (12 shades)", category: "LIPSTICK", mrp_price: 200 },
  { name: "Mojo Lipstick L-29 (12 shades)", category: "LIPSTICK", mrp_price: 599 },
  { name: "Non Transfer Matte Lipstick LL-03 (28 shades)", category: "LIPSTICK", mrp_price: 120 },
  { name: "Non Transfer Matte Lipstick LL-04 (24 shades)", category: "LIPSTICK", mrp_price: 120 },
  { name: "Mega Last Crayon Lipstick LL-05 (24 shades)", category: "LIPSTICK", mrp_price: 120 },
  { name: "Non Transfer Super Stay Matte Lipstick LL-06 (30 shades)", category: "LIPSTICK", mrp_price: 120 },
  { name: "Forever Matte Lip Color LL-10 (24 shades)", category: "LIPSTICK", mrp_price: 120 },
  { name: "Mousse Lipstick LL-11 (12 shades)", category: "LIPSTICK", mrp_price: 120 },
  { name: "Smudge Free Lip Mud LG-60 (24 shades)", category: "LIPSTICK", mrp_price: 190 },

  // LIP COLOR
  { name: "Non-Transfer Liquid Lipstick LG-39 (24 shades)", category: "LIP COLOR", mrp_price: 120 },
  { name: "Non-Transfer Lip Color LG-40 (29 shades)", category: "LIP COLOR", mrp_price: 120 },
  { name: "Long Wear Color Rich Lip Gloss LG-41 (12 shades)", category: "LIP COLOR", mrp_price: 120 },
  { name: "Matte Lip Ink LG-43 (30 shades)", category: "LIP COLOR", mrp_price: 120 },
  { name: "Matte Lip Serum LG-45 (29 shades)", category: "LIP COLOR", mrp_price: 120 },
  { name: "No Smudge Lip Color LG-49 (24 shades)", category: "LIP COLOR", mrp_price: 120 },
  { name: "Stay Matte Lip Color LG-50 (24 shades)", category: "LIP COLOR", mrp_price: 120 },
  { name: "Soft Lip Creme LG-57 (12 shades)", category: "LIP COLOR", mrp_price: 176 },
  { name: "Creme Matte Mousse LG-59 (24 shades)", category: "LIP COLOR", mrp_price: 170 },

  // LIP GLOSS
  { name: "Peptide Infused Lip Oil LG-54 (06 shades)", category: "LIP GLOSS", mrp_price: 240 },
  { name: "Hydrating Gloss LG-55 (04 shades)", category: "LIP GLOSS", mrp_price: 120 },
  { name: "Lip Cream LG-56 (12 shades)", category: "LIP GLOSS", mrp_price: 120 },

  // LIP BALM
  { name: "Lip Butter LP-06 (04 shades)", category: "LIP BALM", mrp_price: 120 },
  { name: "Hydrating Tinted Lip Balm LP-07 (03 shades)", category: "LIP BALM", mrp_price: 120 },

  // EYEBROW
  { name: "Smudge Free Eyebrow Pencil EP-01 (03 shades)", category: "EYEBROW", mrp_price: 170 },
  { name: "Eyebrow Palette EP-02", category: "EYEBROW", mrp_price: 190 },

  // EYELINER
  { name: "Waterproof Eyeliner EL-32 Shiny", category: "EYELINER", mrp_price: 125 },
  { name: "Waterproof Eyeliner EL-32 Matte", category: "EYELINER", mrp_price: 125 },
  { name: "Waterproof Eyeliner EL-233 Matte", category: "EYELINER", mrp_price: 75 },
  { name: "Waterproof Eyeliner EL-233 Shiny", category: "EYELINER", mrp_price: 95 },
  { name: "Liner Express EL-46 Colours (05 shades)", category: "EYELINER", mrp_price: 190 },
  { name: "Smudge Free Holographic Eyeliner EL-50 (04 shades)", category: "EYELINER", mrp_price: 300 },
  { name: "Waterproof Eye Ink EL-52 Black", category: "EYELINER", mrp_price: 185 },
  { name: "Waterproof Eye Ink EL-52 Colours", category: "EYELINER", mrp_price: 200 },
  { name: "No Smudge Eyeliner EL-53 (Matte)", category: "EYELINER", mrp_price: 95 },
  { name: "Double Effect Eyepen EL-54", category: "EYELINER", mrp_price: 260 },
  { name: "Eye Brow Define Duo 2-in-1 EL-55 (03 shades)", category: "EYELINER", mrp_price: 270 },

  // EYESHADOW
  { name: "Liquid Eyeshadow LES-03 (09 shades)", category: "EYESHADOW", mrp_price: 270 },
  { name: "Pro Eyeshadow ES-110 (3 variants)", category: "EYESHADOW", mrp_price: 270 },
  { name: "Showtime Eyeshadow Palette ES-112 (7 variants)", category: "EYESHADOW", mrp_price: 275 },
  { name: "Eyeshadow Palette ES-115 (4 variants)", category: "EYESHADOW", mrp_price: 290 },
  { name: "Glide & Glow Eyeshadow Stick ES-116 (14 shades)", category: "EYESHADOW", mrp_price: 275 },
  { name: "Duo Eyeshadow Stick ES-117 (05 shades)", category: "EYESHADOW", mrp_price: 280 },
  { name: "All Eyes On You Eyeshadow Palette MK-04 (15-in-1)", category: "EYESHADOW", mrp_price: 335 },
  { name: "Winged Eyes Eyeshadow Palette MK-06 (4 variants)", category: "EYESHADOW", mrp_price: 290 },
  { name: "Eyeshadow Palette MK-07 (02 variants)", category: "EYESHADOW", mrp_price: 275 },
  { name: "Gorgeous 16 Eyeshadow Palette MK-09 (3 variants)", category: "EYESHADOW", mrp_price: 425 },
  { name: "Ready Set Glam Eyeshadow Palette MK-19 (4 variants)", category: "EYESHADOW", mrp_price: 190 },

  // MASCARA & KAJAL
  { name: "Lash Extension Mascara MAS-07 (Black)", category: "MASCARA & KAJAL", mrp_price: 120 },
  { name: "Perfect Ultra Curl Mascara MAS-21 (Black)", category: "MASCARA & KAJAL", mrp_price: 120 },
  { name: "Stay Real Lash Mascara MAS-23 (Transparent)", category: "MASCARA & KAJAL", mrp_price: 120 },
  { name: "Everlasting Voluminous Mascara MAS-24 (Black)", category: "MASCARA & KAJAL", mrp_price: 265 },
  { name: "Long Lasting Mascara MAS-25 (Black)", category: "MASCARA & KAJAL", mrp_price: 270 },
  { name: "Mascara MAS-202 (Black)", category: "MASCARA & KAJAL", mrp_price: 120 },
  { name: "Brow Tattoo Smudge Free EB-02 (03 shades)", category: "MASCARA & KAJAL", mrp_price: 205 },
  { name: "Super Kajal K-01 Black", category: "MASCARA & KAJAL", mrp_price: 95 },
  { name: "Super Kajal K-01 Colours", category: "MASCARA & KAJAL", mrp_price: 120 },
  { name: "Intense Kohl Kajal K-02 Black", category: "MASCARA & KAJAL", mrp_price: 95 },
  { name: "Intense Kohl Kajal K-02 Colours", category: "MASCARA & KAJAL", mrp_price: 95 },

  // NAIL POLISH
  { name: "5 Toxic Free Nail Polish DH-127", category: "NAIL POLISH", mrp_price: 85 },
  { name: "Gel Nail Polish DH-132 (180 shades)", category: "NAIL POLISH", mrp_price: 45 },
  { name: "Nail Polish Smooth Finish DH-134 (180 shades)", category: "NAIL POLISH", mrp_price: 45 },
  { name: "Nail Color DH-137 (180 shades)", category: "NAIL POLISH", mrp_price: 45 },
  { name: "One Coat Nail Polish DH-141 (180 shades)", category: "NAIL POLISH", mrp_price: 50 },
  { name: "Mega Lasting Nail Polish DH-142 (180 shades)", category: "NAIL POLISH", mrp_price: 60 },
  { name: "Nail Polish DH-144 (180 shades)", category: "NAIL POLISH", mrp_price: 50 },
  { name: "Nail Polish DH-145 (180 shades)", category: "NAIL POLISH", mrp_price: 60 },
  { name: "Nail Polish DH-146 (180 shades)", category: "NAIL POLISH", mrp_price: 55 },
  { name: "Nail Polish DH-147 (144 shades)", category: "NAIL POLISH", mrp_price: 120 },
  { name: "Nail Polish DH-148 (180 shades)", category: "NAIL POLISH", mrp_price: 45 },
  { name: "Nail Polish DH-149 (180 shades)", category: "NAIL POLISH", mrp_price: 55 },
  { name: "Nail Polish Soft Shades DH-150 (180 shades)", category: "NAIL POLISH", mrp_price: 65 },
  { name: "Nail Polish DH-151 (202 shades)", category: "NAIL POLISH", mrp_price: 65 },
  { name: "Nail Polish Gel Finish DH-153 (120 shades)", category: "NAIL POLISH", mrp_price: 120 },
  { name: "Nail Polish Luminous DH-154 (24 shades)", category: "NAIL POLISH", mrp_price: 149 },
  { name: "Nail Polish DH-155 (180 shades)", category: "NAIL POLISH", mrp_price: 50 },
  { name: "Nail Polish DH-156 (180 shades)", category: "NAIL POLISH", mrp_price: 50 },
  { name: "Nail Polish DH-157 (180 shades)", category: "NAIL POLISH", mrp_price: 35 },
  { name: "Nail Polish DH-159 (180 shades)", category: "NAIL POLISH", mrp_price: 60 },
  { name: "Mega Lasting Nail Polish DH-160 (180 shades)", category: "NAIL POLISH", mrp_price: 60 },
  { name: "Nail Polish DH-161 (180 shades)", category: "NAIL POLISH", mrp_price: 50 },
  { name: "Nail Polish NP-208 KHAKI (180 shades)", category: "NAIL POLISH", mrp_price: 45 },
  { name: "Nail Polish NP-208 PVC (180 shades)", category: "NAIL POLISH", mrp_price: 45 },
  { name: "Nail Polish NP-210 PVC (180 shades)", category: "NAIL POLISH", mrp_price: 45 },
  { name: "Gel Shine Nail Polish NP-2111 KHAKI (180 shades)", category: "NAIL POLISH", mrp_price: 70 },
  { name: "Gel Shine Nail Polish NP-2111 PVC (180 shades)", category: "NAIL POLISH", mrp_price: 70 },
  { name: "Nail Polish NP-2115 KHAKI (180 shades)", category: "NAIL POLISH", mrp_price: 70 },
  { name: "Nail Polish NP-2115 PVC (180 shades)", category: "NAIL POLISH", mrp_price: 70 },
  { name: "Nail Polish NP-286 KHAKI (180 shades)", category: "NAIL POLISH", mrp_price: 40 },
  { name: "Nail Polish NP-286 PVC (180 shades)", category: "NAIL POLISH", mrp_price: 40 },

  // NAIL POLISH REMOVER
  { name: "Nail Polish Remover Wipes 30 (Apple, Strawberry, Lemon)", category: "NAIL POLISH REMOVER", mrp_price: 60 },
  { name: "Nail Polish Remover Wipes 40 (Red Rose, Musk, Lavender)", category: "NAIL POLISH REMOVER", mrp_price: 80 },
  { name: "Instant Nail Polish Remover 60ml (3 variants)", category: "NAIL POLISH REMOVER", mrp_price: 59 },
  { name: "Instant Nail Polish Remover 100ml (3 variants)", category: "NAIL POLISH REMOVER", mrp_price: 85 },
  { name: "Dip & Go Nail Polish Remover (3 variants)", category: "NAIL POLISH REMOVER", mrp_price: 60 },

  // ACCESSORIES
  { name: "Beauty Blender Sponge Applicator (3 variants)", category: "ACCESSORIES", mrp_price: 145 },
  { name: "Hair Brush Round & Curl", category: "ACCESSORIES", mrp_price: 240 },
  { name: "Hair Brush Round (3 variants: Red, Blue, Black)", category: "ACCESSORIES", mrp_price: 130 },
  { name: "Hair Brush Flat", category: "ACCESSORIES", mrp_price: 130 }
];

const BRAND_NAME = "Insight";
const DISCOUNT_RATE = 0.75; // 25% discount

async function seedInsight() {
  console.log(`Starting seed for ${BRAND_NAME}...`);

  try {
    let { data: brand } = await supabase.from('brands').select('id').eq('name', BRAND_NAME).single();

    let brandId;
    if (!brand) {
      console.log(`Creating brand: ${BRAND_NAME}`);
      const { data: newBrand, error: insertError } = await supabase
        .from('brands')
        .insert({
          name: BRAND_NAME,
          logo_url: "/insight-logo.png" // User can update this
        }).select().single();
      if (insertError) throw insertError;
      brandId = newBrand.id;
    } else {
      brandId = brand.id;
    }

    console.log('Inserting products...');
    for (const item of RAW_PRODUCT_LIST) {
      let baseSellingPrice = Math.round(item.mrp_price * DISCOUNT_RATE);
      let baseMrpPrice = item.mrp_price;
      
      const imageUrl = `/insight/${item.name}.jpg`;

      const { data: existing } = await supabase.from('products').select('id').eq('name', item.name).eq('brand_id', brandId).single();

      if (!existing) {
        await supabase.from('products').insert({
          name: item.name,
          brand_id: brandId,
          category: item.category,
          has_variants: false,
          mrp_price: baseMrpPrice,
          selling_price: baseSellingPrice,
          price: baseSellingPrice,
          original_price: baseMrpPrice,
          discount: 25,
          image_url: imageUrl
        });
      } else {
        await supabase.from('products').update({
          category: item.category,
          mrp_price: baseMrpPrice,
          selling_price: baseSellingPrice,
          price: baseSellingPrice,
          original_price: baseMrpPrice,
          discount: 25,
          image_url: imageUrl
        }).eq('id', existing.id);
      }
    }

    console.log('✅ Insight seeded successfully!');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

seedInsight();
