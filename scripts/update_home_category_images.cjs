const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vacfwszqcxbvfnaadagg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZhY2Z3c3pxY3hidmZuYWFkYWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDk2MTIsImV4cCI6MjA5MTkyNTYxMn0.1DJaBKSqmC6AzRlNkt-teMz6vmMfwtK-oIR_AAS3D7o'
);

// Mapping of category name -> local public image path
const CATEGORY_IMAGE_MAP = {
  'Lips':                '/category images/lip.jpg',
  'Eyes':                '/category images/eyes.jpg',
  'Face':                '/category images/face.jpg',
  'Nails':               '/category images/nails.jpg',
  'Removers & Wipes':    '/category images/removersandwioes.jfif',
  'Tools & Accessories': '/category images/toolsandaccessories.jpg',
};

async function updateCategoryImages() {
  console.log('Fetching global home categories from Supabase...');

  // Fetch all global categories (brand_id IS NULL)
  const { data, error } = await supabase
    .from('category_settings')
    .select('id, name, image_url')
    .is('brand_id', null);

  if (error) {
    console.error('Error fetching categories:', error.message);
    process.exit(1);
  }

  console.log(`Found ${data.length} global categories:`);
  data.forEach(c => console.log(`  - ${c.name} (current: ${c.image_url})`));

  let updatedCount = 0;

  for (const cat of data) {
    const newImage = CATEGORY_IMAGE_MAP[cat.name];
    if (!newImage) {
      console.log(`⚠️  No mapping found for category: "${cat.name}" — skipping`);
      continue;
    }

    const { error: updateError } = await supabase
      .from('category_settings')
      .update({ image_url: newImage })
      .eq('id', cat.id);

    if (updateError) {
      console.error(`❌ Failed to update "${cat.name}":`, updateError.message);
    } else {
      console.log(`✅ Updated "${cat.name}" → ${newImage}`);
      updatedCount++;
    }
  }

  console.log(`\nDone! Updated ${updatedCount}/${data.length} categories.`);
}

updateCategoryImages();
