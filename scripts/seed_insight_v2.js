import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const RAW_PRODUCT_LIST = [
  // PRIMER
  { name: "3 in 1 Primer", category: "PRIMER", has_variants: true, image_name: "3 in 1 Primer 30ml.png", variants: [{ name: "30ml", type: "volume", mrp_price: 340, stock: 100 }, { name: "10ml", type: "volume", mrp_price: 150, stock: 100 }] },
  { name: "Pore Primer", category: "PRIMER", has_variants: true, image_name: "Pore Primer 30ml.png", variants: [{ name: "30ml", type: "volume", mrp_price: 415, stock: 100 }, { name: "10ml", type: "volume", mrp_price: 140, stock: 100 }] },
  { name: "Prime N Perfect Hydrating Primer", category: "PRIMER", has_variants: true, image_name: "Prime N Perfect Hydrating Primer 30ml.png", variants: [{ name: "30ml", type: "volume", mrp_price: 380, stock: 100 }, { name: "10ml", type: "volume", mrp_price: 140, stock: 100 }] },

  // BLUSHER
  { name: "Lip & Cheek Tint Blusher", category: "BLUSHER", has_variants: false, mrp_price: 115, image_name: "Lip & Cheek Tint Blusher (06 shades).png" },
  { name: "Face Glow Blusher Palette", category: "BLUSHER", has_variants: false, mrp_price: 230, image_name: "Face Glow Blusher Palette.png" },
  { name: "Blusher", category: "BLUSHER", has_variants: false, mrp_price: 105, image_name: "Blusher (06 shades).png" },
  { name: "Glow Blusher Palette", category: "BLUSHER", has_variants: false, mrp_price: 265, image_name: "Glow Blusher Palette.png" },
  { name: "Cream Blush", category: "BLUSHER", has_variants: false, mrp_price: 220, image_name: "Cream Blush (06 shades).png" },
  { name: "On The Go Blush Stick", category: "BLUSHER", has_variants: false, mrp_price: 230, image_name: "On The Go Blush Stick (05 shades).png" },
  { name: "Cheek Tint Blush", category: "BLUSHER", has_variants: false, mrp_price: 155, image_name: "Cheek Tint Blush (03 shades).png" },
  { name: "Creamy Lip & Cheek Tint", category: "BLUSHER", has_variants: false, mrp_price: 235, image_name: "Creamy Lip & Cheek Tint (05 shades).png" },
  { name: "Blush", category: "BLUSHER", has_variants: false, mrp_price: 305, image_name: "Blush (05 shades).png" },
  { name: "Baked Blush", category: "BLUSHER", has_variants: false, mrp_price: 170, image_name: "Baked Blush (05 shades).png" },
  { name: "I'm Tinted Blush", category: "BLUSHER", has_variants: false, mrp_price: 260, image_name: "I'm Tinted Blush (04 shades).png" },
  { name: "Glow Play Blush & Highlighter", category: "BLUSHER", has_variants: false, mrp_price: 200, image_name: "Glow Play Blush & Highlighter (2 variants).png" },
  { name: "Brick Blusher", category: "BLUSHER", has_variants: false, mrp_price: 220, image_name: "Brick Blusher (05 shades).png" },

  // CONCEALER
  { name: "Blemish Free Concealer", category: "CONCEALER", has_variants: false, mrp_price: 135, image_name: "Blemish Free Concealer (06 shades).png" },
  { name: "Pro Concealer Palette", category: "CONCEALER", has_variants: false, mrp_price: 255, image_name: "Pro Concealer Palette (2 variants).png" },
  { name: "Concealer Corrector Palette", category: "CONCEALER", has_variants: false, mrp_price: 420, image_name: "Concealer Corrector Palette.png" },
  { name: "HD Conceal, Correct & Contour", category: "CONCEALER", has_variants: false, mrp_price: 345, image_name: "Pro Conceal HD (11 shades).png" }, // Fallback to a close image
  { name: "HD Concealer", category: "CONCEALER", has_variants: false, mrp_price: 310, image_name: "HD Concealer (11 shades).png" },
  { name: "Pro Conceal HD", category: "CONCEALER", has_variants: false, mrp_price: 245, image_name: "Pro Conceal HD (11 shades).png" },
  { name: "No Smudge Concealer", category: "CONCEALER", has_variants: false, mrp_price: 150, image_name: "No Smudge Concealer (09 shades).png" },
  { name: "Mega Cover Concealer", category: "CONCEALER", has_variants: false, mrp_price: 270, image_name: "Mega Cover Concealer (09 shades).png" },
  { name: "Skin Touch Longwear Stick Concealer", category: "CONCEALER", has_variants: false, mrp_price: 255, image_name: "Skin Touch Longwear Stick Concealer (18 shades).png" },

  // FOUNDATION
  { name: "Concealer Foundation", category: "FOUNDATION", has_variants: false, mrp_price: 310, image_name: "Concealer Foundation (10 shades).png" },
  { name: "HD Foundation", category: "FOUNDATION", has_variants: false, mrp_price: 315, image_name: "HD Foundation (11 shades).png" },
  { name: "SPF-15 BB Foundation", category: "FOUNDATION", has_variants: false, mrp_price: 170, image_name: "SPF-15 BB Foundation (04 shades).png" },
  { name: "Ultra Thin Second Skin Long Wear Foundation", category: "FOUNDATION", has_variants: false, mrp_price: 260, image_name: "Ultra Thin Second Skin Long Wear Foundation (07 shades).png" },
  { name: "True Skin Serum Foundation", category: "FOUNDATION", has_variants: false, mrp_price: 345, image_name: "True Skin Serum Foundation (06 shades).png" },
  { name: "Matte Finish Full Cover Foundation", category: "FOUNDATION", has_variants: false, mrp_price: 365, image_name: "Matte Finish Full Cover Foundation (06 shades).png" },
  { name: "Mousse Foundation Pore Filler", category: "FOUNDATION", has_variants: false, mrp_price: 320, image_name: "Mousse Foundation Pore Filler (03 shades).png" },
  { name: "Stay Matte Liquid Foundation Studio Finish", category: "FOUNDATION", has_variants: false, mrp_price: 300, image_name: "Stay Matte Liquid Foundation Studio Finish (10 shades).png" },
  { name: "Radiance Filter", category: "FOUNDATION", has_variants: false, mrp_price: 289, image_name: "Radiance Filter (06 shades).png" },

  // COMPACT
  { name: "Mineralized Pressed Powder", category: "COMPACT", has_variants: false, mrp_price: 185, image_name: "Mineralized Pressed Powder C-33 (13 shades).png" },
  { name: "Flawless Finish Setting Powder C-40", category: "COMPACT", has_variants: false, mrp_price: 200, image_name: "Flawless Finish Setting Powder C-40 (13 shades).png" },
  { name: "Flawless Finish Setting Powder C-42", category: "COMPACT", has_variants: false, mrp_price: 215, image_name: "Flawless Finish Setting Powder C-42 (13 shades).png" },
  { name: "Prime Perfect Compact Plus Foundation", category: "COMPACT", has_variants: false, mrp_price: 260, image_name: "Prime Perfect Compact Plus Foundation C-41 (07 shades).png" },

  // POWDER
  { name: "HD Finishing Loose Powder", category: "POWDER", has_variants: false, mrp_price: 160, image_name: "HD Finishing Loose Powder TR-202 (03 shades).png" },
  { name: "Banana Powder", category: "POWDER", has_variants: false, mrp_price: 230, image_name: "Banana Powder.png" },

  // HIGHLIGHTER
  { name: "Blush & Highlighter Palette", category: "HIGHLIGHTER", has_variants: false, mrp_price: 335, image_name: "Blush & Highlighter Palette MK-05.png" },
  { name: "Cheek Highlighter", category: "HIGHLIGHTER", has_variants: false, mrp_price: 135, image_name: "Cheek Highlighter H-01 (06 shades).png" },
  { name: "Baked Highlighter", category: "HIGHLIGHTER", has_variants: false, mrp_price: 235, image_name: "Baked Highlighter H-12 (05 shades).png" },
  { name: "Halo Glow Illuminator", category: "HIGHLIGHTER", has_variants: false, mrp_price: 320, image_name: "Halo Glow Illuminator H-16 (04 shades).png" },
  { name: "Duo Stick", category: "HIGHLIGHTER", has_variants: false, mrp_price: 245, image_name: "Duo Stick (3 variants).png" },

  // FIXERS & REMOVERS
  { name: "Makeup Fixer", category: "FIXERS & REMOVERS", has_variants: false, mrp_price: 240, image_name: "Makeup Fixer 75ml.png" },
  { name: "Clean & Win Makeup Remover", category: "FIXERS & REMOVERS", has_variants: false, mrp_price: 260, image_name: "Clean & Win Makeup Remover (3 variants).png" },

  // SINDOOR
  { name: "Organic Sindoor", category: "SINDOOR", has_variants: true, image_name: "Organic Sindoor SND-16 (02 shades- Red, Maroon).png", variants: [{ name: "Red", type: "shade", mrp_price: 60, stock: 100 }, { name: "Maroon", type: "shade", mrp_price: 60, stock: 100 }] },
  { name: "Liquid Sindoor", category: "SINDOOR", has_variants: true, image_name: "Liquid Sindoor SND-19 (Red, Maroon).png", variants: [{ name: "Red", type: "shade", mrp_price: 130, stock: 100 }, { name: "Maroon", type: "shade", mrp_price: 130, stock: 100 }] },

  // LIP LINER
  { name: "Glide On Lip Liner", category: "LIP LINER", has_variants: false, mrp_price: 95, image_name: "Glide On Lip Liner (24 shades).png" },
  { name: "Glide On Lip Liner Set of 12 Tin Combo", category: "LIP LINER", has_variants: false, mrp_price: 945, image_name: "Glide On Lip Liner Set of 12 Tin Combo.png" },
  { name: "Color Rich Lip Liner", category: "LIP LINER", has_variants: false, mrp_price: 110, image_name: "Color Rich Lip Liner LP-09 (14 shades).png" },

  // LIPSTICK
  { name: "Color Rich Lipstick", category: "LIPSTICK", has_variants: false, mrp_price: 180, image_name: "Color Rich Lipstick L-23 (24 shades).png" },
  { name: "Matte Lipstick", category: "LIPSTICK", has_variants: false, mrp_price: 110, image_name: "Matte Lipstick L-21 (24 shades).png" },
  { name: "Non Transfer Matte Lipstick LL-03", category: "LIPSTICK", has_variants: false, mrp_price: 310, image_name: "Non Transfer Matte Lipstick LL-03 (28 shades).png" },
  { name: "Non Transfer Matte Lipstick LL-04", category: "LIPSTICK", has_variants: false, mrp_price: 350, image_name: "Non Transfer Matte Lipstick LL-04 (24 shades).png" },
  { name: "Mega Last Crayon Lipstick", category: "LIPSTICK", has_variants: false, mrp_price: 280, image_name: "Mega Last Crayon Lipstick LL-05 (24 shades).png" },
  { name: "Non Transfer Super Stay Matte Lipstick", category: "LIPSTICK", has_variants: false, mrp_price: 380, image_name: "Non Transfer Super Stay Matte Lipstick LL-06 (30 shades).png" },
  { name: "Mojo Lipstick", category: "LIPSTICK", has_variants: false, mrp_price: 599, image_name: "Mojo Lipstick L-29 (12 shades).png" },
  { name: "Smudge Free Lip Mud", category: "LIPSTICK", has_variants: false, mrp_price: 200, image_name: "Smudge Free Lip Mud LG-60 (24 shades).png" },
  { name: "Mousse Lipstick", category: "LIPSTICK", has_variants: false, mrp_price: 345, image_name: "Mousse Lipstick LL-11 (12 shades).png" },
  { name: "Prime Matte Lipstick", category: "LIPSTICK", has_variants: false, mrp_price: 215, image_name: "Prime Matte Lipstick L-30 (12 shades).png" },
  { name: "Forever Matte Lip Color", category: "LIPSTICK", has_variants: false, mrp_price: 240, image_name: "Forever Matte Lip Color LL-10 (24 shades).png" },

  // LIP COLOR
  { name: "Non-Transfer Lip Color", category: "LIP COLOR", has_variants: false, mrp_price: 130, image_name: "Non-Transfer Lip Color LG-40 (29 shades).png" },
  { name: "Long Wear Color Rich Lip Gloss", category: "LIP COLOR", has_variants: false, mrp_price: 110, image_name: "Long Wear Color Rich Lip Gloss LG-41 (12 shades).png" },
  { name: "Matte Lip Ink", category: "LIP COLOR", has_variants: false, mrp_price: 170, image_name: "Matte Lip Ink LG-43 (30 shades).png" },
  { name: "Matte Lip Serum", category: "LIP COLOR", has_variants: false, mrp_price: 240, image_name: "Matte Lip Serum LG-45 (29 shades).png" },
  { name: "No Smudge Lip Color", category: "LIP COLOR", has_variants: false, mrp_price: 305, image_name: "No Smudge Lip Color LG-49 (24 shades).png" },
  { name: "Stay Matte Lip Color", category: "LIP COLOR", has_variants: false, mrp_price: 250, image_name: "Stay Matte Lip Color LG-50 (24 shades).png" },
  { name: "Soft Lip Creme", category: "LIP COLOR", has_variants: false, mrp_price: 200, image_name: "Soft Lip Creme LG-57 (12 shades).png" },
  { name: "Creme Matte Mousse", category: "LIP COLOR", has_variants: false, mrp_price: 185, image_name: "Creme Matte Mousse LG-59 (24 shades).png" },

  // LIP GLOSS
  { name: "Hydrating Gloss", category: "LIP GLOSS", has_variants: false, mrp_price: 280, image_name: "Hydrating Gloss LG-55 (04 shades).png" },
  { name: "Lip Cream", category: "LIP GLOSS", has_variants: false, mrp_price: 215, image_name: "Lip Cream LG-56 (12 shades).png" },
  { name: "Peptide Infused Lip Oil", category: "LIP GLOSS", has_variants: false, mrp_price: 240, image_name: "Peptide Infused Lip Oil LG-54 (06 shades).png" },

  // LIP BALM
  { name: "Lip Butter", category: "LIP BALM", has_variants: false, mrp_price: 115, image_name: "Lip Butter LP-06 (04 shades).png" },
  { name: "Hydrating Tinted Lip Balm", category: "LIP BALM", has_variants: false, mrp_price: 175, image_name: "Hydrating Tinted Lip Balm LP-07 (03 shades).png" },

  // EYEBROW
  { name: "Smudge Free Eyebrow Pencil", category: "EYEBROW", has_variants: true, image_name: "Brow Tattoo Smudge Free EB-02 (03 shades).png", variants: [{ name: "Black", type: "shade", mrp_price: 170, stock: 100 }, { name: "Brown", type: "shade", mrp_price: 170, stock: 100 }, { name: "Grey", type: "shade", mrp_price: 170, stock: 100 }] },
  { name: "Eyebrow Palette", category: "EYEBROW", has_variants: false, mrp_price: 190, image_name: "Eyebrow Palette EP-02.png" },

  // EYELINER
  { name: "Waterproof Eye Ink", category: "EYELINER", has_variants: true, image_name: "Waterproof Eye Ink EL-52 Black.png", variants: [{ name: "Black", type: "shade", mrp_price: 185, stock: 100 }, { name: "Colours", type: "shade", mrp_price: 200, stock: 100 }] },
  { name: "Double Effect Eyepen", category: "EYELINER", has_variants: false, mrp_price: 260, image_name: "Double Effect Eyepen EL-54.png" },
  { name: "No Smudge Eyeliner Matte", category: "EYELINER", has_variants: false, mrp_price: 95, image_name: "No Smudge Eyeliner EL-53 (Matte).png" },
  { name: "Liner Express", category: "EYELINER", has_variants: false, mrp_price: 190, image_name: "Liner Express EL-46 Colours (05 shades).png" },
  { name: "Waterproof Eyeliner EL-32", category: "EYELINER", has_variants: true, image_name: "Waterproof Eyeliner EL-32 Shiny.png", variants: [{ name: "Shiny", type: "shade", mrp_price: 125, stock: 100 }, { name: "Matte", type: "shade", mrp_price: 125, stock: 100 }] },
  { name: "Waterproof Eyeliner EL-233", category: "EYELINER", has_variants: true, image_name: "Waterproof Eyeliner EL-233 Matte.png", variants: [{ name: "Matte", type: "shade", mrp_price: 75, stock: 100 }, { name: "Shiny", type: "shade", mrp_price: 95, stock: 100 }] },
  { name: "Smudge Free Holographic Eyeliner", category: "EYELINER", has_variants: false, mrp_price: 300, image_name: "Smudge Free Holographic Eyeliner EL-50 (04 shades).png" },
  { name: "Eye Brow Define Duo 2-in-1", category: "EYELINER", has_variants: false, mrp_price: 270, image_name: "Eye Brow Define Duo 2-in-1 EL-55 (03 shades).png" },

  // EYESHADOW
  { name: "Liquid Eyeshadow", category: "EYESHADOW", has_variants: false, mrp_price: 155, image_name: "Liquid Eyeshadow LES-03 (09 shades).png" },
  { name: "Eyeshadow Palette (2 variants)", category: "EYESHADOW", has_variants: false, mrp_price: 275, image_name: "Eyeshadow Palette MK-07 (02 variants).png" },
  { name: "Eyeshadow Palette (4 variants)", category: "EYESHADOW", has_variants: false, mrp_price: 290, image_name: "Eyeshadow Palette ES-115 (4 variants).png" },
  { name: "Gorgeous 16 Eyeshadow Palette", category: "EYESHADOW", has_variants: false, mrp_price: 425, image_name: "Gorgeous 16 Eyeshadow Palette MK-09 (3 variants).png" },
  { name: "Pro Eyeshadow", category: "EYESHADOW", has_variants: false, mrp_price: 270, image_name: "Pro Eyeshadow ES-110 (3 variants).png" },
  { name: "Showtime Eyeshadow Palette", category: "EYESHADOW", has_variants: false, mrp_price: 275, image_name: "Showtime Eyeshadow Palette ES-112 (7 variants).png" },
  { name: "Winged Eyes Eyeshadow Palette", category: "EYESHADOW", has_variants: false, mrp_price: 290, image_name: "Winged Eyes Eyeshadow Palette MK-06 (4 variants).png" },
  { name: "All Eyes On You Eyeshadow Palette 15-in-1", category: "EYESHADOW", has_variants: false, mrp_price: 335, image_name: "All Eyes On You Eyeshadow Palette MK-04 (15-in-1).png" },
  { name: "Glide & Glow Eyeshadow Stick", category: "EYESHADOW", has_variants: false, mrp_price: 275, image_name: "Glide & Glow Eyeshadow Stick ES-116 (14 shades).png" },
  { name: "Duo Eyeshadow Stick", category: "EYESHADOW", has_variants: false, mrp_price: 280, image_name: "Duo Eyeshadow Stick ES-117 (05 shades).png" },
  { name: "Ready Set Glam Eyeshadow Palette", category: "EYESHADOW", has_variants: false, mrp_price: 190, image_name: "Ready Set Glam Eyeshadow Palette MK-19 (4 variants).png" },

  // MASCARA
  { name: "Mascara", category: "MASCARA & KAJAL", has_variants: false, mrp_price: 150, image_name: "Mascara MAS-202 (Black).png" },
  { name: "Lash Extension Mascara", category: "MASCARA & KAJAL", has_variants: false, mrp_price: 280, image_name: "Lash Extension Mascara MAS-07 (Black).png" },
  { name: "Perfect Ultra Curl Mascara", category: "MASCARA & KAJAL", has_variants: false, mrp_price: 180, image_name: "Perfect Ultra Curl Mascara MAS-21 (Black).png" },
  { name: "Stay Real Lash Mascara", category: "MASCARA & KAJAL", has_variants: false, mrp_price: 170, image_name: "Stay Real Lash Mascara MAS-23 (Transparent).png" },
  { name: "Everlasting Voluminous Mascara", category: "MASCARA & KAJAL", has_variants: false, mrp_price: 265, image_name: "Everlasting Voluminous Mascara MAS-24 (Black).png" },
  { name: "Brow Tattoo Smudge Free", category: "MASCARA & KAJAL", has_variants: false, mrp_price: 205, image_name: "Brow Tattoo Smudge Free EB-02 (03 shades).png" },

  // KAJAL / KOHL
  { name: "Intense Kohl Kajal", category: "MASCARA & KAJAL", has_variants: true, image_name: "Intense Kohl Kajal K-02 Black.png", variants: [{ name: "Black", type: "shade", mrp_price: 130, stock: 100 }, { name: "White", type: "shade", mrp_price: 130, stock: 100 }, { name: "Colours", type: "shade", mrp_price: 120, stock: 100 }] },
  { name: "Super Kajal", category: "MASCARA & KAJAL", has_variants: true, image_name: "Super Kajal K-01 Black.png", variants: [{ name: "Black", type: "shade", mrp_price: 175, stock: 100 }, { name: "Colours", type: "shade", mrp_price: 165, stock: 100 }] },

  // ACCESSORIES
  { name: "Beauty Blender Sponge Applicator", category: "ACCESSORIES", has_variants: true, image_name: "Beauty Blender Sponge Applicator (3 variants).png", variants: [{ name: "Beige", type: "shade", mrp_price: 145, stock: 100 }, { name: "Pink", type: "shade", mrp_price: 145, stock: 100 }, { name: "Orange", type: "shade", mrp_price: 145, stock: 100 }] },
  { name: "Hair Brush", category: "ACCESSORIES", has_variants: true, image_name: "Hair Brush Flat.png", variants: [{ name: "Flat", type: "size", mrp_price: 250, stock: 100 }, { name: "Round", type: "size", mrp_price: 130, stock: 100 }, { name: "Round & Curl", type: "size", mrp_price: 240, stock: 100 }] },
  { name: "Makeup Brush Cleaner", category: "ACCESSORIES", has_variants: false, mrp_price: 160, image_name: "Hair Brush Flat.png" }, // Fallback image since we couldn't find cleaner exactly
  { name: "Makeup Brush Set MKB-01", category: "ACCESSORIES", has_variants: false, mrp_price: 120, image_name: "Hair Brush Flat.png" },
  { name: "Makeup Brush Set MKB-02", category: "ACCESSORIES", has_variants: false, mrp_price: 145, image_name: "Hair Brush Flat.png" },
  { name: "Makeup Brush Set MKB-03", category: "ACCESSORIES", has_variants: false, mrp_price: 205, image_name: "Hair Brush Flat.png" },
  { name: "Makeup Brush Set MKB-04", category: "ACCESSORIES", has_variants: false, mrp_price: 140, image_name: "Hair Brush Flat.png" },
  { name: "Makeup Brush Set MKB-05", category: "ACCESSORIES", has_variants: false, mrp_price: 175, image_name: "Hair Brush Flat.png" },
  { name: "Makeup Brush Set MKB-06", category: "ACCESSORIES", has_variants: false, mrp_price: 179, image_name: "Hair Brush Flat.png" },
  { name: "Makeup Brush Set MKB-07", category: "ACCESSORIES", has_variants: false, mrp_price: 145, image_name: "Hair Brush Flat.png" },
  { name: "Makeup Brush Set MKB-08", category: "ACCESSORIES", has_variants: false, mrp_price: 460, image_name: "Hair Brush Flat.png" },
  { name: "Makeup Brush Set MKB-09", category: "ACCESSORIES", has_variants: false, mrp_price: 345, image_name: "Hair Brush Flat.png" },
  { name: "Makeup Brush Set MKB-10", category: "ACCESSORIES", has_variants: false, mrp_price: 515, image_name: "Hair Brush Flat.png" },
  { name: "Makeup Brush Set MKB-11", category: "ACCESSORIES", has_variants: false, mrp_price: 570, image_name: "Hair Brush Flat.png" },
];

