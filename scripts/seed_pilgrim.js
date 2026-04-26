import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/* 
  ==============================================================
  PASTE YOUR RAW PILGRIM PRODUCT LIST DATA HERE
  ==============================================================
  Example format:
  [
    {
      name: "Advanced Hair Growth Serum",
      category: "Haircare",
      has_variants: true,
      variants: [
        { name: "25 ml", type: "volume", mrp_price: 595, stock: 100 },
        { name: "50 ml", type: "volume", mrp_price: 995, stock: 100 }
      ]
    },
    {
      name: "Squalane Glow Moisturizer",
      category: "Skincare",
      has_variants: false,
      mrp_price: 800,
      stock: 50
    }
  ]
*/
const RAW_PRODUCT_LIST = [
  {
    "name": "Advanced Hair Growth Serum",
    "category": "Haircare",
    "has_variants": true,
    "variants": [
      { "name": "25 ml", "type": "volume", "mrp_price": 595, "stock": 100 },
      { "name": "50 ml", "type": "volume", "mrp_price": 995, "stock": 100 }
    ]
  },
  {
    "name": "Korean Black Rice & Rosemary Water Spray",
    "category": "Haircare",
    "has_variants": true,
    "variants": [
      { "name": "100 ml", "type": "volume", "mrp_price": 225, "stock": 100 },
      { "name": "200 ml", "type": "volume", "mrp_price": 345, "stock": 100 }
    ]
  },
  {
    "name": "Anti-Hairfall Shampoo",
    "category": "Haircare",
    "has_variants": false,
    "mrp_price": 305,
    "stock": 100
  },
  {
    "name": "Non-Drying Anti-Dandruff Shampoo",
    "category": "Haircare",
    "has_variants": true,
    "variants": [
      { "name": "200 ml", "type": "volume", "mrp_price": 345, "stock": 100 },
      { "name": "650 ml", "type": "volume", "mrp_price": 895, "stock": 100 }
    ]
  },
  {
    "name": "Advanced Damage Repair Shampoo",
    "category": "Haircare",
    "has_variants": true,
    "variants": [
      { "name": "200 ml", "type": "volume", "mrp_price": 305, "stock": 100 },
      { "name": "400 ml", "type": "volume", "mrp_price": 485, "stock": 100 }
    ]
  },
  {
    "name": "Smoothening Shampoo",
    "category": "Haircare",
    "has_variants": true,
    "variants": [
      { "name": "200 ml", "type": "volume", "mrp_price": 345, "stock": 100 },
      { "name": "400 ml", "type": "volume", "mrp_price": 545, "stock": 100 }
    ]
  },
  {
    "name": "Smoothening Conditioner",
    "category": "Haircare",
    "has_variants": false,
    "mrp_price": 400,
    "stock": 100
  },
  {
    "name": "Advanced Damage Repair Conditioner",
    "category": "Haircare",
    "has_variants": false,
    "mrp_price": 395,
    "stock": 100
  },
  {
    "name": "Anti-Dandruff Conditioner",
    "category": "Haircare",
    "has_variants": false,
    "mrp_price": 395,
    "stock": 100
  },
  {
    "name": "Smoothening Hair Mask",
    "category": "Haircare",
    "has_variants": false,
    "mrp_price": 550,
    "stock": 100
  },
  {
    "name": "10% Vitamin C Face Serum",
    "category": "Skincare",
    "has_variants": false,
    "mrp_price": 545,
    "stock": 100
  },
  {
    "name": "15% Vitamin C Face Serum",
    "category": "Skincare",
    "has_variants": false,
    "mrp_price": 595,
    "stock": 100
  },
  {
    "name": "10% Niacinamide Face Serum",
    "category": "Skincare",
    "has_variants": false,
    "mrp_price": 595,
    "stock": 100
  },
  {
    "name": "25% AHA, 2% BHA, 5% PHA Peeling Solution",
    "category": "Skincare",
    "has_variants": false,
    "mrp_price": 645,
    "stock": 100
  },
  {
    "name": "Hydra Glow Gel Sunscreen SPF 50+ PA++++",
    "category": "Skincare",
    "has_variants": false,
    "mrp_price": 495,
    "stock": 100
  },
  {
    "name": "Brightening Serum Sunscreen SPF 50+ PA++++",
    "category": "Skincare",
    "has_variants": false,
    "mrp_price": 495,
    "stock": 100
  },
  {
    "name": "Korean Rice Water Hydra Glow Moisturizer",
    "category": "Skincare",
    "has_variants": true,
    "variants": [
      { "name": "50 g", "type": "size", "mrp_price": 275, "stock": 100 },
      { "name": "100 g", "type": "size", "mrp_price": 395, "stock": 100 }
    ]
  },
  {
    "name": "French Red Vine Youthful Glow Moisturizer",
    "category": "Skincare",
    "has_variants": false,
    "mrp_price": 550,
    "stock": 100
  },
  {
    "name": "French Red Vine & Retinol Youthful Glow Night Gel Crème",
    "category": "Skincare",
    "has_variants": false,
    "mrp_price": 650,
    "stock": 100
  },
  {
    "name": "Korean Rice Water Hydra Glow Gel Face Wash",
    "category": "Skincare",
    "has_variants": false,
    "mrp_price": 245,
    "stock": 100
  },
  {
    "name": "Vitamin C Brightening Gel Face Wash",
    "category": "Skincare",
    "has_variants": false,
    "mrp_price": 250,
    "stock": 100
  },
  {
    "name": "24K Gold Gel Face Wash",
    "category": "Skincare",
    "has_variants": false,
    "mrp_price": 395,
    "stock": 100
  },
  {
    "name": "Australian Tea Tree Oil-Balance Gel Face Wash",
    "category": "Skincare",
    "has_variants": false,
    "mrp_price": 250,
    "stock": 100
  },
  {
    "name": "99% Aloe Vera Gel",
    "category": "Skincare",
    "has_variants": false,
    "mrp_price": 275,
    "stock": 100
  }
];

