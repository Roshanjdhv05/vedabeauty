const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vacfwszqcxbvfnaadagg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhY2Z3c3pxY3hidmZuYWFkYWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDk2MTIsImV4cCI6MjA5MTkyNTYxMn0.1DJaBKSqmC6AzRlNkt-teMz6vmMfwtK-oIR_AAS3D7o'
);

// All desired global homepage categories
const DESIRED_CATEGORIES = [
  {
    name: 'Lips',
    image_url: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
    display_order: 1
  },
  {
    name: 'Eyes',
    image_url: 'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=400',
    display_order: 2
  },
  {
    name: 'Face',
    image_url: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400',
    display_order: 3
  },
  {
    name: 'Nails',
    image_url: 'https://images.unsplash.com/photo-1634749377443-6902409746e0?auto=format&fit=crop&q=80&w=400',
    display_order: 4
  },
  {
    name: 'Removers & Wipes',
    image_url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400',
    display_order: 5
  },
  {
    name: 'Tools & Accessories',
    image_url: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=400',
    display_order: 6
  },
];

async function seedCategories() {
  try {
    // 1. Fetch all existing global categories
    const { data: existing, error: fetchErr } = await supabase
      .from('category_settings')
      .select('name')
      .is('brand_id', null);

    if (fetchErr) throw fetchErr;

    const existingNames = (existing || []).map(c => c.name.toLowerCase().trim());
    console.log('Existing:', existingNames);

    // 2. Find which ones are missing
    const toInsert = DESIRED_CATEGORIES.filter(
      cat => !existingNames.includes(cat.name.toLowerCase().trim())
    ).map(cat => ({ ...cat, brand_id: null, is_active: true }));

    if (toInsert.length === 0) {
      console.log('✅ All categories already exist! Nothing to insert.');
      return;
    }

    console.log('Inserting missing categories:', toInsert.map(c => c.name));

    // 3. Insert only the missing ones
    const { error: insertErr } = await supabase
      .from('category_settings')
      .insert(toInsert);

    if (insertErr) throw insertErr;

    console.log('✅ Done! Inserted', toInsert.length, 'new categories.');

  } catch (err) {
    console.error('❌ Failed:', err.message);
  }
}

seedCategories();
