import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser for scripts
const envPath = path.resolve(process.cwd(), '.env');
const env = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
  const [key, value] = line.split('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const MARS_PRODUCTS = [
  // LIPS
  { name: "Lipstick Pencil", originalPrice: 599, category: "Lips" },
  { name: "Lip Crayon", originalPrice: 279, category: "Lips" },
  { name: "Plush Velvet Lipstick", originalPrice: 199, category: "Lips" },
  { name: "Creamy Matte Lipstick", originalPrice: 199, category: "Lips" },
  { name: "3 Matte Box", originalPrice: 447, category: "Lips" },
  { name: "Cloud Kiss Lipstick", originalPrice: 499, category: "Lips" },
  { name: "Edge of Desire Lip Liner", originalPrice: 69, category: "Lips" },
  { name: "Edge of Desire Lip Liner-Holder (10 pcs)", originalPrice: 790, category: "Lips" },
  { name: "Drip Lip Mist", originalPrice: 299, category: "Lips" },
  { name: "Infinity Lip Palette", originalPrice: 379, category: "Lips" },
  { name: "Love Track", originalPrice: 299, category: "Lips" },
  { name: "Non Transfer Butter Stick", originalPrice: 549, category: "Lips" },
  { name: "Silk Matte Lipstick", originalPrice: 279, category: "Lips" },
  { name: "Poppins Lip Crayon", originalPrice: 329, category: "Lips" },
  { name: "Super Stay Lipstick", originalPrice: 279, category: "Lips" },
  { name: "Cinemagic Non Transfer Lip Gloss", originalPrice: 399, category: "Lips" },
  { name: "Colorbum Liquid Lipstick", originalPrice: 229, category: "Lips" },
  { name: "Matte Lip Color", originalPrice: 249, category: "Lips" },
  { name: "Popstar Liquid Mousse Lipstick", originalPrice: 249, category: "Lips" },
  { name: "Matte Muse Lipstick", originalPrice: 299, category: "Lips" },
  { name: "Queen of Mattes", originalPrice: 499, category: "Lips" },
  { name: "Lip Lollies Lip Balm", originalPrice: 229, category: "Lips" },
  { name: "Hydratint Balm", originalPrice: 229, category: "Lips" },
  { name: "Full of Water Lip Balm", originalPrice: 89, category: "Lips" },
  { name: "Aqua Splash Lip Balm", originalPrice: 149, category: "Lips" },
  { name: "Click-Stick Gloss Lip Balm", originalPrice: 349, category: "Lips" },
  { name: "Lippy Top Lip Gel", originalPrice: 199, category: "Lips" },
  { name: "Clear Quartz Lip Gloss", originalPrice: 199, category: "Lips" },
  { name: "Candylocious Lip Gloss", originalPrice: 249, category: "Lips" },
  { name: "Color Changing Lip Oil", originalPrice: 249, category: "Lips" },

  // EYES
  { name: "Micro Precision Brow Pencil", originalPrice: 149, category: "Eyes" },
  { name: "Oh Brow Eyebrow Pencil", originalPrice: 229, category: "Eyes" },
  { name: "Eyebrow Powder", originalPrice: 249, category: "Eyes" },
  { name: "Brow Better Eyebrow Pencil", originalPrice: 69, category: "Eyes" },
  { name: "Eyebrow Pencil", originalPrice: 59, category: "Eyes" },
  { name: "#Eyegotthis Liquid Eyeliner", originalPrice: 199, category: "Eyes" },
  { name: "Pen Eyeliner", originalPrice: 249, category: "Eyes" },
  { name: "Free Flow Eyeliner", originalPrice: 229, category: "Eyes" },
  { name: "Hyper Smooth Eyeliner", originalPrice: 199, category: "Eyes" },
  { name: "Ink Black Eyeliner", originalPrice: 279, category: "Eyes" },
  { name: "So Black Liquid Eyeliner", originalPrice: 149, category: "Eyes" },
  { name: "Sky Liner Liquid Matte Eyeliner", originalPrice: 199, category: "Eyes" },
  { name: "City Strokes Liquid Eyeliner", originalPrice: 179, category: "Eyes" },
  { name: "Social Black Eyeliner with Brush Tip", originalPrice: 199, category: "Eyes" },
  { name: "Twinkle Wink Glitter Eyeliner", originalPrice: 249, category: "Eyes" },
  { name: "Northern Lights Pencil Eyeliner", originalPrice: 399, category: "Eyes" },
  { name: "Northern Liquid Eyeliner", originalPrice: 499, category: "Eyes" },
  { name: "Eye Love Multi Pods", originalPrice: 329, category: "Eyes" },
  { name: "Hue Gel Eyeliner", originalPrice: 329, category: "Eyes" },
  { name: "Fabulash Mascara", originalPrice: 249, category: "Eyes" },
  { name: "Forget Falsies Mascara", originalPrice: 279, category: "Eyes" },
  { name: "Silk Lengthening Mascara", originalPrice: 249, category: "Eyes" },
  { name: "Double Trouble Mascara", originalPrice: 299, category: "Eyes" },
  { name: "Kohl of Fame Kajal", originalPrice: 149, category: "Eyes" },
  { name: "Wswb Kajal", originalPrice: 229, category: "Eyes" },
  { name: "Ziddi Kajal", originalPrice: 279, category: "Eyes" },
  { name: "Wswb Smooth Glide Kajal", originalPrice: 299, category: "Eyes" },
  { name: "Glitter Liquid Eyeshadow", originalPrice: 279, category: "Eyes" },
  { name: "Northern Lights Liquid Eyeshadow", originalPrice: 599, category: "Eyes" },
  { name: "Northern Lights in a Pan", originalPrice: 499, category: "Eyes" },
  { name: "Starlit Pot", originalPrice: 399, category: "Eyes" },
  { name: "Back to Basics Palette", originalPrice: 299, category: "Eyes" },
  { name: "Blooming Eyeshadow Palette", originalPrice: 399, category: "Eyes" },
  { name: "Mesmereyes Eyeshadow Palette", originalPrice: 399, category: "Eyes" },
  { name: "Dance of Joy Eyeshadow Palette", originalPrice: 299, category: "Eyes" },
  { name: "Glitter Palette", originalPrice: 349, category: "Eyes" },
  { name: "Fantasy 15 Eyeshadow Palette", originalPrice: 449, category: "Eyes" },
  { name: "36 Color Eyeshadow Palette", originalPrice: 949, category: "Eyes" },
  { name: "Artist’s Arsenal Eyeshadow Palette", originalPrice: 949, category: "Eyes" },
  { name: "Eyes Can Kill Eyeshadow Palette", originalPrice: 1499, category: "Eyes" },
  { name: "Sitara Metallic Eyeshadow Palette", originalPrice: 949, category: "Eyes" },
  { name: "All I Need Makeup Kit", originalPrice: 399, category: "Eyes" },

  // FACE KITS
  { name: "City Paradise Makeup Kit - Delhi", originalPrice: 499, category: "Kits" },
  { name: "City Paradise Makeup Kit - Mumbai", originalPrice: 499, category: "Kits" },
  { name: "City Paradise Makeup Kit - Kolkata", originalPrice: 499, category: "Kits" },
  { name: "City Paradise Makeup Kit - Chandigarh", originalPrice: 499, category: "Kits" },
  { name: "City Paradise Makeup Kit - Bangalore", originalPrice: 499, category: "Kits" },
  { name: "City Paradise Makeup Kit - Lucknow", originalPrice: 499, category: "Kits" },
  { name: "City Paradise Makeup Kit - Ahmedabad", originalPrice: 499, category: "Kits" },
  { name: "City Paradise Makeup Kit - Jaipur", originalPrice: 499, category: "Kits" },
  { name: "Poco Makeup", originalPrice: 349, category: "Kits" },
  { name: "Makeup Kit", originalPrice: 799, category: "Kits" },
  { name: "Trio Treat", originalPrice: 649, category: "Kits" },

  // FACE
  { name: "Pore Cure Primer", originalPrice: 329, category: "Face" },
  { name: "It’s Glow O’Clock Primer", originalPrice: 399, category: "Face" },
  { name: "Hydra Glow Primer", originalPrice: 349, category: "Face" },
  { name: "Face Primer", originalPrice: 399, category: "Face" },
  { name: "Take a Glow Primer", originalPrice: 449, category: "Face" },
  { name: "Zero Pore Perfection Primer", originalPrice: 249, category: "Face" },
  { name: "Face Primer & Makeup Fixer", originalPrice: 449, category: "Face" },
  { name: "Bloom BB Cream", originalPrice: 249, category: "Face" },
  { name: "BB Cream", originalPrice: 339, category: "Face" },
  { name: "Miracle BB Foundation", originalPrice: 429, category: "Face" },
  { name: "Matte Mousse Foundation", originalPrice: 429, category: "Face" },
  { name: "2 in 1 Super Stay Foundation", originalPrice: 429, category: "Face" },
  { name: "The Gold Waves Foundation", originalPrice: 319, category: "Face" },
  { name: "Matte Maniac Foundation", originalPrice: 299, category: "Face" },
  { name: "BB Cream Foundation", originalPrice: 429, category: "Face" },
  { name: "High Coverage Foundation", originalPrice: 379, category: "Face" },
  { name: "Mist Foundation", originalPrice: 429, category: "Face" },
  { name: "Artistry Liquid Foundation", originalPrice: 899, category: "Face" },
  { name: "God’s Glow Illuminator", originalPrice: 899, category: "Face" },
  { name: "Zero Blend Foundation", originalPrice: 449, category: "Face" },
  { name: "Cancel Liquid Concealer", originalPrice: 249, category: "Face" },
  { name: "Color Changing Foundation", originalPrice: 499, category: "Face" },
  { name: "Wonder Cover", originalPrice: 199, category: "Face" },
  { name: "Cover Rangers", originalPrice: 599, category: "Face" },
  { name: "Fantasy Face Palette", originalPrice: 349, category: "Face" },
  { name: "Contour Palette", originalPrice: 429, category: "Face" },
  { name: "Glowzilla Face Palette", originalPrice: 329, category: "Face" },
  { name: "Glow Fly Liquid Highlighter", originalPrice: 399, category: "Face" },
  { name: "Illuminati Base", originalPrice: 329, category: "Face" },
  { name: "Flush of Love Blush", originalPrice: 299, category: "Face" },
  { name: "Dark Magic Blush", originalPrice: 299, category: "Face" },
  { name: "Blush Hour Liquid Blush", originalPrice: 299, category: "Face" },
  { name: "Sugar Rush Liquid Blusher", originalPrice: 279, category: "Face" },
  { name: "Lip & Cheek Tint", originalPrice: 299, category: "Face" },
  { name: "Rivaaz Sindoor", originalPrice: 129, category: "Face" },
  { name: "Mistique BB Powder", originalPrice: 310, category: "Face" },
  { name: "Silky Skin Powder", originalPrice: 310, category: "Face" },
  { name: "Born to Bake Setting Powder", originalPrice: 399, category: "Face" },
  { name: "Zero Oil Compact", originalPrice: 310, category: "Face" },
  { name: "Wonder Powder", originalPrice: 355, category: "Face" },
  { name: "Seal the Deal Makeup Fixer", originalPrice: 299, category: "Face" },
  { name: "Makeup Fixer Spray", originalPrice: 349, category: "Face" },

  // NAILS
  { name: "Color Bomb Nail Paint", originalPrice: 59, category: "Nails" },
  { name: "Euro Nails Paint", originalPrice: 69, category: "Nails" },
  { name: "Cosmic Hues Paint", originalPrice: 99, category: "Nails" },

  // REMOVERS & WIPES
  { name: "Mr Remover", originalPrice: 299, category: "Skincare" },
  { name: "Wet Wipes", originalPrice: 79, category: "Skincare" },
  { name: "Makeup Remover Wipes", originalPrice: 109, category: "Skincare" },
  { name: "Good Wipes", originalPrice: 39, category: "Skincare" },
  { name: "Miss Wipeout Nail Polish Remover", originalPrice: 75, category: "Skincare" },

  // TOOLS & BRUSHES
  { name: "Artist’s Arsenal Makeup Brush Set", originalPrice: 1499, category: "Tools" },
  { name: "Tools of Titan Brush Set", originalPrice: 999, category: "Tools" },
  { name: "Professional Brush Set", originalPrice: 2699, category: "Tools" },
  { name: "4 in 1 Travel Brush", originalPrice: 659, category: "Tools" },
  
  // SPONGES
  { name: "Master Blender", originalPrice: 129, category: "Tools" },
  { name: "Wonder Blender", originalPrice: 129, category: "Tools" },
  { name: "Microfiber Blender", originalPrice: 149, category: "Tools" },
  { name: "Beauty Blender", originalPrice: 299, category: "Tools" },
  
  // ACCESSORIES
  { name: "Makeup Mirror", originalPrice: 299, category: "Accessories" },
  { name: "Boring Cleaner Pad", originalPrice: 199, category: "Accessories" },
  { name: "Cosmocandy Bag", originalPrice: 399, category: "Accessories" },
  { name: "Sharpener", originalPrice: 69, category: "Accessories" },
  { name: "Makeup Pouch", originalPrice: 549, category: "Accessories" },
  { name: "Vanity Bag", originalPrice: 2799, category: "Accessories" },
];