const BRAND_NAME = "Pilgrim";
const BRAND_SLUG = "pilgrim";
const DISCOUNT_RATE = 0.75; // 25% discount

async function seedPilgrim() {
  console.log(`Starting seed for ${BRAND_NAME}...`);

  try {
    // 1. BRAND CREATION
    let { data: brand, error: brandError } = await supabase
      .from('brands')
      .select('id')
      .eq('name', BRAND_NAME)
      .single();

    let brandId;
    
    if (!brand) {
      console.log(`Creating brand: ${BRAND_NAME}`);
      const { data: newBrand, error: insertError } = await supabase
        .from('brands')
        .insert({
          name: BRAND_NAME,
          logo_url: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=200" // Optional logo
        })
        .select()
        .single();
        
      if (insertError) throw insertError;
      brandId = newBrand.id;
    } else {
      brandId = brand.id;
      console.log(`Brand ${BRAND_NAME} already exists.`);
    }

    // 2. PRODUCT INSERTION & 3. VARIANT HANDLING
    for (const item of RAW_PRODUCT_LIST) {
      console.log(`Processing: ${item.name}`);
      
      let baseSellingPrice = 0;
      let baseMrpPrice = 0;
      let variantsData = [];
      
      if (item.has_variants && item.variants && item.variants.length > 0) {
        // Calculate prices for all variants and find the lowest selling price for the base product
        variantsData = item.variants.map(v => {
          const sellingPrice = Math.round(v.mrp_price * DISCOUNT_RATE);
          return {
            ...v,
            selling_price: sellingPrice
          };
        });
        
        // Find lowest selling price
        const lowestVariant = [...variantsData].sort((a, b) => a.selling_price - b.selling_price)[0];
        baseSellingPrice = lowestVariant.selling_price;
        baseMrpPrice = lowestVariant.mrp_price;
      } else {
        baseMrpPrice = item.mrp_price || 0;
        baseSellingPrice = Math.round(baseMrpPrice * DISCOUNT_RATE);
      }

      // Check if product exists to avoid duplicates
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('name', item.name)
        .eq('brand_id', brandId)
        .single();

      let productId;
      
      if (existingProduct) {
        console.log(`Updating existing product: ${item.name}`);
        const { data: updated, error: pError } = await supabase
          .from('products')
          .update({
            category: item.category,
            has_variants: item.has_variants || false,
            mrp_price: baseMrpPrice,
            selling_price: baseSellingPrice,
            price: baseSellingPrice, // Fallback for old code
            original_price: baseMrpPrice, // Fallback for old code
            discount: 25
          })
          .eq('id', existingProduct.id)
          .select()
          .single();
          
        if (pError) throw pError;
        productId = updated.id;
      } else {
        console.log(`Inserting new product: ${item.name}`);
        const { data: inserted, error: pError } = await supabase
          .from('products')
          .insert({
            name: item.name,
            brand_id: brandId,
            category: item.category || 'Skincare',
            has_variants: item.has_variants || false,
            mrp_price: baseMrpPrice,
            selling_price: baseSellingPrice,
            price: baseSellingPrice, // Fallback for old code
            original_price: baseMrpPrice, // Fallback for old code
            discount: 25,
            image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800'
          })
          .select()
          .single();
          
        if (pError) throw pError;
        productId = inserted.id;
      }

      // Handle variants insertion
      if (item.has_variants && variantsData.length > 0) {
        for (const variant of variantsData) {
          // Check if variant exists
          const { data: existingVariant } = await supabase
            .from('product_variants')
            .select('id')
            .eq('product_id', productId)
            .eq('name', variant.name)
            .single();
            
          if (existingVariant) {
            await supabase
              .from('product_variants')
              .update({
                mrp_price: variant.mrp_price,
                selling_price: variant.selling_price,
                price: variant.selling_price, // Fallback
                stock: variant.stock || 100
              })
              .eq('id', existingVariant.id);
          } else {
            await supabase
              .from('product_variants')
              .insert({
                product_id: productId,
                name: variant.name,
                type: variant.type || 'volume',
                mrp_price: variant.mrp_price,
                selling_price: variant.selling_price,
                price: variant.selling_price, // Fallback
                stock: variant.stock || 100
              });
          }
        }
      }
    }

    console.log('✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  }
}

seedPilgrim();
