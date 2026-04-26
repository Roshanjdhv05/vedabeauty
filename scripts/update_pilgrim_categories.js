import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categoryMap = {
  // Haircare (Unspecified Subcategory)
  'Advanced Hair Growth Serum': 'Haircare',
  'Korean Black Rice & Rosemary Water Spray': 'Haircare',

  // Shampoos
  'Anti-Hairfall Shampoo': 'Shampoos',
  'Non-Drying Anti-Dandruff Shampoo': 'Shampoos',
  'Advanced Damage Repair Shampoo': 'Shampoos',
  'Smoothening Shampoo': 'Shampoos',

  // Conditioners
  'Smoothening Conditioner': 'Conditioners',
  'Advanced Damage Repair Conditioner': 'Conditioners',
  'Anti-Dandruff Conditioner': 'Conditioners',

  // Hair Mask
  'Smoothening Hair Mask': 'Hair Mask',

  // Face Serums
  '10% Vitamin C Face Serum': 'Face Serums',
  '15% Vitamin C Face Serum': 'Face Serums',
  '10% Niacinamide Face Serum': 'Face Serums',
  '25% AHA, 2% BHA, 5% PHA Peeling Solution': 'Face Serums',

  // Sunscreens
  'Hydra Glow Gel Sunscreen SPF 50+ PA++++': 'Sunscreens',
  'Brightening Serum Sunscreen SPF 50+ PA++++': 'Sunscreens',

  // Moisturizers
  'Korean Rice Water Hydra Glow Moisturizer': 'Moisturizers',
  'French Red Vine Youthful Glow Moisturizer': 'Moisturizers',

  // Night Cream
  'French Red Vine & Retinol Youthful Glow Night Gel Crème': 'Night Cream',

  // Face Washes
  'Korean Rice Water Hydra Glow Gel Face Wash': 'Face Washes',
  'Vitamin C Brightening Gel Face Wash': 'Face Washes',
  '24K Gold Gel Face Wash': 'Face Washes',
  'Australian Tea Tree Oil-Balance Gel Face Wash': 'Face Washes',

  // Face Gel
  '99% Aloe Vera Gel': 'Face Gel'
};

async function updateCategories() {
  const { data: brand } = await supabase.from('brands').select('id').eq('name', 'Pilgrim').single();

  const { data: products } = await supabase.from('products').select('id, name, category').eq('brand_id', brand.id);

  for (const product of products) {
    const newCategory = categoryMap[product.name];
    if (newCategory && newCategory !== product.category) {
      await supabase.from('products').update({ category: newCategory }).eq('id', product.id);
      console.log(`Updated ${product.name}: ${product.category} -> ${newCategory}`);
    } else {
      console.log(`Skipped ${product.name}`);
    }
  }
  
  console.log('Categories updated successfully!');
}

updateCategories();