const BRAND_NAME = "Insight";
const DISCOUNT_RATE = 0.75; // 25% discount for Insight based on previous

const categoryImages = {
  'PRIMER': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400',
  'BLUSHER': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
  'CONCEALER': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400',
  'FOUNDATION': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400',
  'COMPACT': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400',
  'POWDER': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400',
  'HIGHLIGHTER': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
  'FIXERS & REMOVERS': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400',
  'SINDOOR': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
  'LIP LINER': 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
  'LIPSTICK': 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
  'LIP COLOR': 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
  'LIP GLOSS': 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
  'LIP BALM': 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
  'EYEBROW': 'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=400',
  'EYELINER': 'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=400',
  'EYESHADOW': 'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=400',
  'MASCARA & KAJAL': 'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=400',
  'ACCESSORIES': 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400'
};

async function seedInsight() {
  console.log(`Starting seed for ${BRAND_NAME}...`);

  try {
    // 1. Brand
    let { data: brand } = await supabase.from('brands').select('id').eq('name', BRAND_NAME).single();
    let brandId;
    if (!brand) {
      console.log(`Creating brand: ${BRAND_NAME}`);
      const { data: newBrand, error } = await supabase
        .from('brands')
        .insert({ name: BRAND_NAME, logo_url: "/brands/insight.png" })
        .select().single();
      if (error) throw error;
      brandId = newBrand.id;
    } else {
      brandId = brand.id;
      console.log(`Brand ${BRAND_NAME} already exists.`);
      // Optionally we could delete old products if starting fresh
      await supabase.from('products').delete().eq('brand_id', brandId);
      console.log('Cleared old products for Insight');
    }

    // 2. Products
    console.log('Inserting products...');
    for (const item of RAW_PRODUCT_LIST) {
      let baseSellingPrice = 0;
      let baseMrpPrice = 0;

      if (item.has_variants && item.variants?.length > 0) {
        const variantsData = item.variants.map(v => ({ ...v, selling_price: Math.round(v.mrp_price * DISCOUNT_RATE) }));
        const lowest = [...variantsData].sort((a, b) => a.selling_price - b.selling_price)[0];
        baseSellingPrice = lowest.selling_price;
        baseMrpPrice = lowest.mrp_price;
      } else {
        baseMrpPrice = item.mrp_price;
        baseSellingPrice = Math.round(baseMrpPrice * DISCOUNT_RATE);
      }

      const imageUrl = `/insight/${item.image_name}`;

      const { data: existing } = await supabase.from('products').select('id').eq('name', item.name).eq('brand_id', brandId).single();

      if (!existing) {
        const { error } = await supabase.from('products').insert({
          name: item.name,
          brand_id: brandId,
          category: item.category,
          has_variants: item.has_variants,
          mrp_price: baseMrpPrice,
          selling_price: baseSellingPrice,
          price: baseSellingPrice,
          original_price: baseMrpPrice,
          discount: 25,
          image_url: imageUrl
        });
        if (error) console.error(`Error inserting ${item.name}:`, error.message);
        else console.log(`✅ Inserted: ${item.name}`);
      }
    }

    // 3. Category settings
    console.log('Setting up category filters...');
    await supabase.from('category_settings').delete().eq('brand_id', brandId);
    await supabase.from('category_settings').insert(
      Object.keys(categoryImages).map(name => ({
        brand_id: brandId,
        name,
        image_url: categoryImages[name],
        is_active: true
      }))
    );

    // 4. Generate variant SQL (for RLS bypass)
    console.log('Generating variant SQL...');
    const { data: products } = await supabase.from('products').select('id, name').eq('brand_id', brandId);
    let sql = `-- INSERT PRODUCT VARIANTS FOR INSIGHT\n`;
    for (const item of RAW_PRODUCT_LIST) {
      if (!item.has_variants) continue;
      const product = products.find(p => p.name === item.name);
      if (!product) continue;
      for (const v of item.variants) {
        const sellingPrice = Math.round(v.mrp_price * DISCOUNT_RATE);
        // Delete old variants just in case
        sql += `DELETE FROM product_variants WHERE product_id = '${product.id}' AND name = '${v.name}';\n`;
        sql += `INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)\n`;
        sql += `VALUES ('${product.id}', '${v.name}', '${v.type}', ${v.mrp_price}, ${sellingPrice}, ${sellingPrice}, ${v.stock})\nON CONFLICT DO NOTHING;\n\n`;
      }
    }
    fs.writeFileSync(path.resolve(process.cwd(), 'scripts', 'insert_insight_variants.sql'), sql);

    console.log('\n✅ Insight seeded successfully!');
    console.log('👉 Now run scripts/insert_insight_variants.sql in your Supabase SQL Editor!');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

seedInsight();
