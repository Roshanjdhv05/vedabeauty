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
  // FACE
  {
    name: "Strobe Cream",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "30 ml", type: "volume", mrp_price: 599, stock: 100 },
      { name: "18 ml", type: "volume", mrp_price: 299, stock: 100 }
    ]
  },
  {
    name: "3 in 1 All Day Hydra Matte Foundation",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "30 ml", type: "volume", mrp_price: 599, stock: 100 },
      { name: "18 ml", type: "volume", mrp_price: 325, stock: 100 }
    ]
  },
  { name: "Weightless Stay Matte Compact", category: "FACE", has_variants: false, mrp_price: 225 },
  {
    name: "Peaches N Cream Tinted Moisturizer",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "30 g", type: "size", mrp_price: 599, stock: 100 },
      { name: "18 g", type: "size", mrp_price: 249, stock: 100 }
    ]
  },
  {
    name: "UltimePro Hydrating Makeup Fixer",
    category: "FACE",
    has_variants: true,
    variants: [
      { name: "100 ml", type: "volume", mrp_price: 649, stock: 100 },
      { name: "50 ml",  type: "volume", mrp_price: 349, stock: 100 }
    ]
  },
  { name: "BB Gel Crème",                            category: "FACE", has_variants: false, mrp_price: 349 },
  { name: "Weightless Matte Foundation",             category: "FACE", has_variants: false, mrp_price: 225 },
  { name: "High Cover Concealer",                    category: "FACE", has_variants: false, mrp_price: 299 },
  { name: "3in1 Primer",                             category: "FACE", has_variants: false, mrp_price: 549 },
  { name: "Fresh Clean Glow Makeup Remover Wipes",   category: "FACE", has_variants: false, mrp_price: 99  },
  { name: "Liquid Sindoor",                          category: "FACE", has_variants: false, mrp_price: 149 },

  // LIPS
  { name: "UltimePro HD Intense Matte Lips + Primer – Festive Edition", category: "LIPS", has_variants: false, mrp_price: 849 },
  { name: "Comfy Matte WOW Liquid Lipstick",         category: "LIPS", has_variants: false, mrp_price: 299 },
  { name: "Comfy Matte Velvet Touch Lipstick",       category: "LIPS", has_variants: false, mrp_price: 449 },
  { name: "Vitamin C Lip Balm",                      category: "LIPS", has_variants: false, mrp_price: 175 },

  // EYES
  { name: "Fresh Eyes Kajal",                        category: "EYES", has_variants: false, mrp_price: 329 },
  { name: "Magneteyes Kajal",                        category: "EYES", has_variants: false, mrp_price: 189 },
  { name: "Magneteyes Matte Eyeliner",               category: "EYES", has_variants: false, mrp_price: 299 },
  { name: "Magneteyes Mascara",                      category: "EYES", has_variants: false, mrp_price: 449 },
  { name: "Magneteyes Trio Pack",                    category: "EYES", has_variants: false, mrp_price: 799 },
  { name: "UltimePro Intense Gel Kajal Black",       category: "EYES", has_variants: false, mrp_price: 575 },
  { name: "Longwear Eye Pencil Solid Black",         category: "EYES", has_variants: false, mrp_price: 399 },

  // NAILS
  { name: "Ultime Pro Splash Nail Enamel",           category: "NAILS", has_variants: false, mrp_price: 129 },
  { name: "InstaRemove Dip & Twist Nail Enamel Remover", category: "NAILS", has_variants: false, mrp_price: 250 },
  { name: "Nail Enamel Remover",                     category: "NAILS", has_variants: false, mrp_price: 99  },
];

const BRAND_NAME = "Faces Canada";
const DISCOUNT_RATE = 0.80; // 20% discount

const categoryImages = {
  'FACE':  'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?w=400&q=80',
  'LIPS':  'https://images.unsplash.com/photo-1586776977607-310e9c725c37?w=400&q=80',
  'EYES':  'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?w=400&q=80',
  'NAILS': 'https://images.unsplash.com/photo-1634749377443-6902409746e0?w=400&q=80',
};

async function seedFacesCanada() {
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
    let sql = `-- INSERT PRODUCT VARIANTS FOR FACES CANADA\n`;
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
    fs.writeFileSync(path.resolve(process.cwd(), 'scripts', 'insert_faces_canada_variants.sql'), sql);

    console.log('\n✅ Faces Canada seeded successfully!');
    console.log('👉 Now run scripts/insert_faces_canada_variants.sql in your Supabase SQL Editor!');
  } catch (err) {
    console.error('❌ Error:', err);
  }
}

seedFacesCanada();
