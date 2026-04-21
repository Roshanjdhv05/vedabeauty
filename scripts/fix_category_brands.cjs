const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vacfwszqcxbvfnaadagg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhY2Z3c3pxY3hidmZuYWFkYWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDk2MTIsImV4cCI6MjA5MTkyNTYxMn0.1DJaBKSqmC6AzRlNkt-teMz6vmMfwtK-oIR_AAS3D7o'
);

async function fixCategoryBrands() {
  try {
    // 1. Find MARS brand
    const { data: brands, error: brandError } = await supabase
      .from('brands')
      .select('id, name')
      .ilike('name', '%MARS%');

    if (brandError) throw brandError;
    if (!brands || brands.length === 0) {
      console.log('MARS brand not found in database');
      return;
    }

    const marsId = brands[0].id;
    console.log('Found MARS brand with ID:', marsId);

    // 2. Find all global categories (brand_id = null)
    const { data: globalCats, error: catError } = await supabase
      .from('category_settings')
      .select('id, name, brand_id')
      .is('brand_id', null);

    if (catError) throw catError;
    console.log('Global categories found:', globalCats.map(c => c.name));

    // 3. The standard global categories to KEEP as global
    const globalNames = ['lips', 'eyes', 'face', 'kits', 'nails', 'skincare', 'tools', 'accessories'];

    // Find categories that should be moved to MARS (not in the standard list)
    const toMove = globalCats.filter(c => !globalNames.includes(c.name.toLowerCase()));
    
    if (toMove.length === 0) {
      console.log('No categories to move. All global categories appear to be standard ones.');
      console.log('The category you added might already be global. Checking all categories...');
      
      const { data: all } = await supabase.from('category_settings').select('id, name, brand_id, is_active');
      console.log('ALL categories in database:', all);
      return;
    }

    console.log('Categories to move to MARS:', toMove.map(c => c.name));

    // 4. Move them to MARS
    for (const cat of toMove) {
      const { error: updateError } = await supabase
        .from('category_settings')
        .update({ brand_id: marsId })
        .eq('id', cat.id);

      if (updateError) {
        console.error(`Failed to move category "${cat.name}":`, updateError.message);
      } else {
        console.log(`Moved "${cat.name}" to MARS successfully!`);
      }
    }

    console.log('\n--- DONE ---');
    console.log('Please refresh your brand page to see the categories!');

  } catch (err) {
    console.error('Script failed:', err.message);
  }
}

fixCategoryBrands();
