import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const RAW_PRODUCT_LIST = [
  // PRIMER
  { name: "3 in 1 Primer", category: "PRIMER", has_variants: true, image_name: "3 in 1 Primer 30ml.png", variants: [{ name: "30ml", type: "volume", mrp_price: 340, stock: 100 }, { name: "10ml", type: "volume", mrp_price: 150, stock: 100 }] },
  { name: "Pore Primer", category: "PRIMER", has_variants: true, image_name: "Pore Primer 30ml.png", variants: [{ name: "30ml", type: "volume", mrp_price: 415, stock: 100 }, { name: "10ml", type: "volume", mrp_price: 140, stock: 100 }] },
  { name: "Prime N Perfect Hydrating Primer", category: "PRIMER", has_variants: true, image_name: "Prime N Perfect Hydrating Primer 30ml.png", variants: [{ name: "30ml", type: "volume", mrp_price: 380, stock: 100 }, { name: "10ml", type: "volume", mrp_price: 140, stock: 100 }] },

  // SINDOOR
  { name: "Organic Sindoor", category: "SINDOOR", has_variants: true, image_name: "Organic Sindoor SND-16 (02 shades- Red, Maroon).png", variants: [{ name: "Red", type: "shade", mrp_price: 60, stock: 100 }, { name: "Maroon", type: "shade", mrp_price: 60, stock: 100 }] },
  { name: "Liquid Sindoor", category: "SINDOOR", has_variants: true, image_name: "Liquid Sindoor SND-19 (Red, Maroon).png", variants: [{ name: "Red", type: "shade", mrp_price: 130, stock: 100 }, { name: "Maroon", type: "shade", mrp_price: 130, stock: 100 }] },

  // EYEBROW
  { name: "Smudge Free Eyebrow Pencil", category: "EYEBROW", has_variants: true, image_name: "Brow Tattoo Smudge Free EB-02 (03 shades).png", variants: [{ name: "Black", type: "shade", mrp_price: 170, stock: 100 }, { name: "Brown", type: "shade", mrp_price: 170, stock: 100 }, { name: "Grey", type: "shade", mrp_price: 170, stock: 100 }] },

  // EYELINER
  { name: "Waterproof Eye Ink", category: "EYELINER", has_variants: true, image_name: "Waterproof Eye Ink EL-52 Black.png", variants: [{ name: "Black", type: "shade", mrp_price: 185, stock: 100 }, { name: "Colours", type: "shade", mrp_price: 200, stock: 100 }] },
  { name: "Waterproof Eyeliner EL-32", category: "EYELINER", has_variants: true, image_name: "Waterproof Eyeliner EL-32 Shiny.png", variants: [{ name: "Shiny", type: "finish", mrp_price: 125, stock: 100 }, { name: "Matte", type: "finish", mrp_price: 125, stock: 100 }] },
  { name: "Waterproof Eyeliner EL-233", category: "EYELINER", has_variants: true, image_name: "Waterproof Eyeliner EL-233 Matte.png", variants: [{ name: "Matte", type: "finish", mrp_price: 75, stock: 100 }, { name: "Shiny", type: "finish", mrp_price: 95, stock: 100 }] },

  // KAJAL / KOHL
  { name: "Intense Kohl Kajal", category: "MASCARA & KAJAL", has_variants: true, image_name: "Intense Kohl Kajal K-02 Black.png", variants: [{ name: "Black", type: "shade", mrp_price: 130, stock: 100 }, { name: "White", type: "shade", mrp_price: 130, stock: 100 }, { name: "Colours", type: "shade", mrp_price: 120, stock: 100 }] },
  { name: "Super Kajal", category: "MASCARA & KAJAL", has_variants: true, image_name: "Super Kajal K-01 Black.png", variants: [{ name: "Black", type: "shade", mrp_price: 175, stock: 100 }, { name: "Colours", type: "shade", mrp_price: 165, stock: 100 }] },

  // NAIL POLISH REMOVER
  { name: "Nail Polish Remover Wipes", category: "NAIL POLISH REMOVER", has_variants: true, image_name: "Nail Polish Remover Wipes 30 (Apple, Strawberry, Lemon).png", variants: [{ name: "30 pack", type: "size", mrp_price: 60, stock: 100 }, { name: "40 pack", type: "size", mrp_price: 80, stock: 100 }] },
  { name: "Instant Nail Polish Remover", category: "NAIL POLISH REMOVER", has_variants: true, image_name: "Instant Nail Polish Remover 60ml (3 variants).png", variants: [{ name: "60ml", type: "volume", mrp_price: 59, stock: 100 }, { name: "100ml", type: "volume", mrp_price: 85, stock: 100 }] },

  // ACCESSORIES
  { name: "Beauty Blender Sponge Applicator", category: "ACCESSORIES", has_variants: true, image_name: "Beauty Blender Sponge Applicator (3 variants).png", variants: [{ name: "Beige", type: "color", mrp_price: 145, stock: 100 }, { name: "Pink", type: "color", mrp_price: 145, stock: 100 }, { name: "Orange", type: "color", mrp_price: 145, stock: 100 }] },
  { name: "Hair Brush", category: "ACCESSORIES", has_variants: true, image_name: "Hair Brush Flat.png", variants: [{ name: "Flat", type: "style", mrp_price: 250, stock: 100 }, { name: "Round", type: "style", mrp_price: 130, stock: 100 }, { name: "Round & Curl", type: "style", mrp_price: 240, stock: 100 }] },
];

const DISCOUNT_RATE = 0.75; // 25% discount

async function insertVariants() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Insight').single();
  const { data: products } = await supabase.from('products').select('id, name').eq('brand_id', brand.id);

  console.log('Inserting variants...');
  for (const item of RAW_PRODUCT_LIST) {
    if (!item.has_variants) continue;
    const product = products.find(p => p.name === item.name);
    if (!product) continue;
    for (const v of item.variants) {
      const sellingPrice = Math.round(v.mrp_price * DISCOUNT_RATE);
      // Delete old variant if exists to avoid duplication
      await supabase.from('product_variants').delete().eq('product_id', product.id).eq('name', v.name);
      
      const { error } = await supabase.from('product_variants').insert({
        product_id: product.id,
        name: v.name,
        type: v.type,
        mrp_price: v.mrp_price,
        selling_price: sellingPrice,
        price: sellingPrice,
        stock: v.stock
      });
      if (error) console.error(`Error inserting variant ${v.name} for ${product.name}:`, error.message);
      else console.log(`✅ Inserted variant: ${v.name} for ${product.name}`);
    }
  }
  console.log('✅ Variants seeded successfully!');
}

insertVariants();
