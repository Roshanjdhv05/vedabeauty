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
  { name: "Ultrastay Transferproof Lipstick", category: "LIP PRODUCTS", has_variants: false, mrp_price: 229 },
  { name: "Matte Lipcolour", category: "LIP PRODUCTS", has_variants: false, mrp_price: 279 },
  { name: "Satin Matte Lipstick", category: "LIP PRODUCTS", has_variants: false, mrp_price: 299 },
  { name: "4 in 1 Lip Twist", category: "LIP PRODUCTS", has_variants: false, mrp_price: 499 },
  { name: "Nourishing Lip Balm", category: "LIP PRODUCTS", has_variants: false, mrp_price: 149 },
  { name: "High Shine Lip Gloss", category: "LIP PRODUCTS", has_variants: false, mrp_price: 249 },
  { name: "Lip Liner Velvet Matte", category: "LIP PRODUCTS", has_variants: false, mrp_price: 229 },

  { name: "HD Liquid Foundation", category: "FACE", has_variants: false, mrp_price: 399 },
  { name: "Banana Powder", category: "FACE", has_variants: false, mrp_price: 349 },
  { name: "Full Coverage Concealer", category: "FACE", has_variants: false, mrp_price: 299 },
  { name: "Perfecting Primer", category: "FACE", has_variants: false, mrp_price: 399 },
  { name: "Ultra HD Blush", category: "FACE", has_variants: false, mrp_price: 249 },
  { name: "Makeup Setting Spray", category: "FACE", has_variants: false, mrp_price: 299 },
  { name: "Longwear Compact", category: "FACE", has_variants: false, mrp_price: 249 },

  { name: "Eyeshadow Palette", category: "EYES", has_variants: false, mrp_price: 499 },
  { name: "Intense Kohl", category: "EYES", has_variants: false, mrp_price: 329 },
  { name: "Longwear Kajal (Black)", category: "EYES", has_variants: false, mrp_price: 179 },
  { name: "Longwear Kajal (Blue / Brown)", category: "EYES", has_variants: false, mrp_price: 199 },
  { name: "24 Hour Waterproof Kajal", category: "EYES", has_variants: false, mrp_price: 199 },
  { name: "Brow Shaper", category: "EYES", has_variants: false, mrp_price: 329 },
  { name: "Volumizing Mascara", category: "EYES", has_variants: false, mrp_price: 329 },
  { name: "Waterproof Mascara", category: "EYES", has_variants: false, mrp_price: 399 },
  { name: "Matte Eyeliner", category: "EYES", has_variants: false, mrp_price: 219 },
  { name: "Waterproof Eyeliner", category: "EYES", has_variants: false, mrp_price: 329 },

  { 
    name: "SPF 25 Brightening Lotion", 
    category: "SKINCARE & BODY", 
    has_variants: true,
    variants: [
      { name: "75 ml", type: "volume", mrp_price: 99, stock: 100 },
      { name: "200 ml", type: "volume", mrp_price: 259, stock: 100 }
    ]
  },
  { 
    name: "Intense Nourishing Lotion", 
    category: "SKINCARE & BODY", 
    has_variants: true,
    variants: [
      { name: "75 ml", type: "volume", mrp_price: 99, stock: 100 },
      { name: "200 ml", type: "volume", mrp_price: 239, stock: 100 }
    ]
  },
  { name: "Instant Brightening Serum", category: "SKINCARE & BODY", has_variants: false, mrp_price: 299 },
  { 
    name: "SPF 50 Sunscreen", 
    category: "SKINCARE & BODY", 
    has_variants: true,
    variants: [
      { name: "30g", type: "size", mrp_price: 199, stock: 100 },
      { name: "50g", type: "size", mrp_price: 249, stock: 100 }
    ]
  },
  { 
    name: "Vitamin C & Tea Tree Face Wash", 
    category: "SKINCARE & BODY", 
    has_variants: true,
    variants: [
      { name: "40 ml", type: "volume", mrp_price: 99, stock: 100 },
      { name: "80 ml", type: "volume", mrp_price: 159, stock: 100 }
    ]
  },
  { name: "Body Wash – Vitamin C & Aloe Vera", category: "SKINCARE & BODY", has_variants: false, mrp_price: 199 },
  { name: "Body Wash – Hyaluronic Acid & Moroccan Rose", category: "SKINCARE & BODY", has_variants: false, mrp_price: 199 },
  { name: "Body Wash – Salicylic Acid with Coffee Extract", category: "SKINCARE & BODY", has_variants: false, mrp_price: 199 },
  { name: "Body Wash – Niacinamide & Acai Berry", category: "SKINCARE & BODY", has_variants: false, mrp_price: 199 },

  { name: "Nail Lacquer Classic", category: "NAILS", has_variants: false, mrp_price: 129 },
  { name: "Glitter Nail Lacquer", category: "NAILS", has_variants: false, mrp_price: 149 },
  { name: "Strengthening Base Coat", category: "NAILS", has_variants: false, mrp_price: 99 },
  { name: "Dip & Twist Nail Lacquer Remover", category: "NAILS", has_variants: false, mrp_price: 179 },
  { name: "Nail Lacquer Remover", category: "NAILS", has_variants: false, mrp_price: 109 },
];

