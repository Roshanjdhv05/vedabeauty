import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const RAW_PRODUCT_LIST = [
  // LOTUS HERBALS — WHITEGLOW RANGE
  {
    name: "Skin Whitening & Brightening Gel Crème SPF 25",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "15g", type: "size", mrp_price: 99, stock: 100 },
      { name: "35g", type: "size", mrp_price: 275, stock: 100 },
      { name: "60g", type: "size", mrp_price: 460, stock: 100 }
    ]
  },
  {
    name: "Skin Whitening & Brightening Nourishing Night Crème",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "15g", type: "size", mrp_price: 99, stock: 100 },
      { name: "40g", type: "size", mrp_price: 375, stock: 100 },
      { name: "60g", type: "size", mrp_price: 495, stock: 100 }
    ]
  },
  {
    name: "Skin Whitening & Brightening Deep Moisturising Crème SPF 20",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "40g", type: "size", mrp_price: 295, stock: 100 },
      { name: "60g", type: "size", mrp_price: 430, stock: 100 }
    ]
  },
  { name: "Skin Whitening & Brightening Massage Crème 60g", category: "FACE", has_variants: false, mrp_price: 480 },
  {
    name: "3 in 1 Deep Cleansing Skin Whitening Facial Foam",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 185, stock: 100 },
      { name: "100g", type: "size", mrp_price: 295, stock: 100 }
    ]
  },
  { name: "Intensive Skin Whitening & Brightening Serum + Moisturizer 30ml", category: "FACE", has_variants: false, mrp_price: 490 },
  {
    name: "Active Skin Whitening+ Oil Control Face Wash",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 190, stock: 100 },
      { name: "100g", type: "size", mrp_price: 295, stock: 100 }
    ]
  },
  {
    name: "Oatmeal & Yogurt Skin Whitening Scrub",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 199, stock: 100 },
      { name: "100g", type: "size", mrp_price: 325, stock: 100 }
    ]
  },
  { name: "Yogurt Skin Whitening & Brightening Masque 80g", category: "FACE", has_variants: false, mrp_price: 290 },
  { name: "Skin Whitening & Brightening Cleansing Milk 80ml", category: "FACE", has_variants: false, mrp_price: 325 },
  { name: "Skin Whitening & Brightening Hand & Body Lotion SPF 25 270ml", category: "FACE", has_variants: false, mrp_price: 385 },
  { name: "Insta Glow Fairness Kit", category: "FACIAL KITS", has_variants: false, mrp_price: 945 },
  { name: "Flawless Complexion Compact 10g", category: "FACE", has_variants: false, mrp_price: 260 },

  // WhiteGlow Vitamin-C Range
  {
    name: "Vitamin-C + Gold Radiance Serum",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "15ml", type: "volume", mrp_price: 295, stock: 100 },
      { name: "30ml", type: "volume", mrp_price: 555, stock: 100 }
    ]
  },
  {
    name: "Vitamin-C Radiance Face Wash",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "15g", type: "size", mrp_price: 165, stock: 100 },
      { name: "100g", type: "size", mrp_price: 280, stock: 100 }
    ]
  },
  {
    name: "Vitamin-C Radiance Gel Crème",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "15g", type: "size", mrp_price: 99, stock: 100 },
      { name: "35g", type: "size", mrp_price: 295, stock: 100 },
      { name: "50g", type: "size", mrp_price: 475, stock: 100 }
    ]
  },
  {
    name: "Vitamin-C Radiance Crème SPF-20",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "18g", type: "size", mrp_price: 99, stock: 100 },
      { name: "35g", type: "size", mrp_price: 295, stock: 100 }
    ]
  },
  { name: "Vitamin-C Hand & Body Lotion 270ml", category: "FACE", has_variants: false, mrp_price: 375 },
  { name: "Vitamin-C+ Radiance Face Oil 15ml", category: "FACE", has_variants: false, mrp_price: 445 },
  { name: "Vitamin-C Radiance Face Masque 100g", category: "FACE", has_variants: false, mrp_price: 345 },
  { name: "Vitamin-C Radiance Exfoliator 100g", category: "FACE", has_variants: false, mrp_price: 345 },
  { name: "Vitamin-C + Gold 4in1 Facial Kit", category: "FACIAL KITS", has_variants: false, mrp_price: 3910 },

  // WhiteGlow Advanced Pink Glow Range
  {
    name: "Advanced Pink Glow Crème",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "18g", type: "size", mrp_price: 125, stock: 100 },
      { name: "35g", type: "size", mrp_price: 325, stock: 100 },
      { name: "50g", type: "size", mrp_price: 465, stock: 100 }
    ]
  },
  { name: "Advanced Pink Glow Night Crème 50g", category: "FACE", has_variants: false, mrp_price: 475 },
  {
    name: "Advanced Pink Glow Facewash",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 165, stock: 100 },
      { name: "100g", type: "size", mrp_price: 285, stock: 100 }
    ]
  },
  { name: "Advanced Pink Glow Serum 30ml", category: "FACE", has_variants: false, mrp_price: 510 },
  { name: "Advanced Pink Glow Masque 100ml", category: "FACE", has_variants: false, mrp_price: 299 },
  { name: "Advanced Pink Glow Exfoliator 100g", category: "FACE", has_variants: false, mrp_price: 275 },

  // YOUTHRX RANGE
  { name: "Firm & Bright Power Combo 15ml", category: "FACE", has_variants: false, mrp_price: 1580 },
  {
    name: "Firm & Bright Crème SPF-20 PA+++",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "10g", type: "size", mrp_price: 170, stock: 100 },
      { name: "50g", type: "size", mrp_price: 795, stock: 100 }
    ]
  },
  {
    name: "Firm & Bright Night Crème",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "10g", type: "size", mrp_price: 180, stock: 100 },
      { name: "50g", type: "size", mrp_price: 825, stock: 100 }
    ]
  },
  { name: "Firm & Bright Face Oil 15ml", category: "FACE", has_variants: false, mrp_price: 775 },
  { name: "Firm & Bright Face Wash 100ml", category: "FACE", has_variants: false, mrp_price: 395 },
  { name: "Firm & Bright Serum 30ml", category: "FACE", has_variants: false, mrp_price: 885 },

  // Anti-Ageing Range
  {
    name: "Anti Ageing Transforming Crème",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "10g", type: "size", mrp_price: 165, stock: 100 },
      { name: "30g", type: "size", mrp_price: 395, stock: 100 },
      { name: "50g", type: "size", mrp_price: 785, stock: 100 }
    ]
  },
  { name: "Anti Ageing Transforming Gel Crème SPF 20 P+++ 50g", category: "FACE", has_variants: false, mrp_price: 645 },
  {
    name: "Anti Ageing Nourishing Night Crème",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "10g", type: "size", mrp_price: 165, stock: 100 },
      { name: "30g", type: "size", mrp_price: 425, stock: 100 },
      { name: "50g", type: "size", mrp_price: 825, stock: 100 }
    ]
  },
  { name: "Ph. Balancing Multi Active Toner 100ml", category: "CLEANSER & TONER", has_variants: false, mrp_price: 410 },
  {
    name: "Active Anti Ageing Foaming Gel",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 185, stock: 100 },
      { name: "100g", type: "size", mrp_price: 335, stock: 100 }
    ]
  },
  { name: "Activating Serum + Crème 30ml", category: "FACE", has_variants: false, mrp_price: 895 },
  { name: "Anti Ageing Firming Face Masque 80g", category: "FACE", has_variants: false, mrp_price: 375 },
  { name: "Active Anti Ageing Exfoliator 100g", category: "FACE", has_variants: false, mrp_price: 395 },
  { name: "Anti Ageing Eye Contour Crème 15ml", category: "FACE", has_variants: false, mrp_price: 525 },
  { name: "Forever Young Regimen Kit", category: "FACIAL KITS", has_variants: false, mrp_price: 840 },
  { name: "YOUTHRX Essential Kit", category: "FACIAL KITS", has_variants: false, mrp_price: 895 },

  // SAFESUN RANGE
  { name: "UltraRx Matte Sunscreen SPF 50+ PA++++ 50g", category: "SUNSCREEN", has_variants: false, mrp_price: 475 },
  {
    name: "UltraRx Sunscreen Serum SPF 60+ PA++++",
    category: "SUNSCREEN",
    has_variants: true,
    variants: [
      { name: "30ml", type: "volume", mrp_price: 345, stock: 100 },
      { name: "50ml", type: "volume", mrp_price: 575, stock: 100 },
      { name: "75ml", type: "volume", mrp_price: 795, stock: 100 }
    ]
  },
  {
    name: "Sunscreen Cream PA+ SPF 20",
    category: "SUNSCREEN",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 225, stock: 100 },
      { name: "100g", type: "size", mrp_price: 350, stock: 100 }
    ]
  },
  {
    name: "Sunscreen Cream PA++ SPF 30",
    category: "SUNSCREEN",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 325, stock: 100 },
      { name: "100g", type: "size", mrp_price: 455, stock: 100 }
    ]
  },
  {
    name: "Kids Sunblock Cream SPF 25",
    category: "SUNSCREEN",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 275, stock: 100 },
      { name: "100g", type: "size", mrp_price: 430, stock: 100 }
    ]
  },
  { name: "Skin Lightening Anti-Tan Sunblock PA+++ SPF 30 50g", category: "SUNSCREEN", has_variants: false, mrp_price: 285 },
  { name: "Kids Soft-Touch Sunscreen PA+++ SPF 40 80g", category: "SUNSCREEN", has_variants: false, mrp_price: 430 },
  {
    name: "3-in-1 Matte Look Daily Sunscreen PA+++ SPF 40",
    category: "SUNSCREEN",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 375, stock: 100 },
      { name: "75g", type: "size", mrp_price: 435, stock: 100 },
      { name: "100g", type: "size", mrp_price: 555, stock: 100 }
    ]
  },
  { name: "Silk Touch Mattifying UV Crème PA+++ SPF 50 75g", category: "SUNSCREEN", has_variants: false, mrp_price: 590 },
  {
    name: "UV Screen MatteGel PA+++ SPF 50",
    category: "SUNSCREEN",
    has_variants: true,
    variants: [
      { name: "15g", type: "size", mrp_price: 99, stock: 100 },
      { name: "30g", type: "size", mrp_price: 225, stock: 100 },
      { name: "50g", type: "size", mrp_price: 435, stock: 100 },
      { name: "100g", type: "size", mrp_price: 585, stock: 100 }
    ]
  },
  { name: "Daily Multi-Function Sunscreen PA+++ SPF 50+ 60g", category: "SUNSCREEN", has_variants: false, mrp_price: 635 },
  {
    name: "Sunscreen Vitamin C Matte Gel SPF-50",
    category: "SUNSCREEN",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 365, stock: 100 },
      { name: "75g", type: "size", mrp_price: 535, stock: 100 },
      { name: "100g", type: "size", mrp_price: 595, stock: 100 }
    ]
  },
  {
    name: "Sports Daily-Defence UV Block PA+++ SPF 50+",
    category: "SUNSCREEN",
    has_variants: true,
    variants: [
      { name: "40g", type: "size", mrp_price: 345, stock: 100 },
      { name: "80g", type: "size", mrp_price: 635, stock: 100 }
    ]
  },
  {
    name: "Sports Super-Stay Sunblock PA+++ SPF 70",
    category: "SUNSCREEN",
    has_variants: true,
    variants: [
      { name: "40g", type: "size", mrp_price: 375, stock: 100 },
      { name: "80g", type: "size", mrp_price: 680, stock: 100 }
    ]
  },
  { name: "Daily Multi-Function Sunblock PA+++ SPF 70 60g", category: "SUNSCREEN", has_variants: false, mrp_price: 745 },
  { name: "Ultra-Protect Sunblock PA+++ SPF 100 50g", category: "SUNSCREEN", has_variants: false, mrp_price: 885 },
  { name: "DeTAN After-Sun Cooling Matte Gel 100g", category: "SUNSCREEN", has_variants: false, mrp_price: 445 },
  { name: "ANTI-TAN Whitening & Glow Facial Kit", category: "FACIAL KITS", has_variants: false, mrp_price: 995 },
  { name: "Advanced Daily UV Shield Men SPF30 100g", category: "SUNSCREEN", has_variants: false, mrp_price: 475 },
  { name: "DeTan After-Sun Face Pack 100g", category: "FACE", has_variants: false, mrp_price: 385 },
  { name: "DeTan After-Sun Face Scrub 100g", category: "FACE", has_variants: false, mrp_price: 370 },
  { name: "DeTan After-Sun Face Wash Gel 100g", category: "FACE", has_variants: false, mrp_price: 250 },
  { name: "UV-Protect Body Lotion PA+++ SPF 25+ 250ml", category: "SUNSCREEN", has_variants: false, mrp_price: 345 },
  { name: "Anti-Tan Body Lotion PA+++ SPF 25 250ml", category: "SUNSCREEN", has_variants: false, mrp_price: 345 },
  {
    name: "Sports Pro-Defence Sunblock PA+++ SPF 100+",
    category: "SUNSCREEN",
    has_variants: true,
    variants: [
      { name: "40g", type: "size", mrp_price: 425, stock: 100 },
      { name: "80g", type: "size", mrp_price: 795, stock: 100 }
    ]
  },

  // UBTAN RANGE
  {
    name: "Radiance Boost Ubtan Facewash",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 165, stock: 100 },
      { name: "100g", type: "size", mrp_price: 280, stock: 100 }
    ]
  },
  { name: "Radiance Boost Ubtan Face Scrub 100g", category: "FACE", has_variants: false, mrp_price: 295 },
  { name: "Radiance Boost Ubtan Face Serum 30ml", category: "FACE", has_variants: false, mrp_price: 475 },
  { name: "Radiance Boost Ubtan Face Crème SPF20 PA+++ 50g", category: "FACE", has_variants: false, mrp_price: 395 },
  { name: "Radiance Boost Ubtan Face Mask 100g", category: "FACE", has_variants: false, mrp_price: 395 },
  { name: "Radiance Boost Ubtan Gold 4in1 Facial Kit", category: "FACIAL KITS", has_variants: false, mrp_price: 925 },

  // ACTIVE ALOE RANGE
  { name: "Active Aloe+Niacinamide Brightening Face Wash 100g", category: "FACE", has_variants: false, mrp_price: 295 },
  { name: "Active Aloe+Niacinamide Brightening Scrub 100g", category: "FACE", has_variants: false, mrp_price: 295 },
  { name: "Active Aloe+Niacinamide Brightening Boost Serum 30ml", category: "FACE", has_variants: false, mrp_price: 475 },
  { name: "Active Aloe+Niacinamide Brightening Boost Mist 50ml", category: "FACE", has_variants: false, mrp_price: 395 },
  { name: "Active Aloe+Niacinamide Brightening Boost Night Gel 50g", category: "FACE", has_variants: false, mrp_price: 395 },
  { name: "Active Aloe+Niacinamide Brightening Boost Gel 50g", category: "FACE", has_variants: false, mrp_price: 445 },

  // FACIAL KITS
  {
    name: "Radiant GOLD Cellular Glow Facial Kit",
    category: "FACIAL KITS",
    has_variants: true,
    variants: [
      { name: "Single", type: "size", mrp_price: 350, stock: 100 },
      { name: "4IN1", type: "size", mrp_price: 1215, stock: 100 },
      { name: "Largest", type: "size", mrp_price: 1385, stock: 100 }
    ]
  },
  {
    name: "Radiant PEARL Cellular Lightening Facial Kit",
    category: "FACIAL KITS",
    has_variants: true,
    variants: [
      { name: "Single", type: "size", mrp_price: 310, stock: 100 },
      { name: "4IN1", type: "size", mrp_price: 1095, stock: 100 },
      { name: "Largest", type: "size", mrp_price: 1090, stock: 100 }
    ]
  },
  {
    name: "Radiant DIAMOND Cellular Radiance Facial Kit",
    category: "FACIAL KITS",
    has_variants: true,
    variants: [
      { name: "Single", type: "size", mrp_price: 390, stock: 100 },
      { name: "4IN1", type: "size", mrp_price: 1405, stock: 100 },
      { name: "Largest", type: "size", mrp_price: 1575, stock: 100 }
    ]
  },
  {
    name: "Radiant PLATINUM Anti-Ageing Facial Kit",
    category: "FACIAL KITS",
    has_variants: true,
    variants: [
      { name: "Single", type: "size", mrp_price: 405, stock: 100 },
      { name: "4IN1", type: "size", mrp_price: 1425, stock: 100 },
      { name: "Largest", type: "size", mrp_price: 1675, stock: 100 }
    ]
  },
  {
    name: "Radiant BridalGLOW Facial Kit",
    category: "FACIAL KITS",
    has_variants: true,
    variants: [
      { name: "Single", type: "size", mrp_price: 435, stock: 100 },
      { name: "4IN1", type: "size", mrp_price: 1500, stock: 100 }
    ]
  },
  { name: "Radiant PartyGLOW 4IN1 Facial Kit", category: "FACIAL KITS", has_variants: false, mrp_price: 1420 },
  { name: "PapayaGLOW 4IN1 Facial Kit", category: "FACIAL KITS", has_variants: false, mrp_price: 1195 },
  { name: "NaturalGLOW Skin Radiance Facial Kit 4IN1", category: "FACIAL KITS", has_variants: false, mrp_price: 364 },

  // FACE WASH RANGE
  {
    name: "JOJOBAWASH Face Wash",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "80g", type: "size", mrp_price: 190, stock: 100 },
      { name: "120g", type: "size", mrp_price: 255, stock: 100 }
    ]
  },
  {
    name: "TEATREEWASH Face Wash",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "80g", type: "size", mrp_price: 190, stock: 100 },
      { name: "120g", type: "size", mrp_price: 290, stock: 100 }
    ]
  },
  {
    name: "NEEMWASH Face Wash",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "80g", type: "size", mrp_price: 190, stock: 100 },
      { name: "120g", type: "size", mrp_price: 255, stock: 100 }
    ]
  },
  {
    name: "BERRYSCRUB Face Wash",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "80g", type: "size", mrp_price: 190, stock: 100 },
      { name: "120g", type: "size", mrp_price: 255, stock: 100 }
    ]
  },

  // CLEANSER & TONER RANGE
  {
    name: "LEMONPURE Cleansing Milk",
    category: "CLEANSER & TONER",
    has_variants: true,
    variants: [
      { name: "80ml", type: "volume", mrp_price: 295, stock: 100 },
      { name: "170ml", type: "volume", mrp_price: 390, stock: 100 }
    ]
  },
  { name: "BASILTONE Toner 100ml", category: "CLEANSER & TONER", has_variants: false, mrp_price: 345 },
  { name: "ROSETONE Toner 100ml", category: "CLEANSER & TONER", has_variants: false, mrp_price: 345 },
  {
    name: "COCOMOIST Moisturising Lotion",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "80ml", type: "volume", mrp_price: 325, stock: 100 },
      { name: "170ml", type: "volume", mrp_price: 435, stock: 100 }
    ]
  },

  // MOISTURISER & CRÈME RANGE
  {
    name: "SHEAMOIST Moisturiser",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "60g", type: "size", mrp_price: 270, stock: 100 },
      { name: "120g", type: "size", mrp_price: 395, stock: 100 }
    ]
  },
  { name: "NUTRANITE Night Crème 50g", category: "FACE", has_variants: false, mrp_price: 485 },
  {
    name: "ALPHAMOIST Oil Free Moisturiser",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "80ml", type: "volume", mrp_price: 335, stock: 100 },
      { name: "170ml", type: "volume", mrp_price: 435, stock: 100 }
    ]
  },
  { name: "NUTRAMOIST Moisturising Creme 50g", category: "FACE", has_variants: false, mrp_price: 485 },
  {
    name: "QUINCENOURISH Creme",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 415, stock: 100 },
      { name: "250g", type: "size", mrp_price: 885, stock: 100 }
    ]
  },
  {
    name: "WHEATNOURISH Creme",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 415, stock: 100 },
      { name: "250g", type: "size", mrp_price: 885, stock: 100 }
    ]
  },
  {
    name: "PAPAYABLEM Creme",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "50g", type: "size", mrp_price: 485, stock: 100 },
      { name: "250g", type: "size", mrp_price: 945, stock: 100 }
    ]
  },
  { name: "ALMONDYOUTH Creme 50g", category: "FACE", has_variants: false, mrp_price: 485 },

  // FACE PACK & SCRUB RANGE
  {
    name: "CLAYWHITE Face Pack",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "60g", type: "size", mrp_price: 220, stock: 100 },
      { name: "120g", type: "size", mrp_price: 375, stock: 100 },
      { name: "350g", type: "size", mrp_price: 665, stock: 100 }
    ]
  },
  {
    name: "FRUJUVENATE Face Pack",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "60g", type: "size", mrp_price: 220, stock: 100 },
      { name: "120g", type: "size", mrp_price: 375, stock: 100 },
      { name: "350g", type: "size", mrp_price: 665, stock: 100 }
    ]
  },
  {
    name: "TEATREECLEAR Face Pack",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "60g", type: "size", mrp_price: 220, stock: 100 },
      { name: "120g", type: "size", mrp_price: 375, stock: 100 }
    ]
  },
  {
    name: "APRISCRUB",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "60g", type: "size", mrp_price: 115, stock: 100 },
      { name: "100g", type: "size", mrp_price: 265, stock: 100 },
      { name: "180g", type: "size", mrp_price: 395, stock: 100 },
      { name: "270g", type: "size", mrp_price: 645, stock: 100 }
    ]
  },

  // LIP CARE RANGE
  { name: "Lip Therapy (Velvety Rose / Cherry / Vanilla) 3.4g", category: "LIPS", has_variants: false, mrp_price: 199 },
  { name: "Lip Balms (Strawberry / Fruity Fusion / Raspberry) 5g", category: "LIPS", has_variants: false, mrp_price: 199 },

  // SOAP & HAIR CARE
  { name: "LICORICEWHITE Ayurvedic Cleansing Bar 100g", category: "FACE", has_variants: false, mrp_price: 95 },
  { name: "KERA-VEDA Neem & Reetha Anti-Dandruff Shampoo 150ml", category: "HAIR CARE", has_variants: false, mrp_price: 285 },
  { name: "KERA-VEDA Amlapura Shampoo 200ml", category: "HAIR CARE", has_variants: false, mrp_price: 295 },
  { name: "KERA-VEDA Neemactiv Shampoo 200ml", category: "HAIR CARE", has_variants: false, mrp_price: 295 },
  { name: "KERA-VEDA Soyashine Shampoo 200ml", category: "HAIR CARE", has_variants: false, mrp_price: 295 },
  { name: "KERA-VEDA Soyasmooth Conditioner 150g", category: "HAIR CARE", has_variants: false, mrp_price: 295 },

  // DERMA BOTANICS RANGE
  { name: "Kojic Acid + Multi Berry Blemish Facewash 100g", category: "FACE", has_variants: false, mrp_price: 345 },
  { name: "Kojic Acid + Multi Berry Serum 28ml", category: "FACE", has_variants: false, mrp_price: 595 },
  { name: "Kojic Acid + Multi Berry Ampoule Crème 50g", category: "FACE", has_variants: false, mrp_price: 495 },
  { name: "Deep Hydra Serum (Peptide + Papaya) 28ml", category: "FACE", has_variants: false, mrp_price: 645 },
  { name: "Deep Hydra Crème (Peptide + Papaya) 50g", category: "FACE", has_variants: false, mrp_price: 495 },
  { name: "UV Bright Sunscreen SPF 60+ 40g", category: "SUNSCREEN", has_variants: false, mrp_price: 475 },
  { name: "UV Aqua Sunscreen Spray SPF 50+ 50ml", category: "SUNSCREEN", has_variants: false, mrp_price: 525 }
];