const CATEGORY_IMAGES = {
  Lips: "https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=600",
  Eyes: "https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=600",
  Face: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=600",
  Kits: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=600",
  Nails: "https://images.unsplash.com/photo-1634749377443-6902409746e0?auto=format&fit=crop&q=80&w=600",
  Skincare: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600",
  Tools: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=600",
  Accessories: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=600"
};

async function seed() {
  try {
    console.log("--- SEEDING MARS BRAND ---");
    
    // 1. Create Brand
    const { data: brand, error: bError } = await supabase
      .from('brands')
      .upsert({ 
        name: "MARS", 
        logo_url: "/brands/mars_logo.png",
        description: "MARS Cosmetics is dedicated to providing high-quality, trendy, and affordable makeup products for everyone."
      }, { onConflict: 'name' })
      .select()
      .single();

    if (bError) throw bError;
    console.log(`Created/Updated Brand: ${brand.name} (${brand.id})`);

    // 2. Prepare Products
    const productsToInsert = MARS_PRODUCTS.map(p => {
      const discountedPrice = Math.round(p.originalPrice * 0.8);
      return {
        brand_id: brand.id,
        name: p.name,
        price: discountedPrice,
        original_price: p.originalPrice,
        discount: 20,
        category: p.category,
        image_url: CATEGORY_IMAGES[p.category] || CATEGORY_IMAGES.Face,
        rating: 4.5,
        reviews_count: Math.floor(Math.random() * 500) + 50,
        is_new: true,
        is_featured: false
      };
    });

    console.log(`Inserting ${productsToInsert.length} products...`);

    // 3. Batch Insert (Supabase handles batching automatically)
    const { error: pError } = await supabase
      .from('products')
      .insert(productsToInsert);

    if (pError) throw pError;
    
    console.log("--- SEEDING COMPLETE ---");
    process.exit(0);
  } catch (err) {
    console.error("Seed failed:", err);
    process.exit(1);
  }
}

seed();