const BRAND_NAME = "Sugar Pop";
const DISCOUNT_RATE = 0.80; // 20% discount

const categoryImages = {
  'LIP PRODUCTS': 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=400&q=80',
  'FACE': 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=400&q=80',
  'EYES': 'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?w=400&q=80',
  'SKINCARE & BODY': 'https://images.unsplash.com/photo-1611077544669-e0e64c399b00?w=400&q=80',
  'NAILS': 'https://images.unsplash.com/photo-1634749377443-6902409746e0?w=400&q=80'
};

async function seedSugarPop() {
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
          logo_url: "https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=200&q=80"
        }).select().single();
      if (insertError) throw insertError;
      brandId = newBrand.id;
    } else {
      brandId = brand.id;
    }

    console.log('Inserting products...');
    for (const item of RAW_PRODUCT_LIST) {
      let baseSellingPrice = 0;
      let baseMrpPrice = 0;

      if (item.has_variants) {
        const variantsData = item.variants.map(v => ({
          ...v,
          selling_price: Math.round(v.mrp_price * DISCOUNT_RATE)
        }));
        const lowestVariant = [...variantsData].sort((a, b) => a.selling_price - b.selling_price)[0];
        baseSellingPrice = lowestVariant.selling_price;
        baseMrpPrice = lowestVariant.mrp_price;
      } else {
        baseMrpPrice = item.mrp_price;
        baseSellingPrice = Math.round(baseMrpPrice * DISCOUNT_RATE);
      }

      const { data: existing } = await supabase.from('products').select('id').eq('name', item.name).eq('brand_id', brandId).single();

      if (!existing) {
        await supabase.from('products').insert({
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
      }
    }

    console.log('Setting up category filters for BrandPage...');
    await supabase.from('category_settings').delete().eq('brand_id', brandId);
    const catInserts = Object.keys(categoryImages).map(catName => ({
      brand_id: brandId,
      name: catName,
      image_url: categoryImages[catName],
      is_active: true
    }));
    await supabase.from('category_settings').insert(catInserts);

    console.log('Generating variant SQL for RLS bypass...');
    const { data: products } = await supabase.from('products').select('id, name').eq('brand_id', brandId);
    let sql = `-- INSERT PRODUCT VARIANTS FOR SUGAR POP\n`;
    for (const item of RAW_PRODUCT_LIST) {
      const product = products.find(p => p.name === item.name);
      if (!product || !item.has_variants) continue;
      for (const v of item.variants) {
        const sellingPrice = Math.round(v.mrp_price * DISCOUNT_RATE);
        sql += `INSERT INTO product_variants (product_id, name, type, mrp_price, selling_price, price, stock) \n`;
        sql += `VALUES ('${product.id}', '${v.name}', '${v.type}', ${v.mrp_price}, ${sellingPrice}, ${sellingPrice}, ${v.stock})\n`;
        sql += `ON CONFLICT DO NOTHING;\n\n`;
      }
    }
    fs.writeFileSync(path.resolve(process.cwd(), 'scripts', 'insert_sugar_pop_variants.sql'), sql);
    
    console.log('✅ Sugar Pop seeded successfully!');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

seedSugarPop();