const BRAND_NAME = "Lotus";
const DISCOUNT_RATE = 0.80; // 20% discount

const categoryImages = {
  'FACE': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=400&q=80',
  'SUNSCREEN': 'https://images.unsplash.com/photo-1521223618406-f878ce82881d?w=400&q=80',
  'FACIAL KITS': 'https://images.unsplash.com/photo-1570172619667-172906e00155?w=400&q=80',
  'CLEANSER & TONER': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&q=80',
  'LIPS': 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=400&q=80',
  'HAIR CARE': 'https://images.unsplash.com/photo-1527799822344-429dfa855dd7?w=400&q=80'
};

async function seedLotus() {
  console.log(`Starting seed for ${BRAND_NAME}...`);

  try {
    // 1. Brand
    let { data: brand } = await supabase.from('brands').select('id').eq('name', BRAND_NAME).single();
    let brandId;
    if (!brand) {
      console.log(`Creating brand: ${BRAND_NAME}`);
      const { data: newBrand, error } = await supabase
        .from('brands')
        .insert({ name: BRAND_NAME, logo_url: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=200&q=80" })
        .select().single();
      if (error) throw error;
      brandId = newBrand.id;
    } else {
      brandId = brand.id;
      console.log(`Brand ${BRAND_NAME} already exists.`);
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
          discount: 20,
          image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800'
        });
        if (error) console.error(`Error inserting ${item.name}:`, error.message);
        else console.log(`✅ Inserted: ${item.name}`);
      } else {
        await supabase.from('products').update({
          category: item.category,
          has_variants: item.has_variants,
          mrp_price: baseMrpPrice,
          selling_price: baseSellingPrice,
          price: baseSellingPrice,
          original_price: baseMrpPrice,
          discount: 20
        }).eq('id', existing.id);
        console.log(`🔄 Updated: ${item.name}`);
      }
    }

    // 3. Category settings
    console.log('Setting up category filters...');
    // We don't delete to avoid affecting other brands if they share categories, 
    // but here we just ensure Lotus has its entries.
    for (const name of Object.keys(categoryImages)) {
      const { data: existingCat } = await supabase.from('category_settings').select('id').eq('brand_id', brandId).eq('name', name).single();
      if (!existingCat) {
        await supabase.from('category_settings').insert({
          brand_id: brandId,
          name,
          image_url: categoryImages[name],
          is_active: true
        });
      }
    }

    // 4. Generate variant SQL (for RLS bypass)
    console.log('Generating variant SQL...');
    const { data: products } = await supabase.from('products').select('id, name').eq('brand_id', brandId);
    let sql = `-- INSERT PRODUCT VARIANTS FOR LOTUS\n`;
    for (const item of RAW_PRODUCT_LIST) {
      if (!item.has_variants) continue;
      const product = products.find(p => p.name === item.name);
      if (!product) continue;
      for (const v of item.variants) {
        const sellingPrice = Math.round(v.mrp_price * DISCOUNT_RATE);
        sql += `INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock)\n`;
        sql += `VALUES ('${product.id}', '${v.name}', '${v.type}', ${v.mrp_price}, ${sellingPrice}, ${sellingPrice}, ${v.stock})\nON CONFLICT DO NOTHING;\n\n`;
      }
    }
    fs.writeFileSync(path.resolve(process.cwd(), 'scripts', 'insert_lotus_variants.sql'), sql);

    console.log('\n✅ Lotus seeded successfully!');
    console.log('👉 Now run scripts/insert_lotus_variants.sql in your Supabase SQL Editor!');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

seedLotus();
