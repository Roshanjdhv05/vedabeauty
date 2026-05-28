import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser for scripts
const envPath = path.resolve(process.cwd(), '.env');
const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
const env = envLines.reduce((acc, line) => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

// Helper to build path under /facescanada/
const fc = (filePath) => `/facescanada/${filePath}`;

/**
 * Main product image map.
 * Keys = exact product name in DB (case-sensitive).
 * Values = public URL path to assign as image_url.
 *
 * For products that have shade subfolders, we use the first/most
 * representative shade image as the main product thumbnail.
 */
const FACES_CANADA_IMAGE_MAP = {
  // ── FACE ─────────────────────────────────────────────────────────────────

  // Strobe Cream  (subfolder: Strobe Cream/)
  "Strobe Cream":
    fc("Strobe Cream/FACESCANADA Strobe Cream - Rose Gold.jpg"),

  // 3-in-1 All Day Hydra Matte Foundation  (subfolder: 3 in 1 All Day Hydra Matte Foundation/)
  "3 in 1 All Day Hydra Matte Foundation":
    fc("3 in 1 All Day Hydra Matte Foundation/Rose Ivory.png"),

  // Weightless Stay Matte Compact  (subfolder: Weightless Stay Matte Compact/)
  "Weightless Stay Matte Compact":
    fc("Weightless Stay Matte Compact/Beige.png"),

  // Peaches N Cream Tinted Moisturizer  (direct jpg)
  "Peaches N Cream Tinted Moisturizer":
    fc("peaches and cream tinted moisturizer.jpg"),

  // UltimePro Hydrating Makeup Fixer  (direct jpg)
  "UltimePro Hydrating Makeup Fixer":
    fc("Ultime Pro Hydrating Makeup Fixer.jpg"),

  // BB Gel Crème  (subfolder: BB Gel Creme/)
  "BB Gel Crème":
    fc("BB Gel Creme/Light Vanilla.png"),

  // Weightless Matte Foundation  (subfolder: Weightless Matte Foundation/)
  "Weightless Matte Foundation":
    fc("Weightless Matte Foundation/Beige.png"),

  // High Cover Concealer  (subfolder: High Cover Concealer/)
  "High Cover Concealer":
    fc("High Cover Concealer/Caramel Crunch.png"),

  // 3in1 Primer  (subfolder: 3 in 1 Primer/)
  "3in1 Primer":
    fc("3 in 1 Primer/Matte.png"),

  // Liquid Sindoor  (subfolder: Liquid Sindoor/)
  "Liquid Sindoor":
    fc("Liquid Sindoor/Red.png"),

  // ── LIPS ─────────────────────────────────────────────────────────────────

  // Comfy Matte WOW Liquid Lipstick  (subfolder: Comfy Matte Wow Liquid Lipstick/)
  "Comfy Matte WOW Liquid Lipstick":
    fc("Comfy Matte Wow Liquid Lipstick/01 Choco Couture.png"),

  // Comfy Matte Velvet Touch Lipstick  (subfolder: Comfy Matte Velvet Touch Lipstick/)
  "Comfy Matte Velvet Touch Lipstick":
    fc("Comfy Matte Velvet Touch Lipstick/01 Red Velvet.png"),

  // Vitamin C Lip Balm  (subfolder: Vitamin C Lip Balm/)
  "Vitamin C Lip Balm":
    fc("Vitamin C Lip Balm/01 Orange Mint.png"),

  // ── EYES ─────────────────────────────────────────────────────────────────

  "Fresh Eyes Kajal":
    fc("Fresh Eyes Kajal.jpg"),

  "Magneteyes Kajal":
    fc("Magneteyes Kajal.jpg"),

  "Magneteyes Matte Eyeliner":
    fc("Magneteyes Matte Eyeliner.jpg"),

  "Magneteyes Mascara":
    fc("Magneteyes Mascara.jpg"),

  "Magneteyes Trio Pack":
    fc("Magneteyes Trio Pack.jpg"),

  "UltimePro Intense Gel Kajal Black":
    fc("Ultime Pro Intense Gel Kajal Black.jpg"),

  "Longwear Eye Pencil Solid Black":
    fc("Longwear Eye Pencil Solid Black.jpg"),

  // ── NAILS ────────────────────────────────────────────────────────────────

  "InstaRemove Dip & Twist Nail Enamel Remover":
    fc("Instaremove Dip and Twist Nail Enamel Remover.jpg"),

  "Nail Enamel Remover":
    fc("Nail Enamel Remover.jpg"),
};

/**
 * Shade-level image map for product_variants.
 * Key   = product name (DB)
 * Value = { shadeName → image path }
 * Only fill for products where we have per-shade images.
 */
const SHADE_IMAGE_MAP = {
  "Strobe Cream": {
    "Rose Gold": fc("Strobe Cream/FACESCANADA Strobe Cream - Rose Gold.jpg"),
    "Silver":    fc("Strobe Cream/FACESCANADA Strobe Cream - Silver.jpg"),
  },

  "3 in 1 All Day Hydra Matte Foundation": {
    "Caremel Natural": fc("3 in 1 All Day Hydra Matte Foundation/Caremel Natural.png"),
    "Honey Beige":     fc("3 in 1 All Day Hydra Matte Foundation/Honey Beige.png"),
    "Medium Natural":  fc("3 in 1 All Day Hydra Matte Foundation/Medium Natural.png"),
    "Rose Ivory":      fc("3 in 1 All Day Hydra Matte Foundation/Rose Ivory.png"),
    "Soft Sand":       fc("3 in 1 All Day Hydra Matte Foundation/Soft Sand.png"),
    "Warm Natural":    fc("3 in 1 All Day Hydra Matte Foundation/Warm Natural.png"),
    "Warm Sand":       fc("3 in 1 All Day Hydra Matte Foundation/Warm Sand.png"),
    // Extra shades from (1) subfolder
    "Absolute Ivory":  fc("3 in 1 All Day Hydra Matte Foundation(1)/Absolute Ivory.png"),
  },

  "3in1 Primer": {
    "Dewy":  fc("3 in 1 Primer/Dewy.png"),
    "Matte": fc("3 in 1 Primer/Matte.png"),
  },

  "BB Gel Crème": {
    "Light Vanilla": fc("BB Gel Creme/Light Vanilla.png"),
    "Soft Honey":    fc("BB Gel Creme/Soft Honey.png"),
    "Warm Caremel":  fc("BB Gel Creme/Warm Caremel.png"),
  },

  "Comfy Matte Velvet Touch Lipstick": {
    "01 Red Velvet":          fc("Comfy Matte Velvet Touch Lipstick/01 Red Velvet.png"),
    "02 Cherry Pie":          fc("Comfy Matte Velvet Touch Lipstick/02 Cherry Pie.png"),
    "03 Pink Biscoff":        fc("Comfy Matte Velvet Touch Lipstick/03 Pink Biscoff.png"),
    "04 Berry Smoothie":      fc("Comfy Matte Velvet Touch Lipstick/04 Berry Smoothie.png"),
    "05 Pink Lemonade":       fc("Comfy Matte Velvet Touch Lipstick/05 Pink Lemonade.png"),
    "06 Cocoa Truffle":       fc("Comfy Matte Velvet Touch Lipstick/06 Cocoa Truffle.png"),
    "07 Peach Cobbler":       fc("Comfy Matte Velvet Touch Lipstick/07 Peach Cobbler.png"),
    "08 Toffee Drizzle":      fc("Comfy Matte Velvet Touch Lipstick/08 Toffee Drizzle.png"),
    "09 Rose Macaron":        fc("Comfy Matte Velvet Touch Lipstick/09 Rose Macaron.png"),
    "10 Strawberry Shortcake":fc("Comfy Matte Velvet Touch Lipstick/10 Strawberry Shortcake.png"),
    "11 Raspberry Sorbet":    fc("Comfy Matte Velvet Touch Lipstick/11 Raspberry Sorbet.png"),
    "12 Acai Parfait":        fc("Comfy Matte Velvet Touch Lipstick/12 Acai Parfait.png"),
    "13 Cranberry Crampote":  fc("Comfy Matte Velvet Touch Lipstick/13 Cranberry Crampote.png"),
    "14 Mocha Mousse":        fc("Comfy Matte Velvet Touch Lipstick/14 Mocha Mousse.png"),
    "15 Apricot Jam":         fc("Comfy Matte Velvet Touch Lipstick/15 Apricot Jam.png"),
  },

  "Comfy Matte WOW Liquid Lipstick": {
    "01 Choco Couture":  fc("Comfy Matte Wow Liquid Lipstick/01 Choco Couture.png"),
    "02 Mauve Majesty":  fc("Comfy Matte Wow Liquid Lipstick/02 Mauve Majesty.png"),
    "03 Ruby Rouge":     fc("Comfy Matte Wow Liquid Lipstick/03 Ruby Rouge.png"),
    "04 Plum Passion":   fc("Comfy Matte Wow Liquid Lipstick/04 Plum Passion.png"),
    "05 Maroon Maven":   fc("Comfy Matte Wow Liquid Lipstick/05 Maroon Maven.png"),
    "06 Fuschia Fun":    fc("Comfy Matte Wow Liquid Lipstick/06 Fuschia Fun.png"),
    "07 Cocoa Crush":    fc("Comfy Matte Wow Liquid Lipstick/07 Cocoa Crush.png"),
    "08 Nude Nectar":    fc("Comfy Matte Wow Liquid Lipstick/08 Nude Nectar.png"),
    "09 Pink Petal":     fc("Comfy Matte Wow Liquid Lipstick/09 Pink Petal.png"),
    "10 Orchid Opulence":fc("Comfy Matte Wow Liquid Lipstick/10 Orchid Opulence.png"),
  },

  "High Cover Concealer": {
    "Caramel Crunch": fc("High Cover Concealer/Caramel Crunch.png"),
    "Honey Creme":    fc("High Cover Concealer/Honey Creme.png"),
    "Sand Beige":     fc("High Cover Concealer/Sand Beige.png"),
    "Toffee Love":    fc("High Cover Concealer/Toffee Love.png"),
  },

  "Liquid Sindoor": {
    "Maroon": fc("Liquid Sindoor/Maroon.png"),
    "Red":    fc("Liquid Sindoor/Red.png"),
  },

  "Vitamin C Lip Balm": {
    "01 Orange Mint": fc("Vitamin C Lip Balm/01 Orange Mint.png"),
    "02 Watermelon":  fc("Vitamin C Lip Balm/02 Watermelon.png"),
    "03 Red Petal":   fc("Vitamin C Lip Balm/03 Red Petal.png"),
  },

  "Weightless Matte Foundation": {
    "Beige":   fc("Weightless Matte Foundation/Beige.png"),
    "Ivory":   fc("Weightless Matte Foundation/Ivory.png"),
    "Natural": fc("Weightless Matte Foundation/Natural.png"),
  },

  "Weightless Stay Matte Compact": {
    "Beige":   fc("Weightless Stay Matte Compact/Beige.png"),
    "Ivory":   fc("Weightless Stay Matte Compact/Ivory.png"),
    "Natural": fc("Weightless Stay Matte Compact/Natural.png"),
    "Sand":    fc("Weightless Stay Matte Compact/Sand.png"),
  },
};

async function updateFacesCanadaImages() {
  console.log('🔍 Fetching Faces Canada brand...');

  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('id')
    .ilike('name', 'Faces Canada')
    .single();

  if (brandError || !brand) {
    console.error('❌ Faces Canada brand not found:', brandError?.message);
    process.exit(1);
  }

  console.log(`✅ Found brand id: ${brand.id}`);

  // ── 1. Update main product image_url ──────────────────────────────────────
  console.log('\n📸 Updating product image_url...');

  const { data: products, error: pError } = await supabase
    .from('products')
    .select('id, name, image_url')
    .eq('brand_id', brand.id);

  if (pError) { console.error('❌ Error fetching products:', pError.message); process.exit(1); }

  let productUpdated = 0;
  let productMissed = 0;

  for (const product of products) {
    const imageUrl = FACES_CANADA_IMAGE_MAP[product.name];

    if (!imageUrl) {
      console.warn(`⚠️  No image mapped for: "${product.name}"`);
      productMissed++;
      continue;
    }

    const { error } = await supabase
      .from('products')
      .update({ image_url: imageUrl })
      .eq('id', product.id);

    if (error) {
      console.error(`❌ Failed to update "${product.name}":`, error.message);
    } else {
      console.log(`✅ ${product.name}  →  ${imageUrl}`);
      productUpdated++;
    }
  }

  console.log(`\n📊 Products: ${productUpdated} updated, ${productMissed} no image mapped.`);

  // ── 2. Update shade variant image_url ─────────────────────────────────────
  console.log('\n🎨 Updating shade variant images...');

  const { data: variants, error: vError } = await supabase
    .from('product_variants')
    .select('id, name, product_id, products(name)')
    .in('product_id', products.map(p => p.id));

  if (vError) {
    console.warn('⚠️  Could not fetch variants (table may not have image_url column):', vError.message);
    console.log('\n✅ Done — only product images were updated.');
    process.exit(0);
  }

  let variantUpdated = 0;
  let variantMissed = 0;

  for (const variant of variants) {
    const productName = variant.products?.name;
    const shadeName = variant.name;

    if (!productName) continue;

    const shadeMap = SHADE_IMAGE_MAP[productName];
    if (!shadeMap) continue; // product has no shade images

    const imageUrl = shadeMap[shadeName];
    if (!imageUrl) {
      // Try partial / case-insensitive match
      const matchKey = Object.keys(shadeMap).find(
        k => k.toLowerCase() === shadeName?.toLowerCase() ||
             shadeName?.toLowerCase().includes(k.toLowerCase()) ||
             k.toLowerCase().includes(shadeName?.toLowerCase())
      );
      if (!matchKey) {
        console.warn(`  ⚠️  No shade image for "${productName}" → "${shadeName}"`);
        variantMissed++;
        continue;
      }
    }

    const resolvedUrl = imageUrl ?? shadeMap[Object.keys(shadeMap).find(
      k => k.toLowerCase() === shadeName?.toLowerCase()
    )];

    if (!resolvedUrl) { variantMissed++; continue; }

    const { error } = await supabase
      .from('product_variants')
      .update({ image_url: resolvedUrl })
      .eq('id', variant.id);

    if (error) {
      // If the column doesn't exist, just skip quietly
      if (error.message.includes('column') || error.message.includes('image_url')) {
        console.warn('  ℹ️  product_variants table has no image_url column — skipping shade images.');
        break;
      }
      console.error(`  ❌ Failed to update variant "${shadeName}":`, error.message);
    } else {
      console.log(`  🎨 ${productName} / ${shadeName}  →  ${resolvedUrl}`);
      variantUpdated++;
    }
  }

  if (variantUpdated > 0 || variantMissed > 0) {
    console.log(`\n📊 Variants: ${variantUpdated} updated, ${variantMissed} no image mapped.`);
  }

  console.log('\n🎉 Faces Canada image update complete!');
  process.exit(0);
}

updateFacesCanadaImages().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
