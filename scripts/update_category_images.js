import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const updateCategoryImages = async () => {
  const updates = [
    { name: 'Lips', image_url: '/mars/cloud_kiss_lipstick.webp' },
    { name: 'Eyes', image_url: '/mars/36_color_eyeshadow_palette.webp' },
    { name: 'Face', image_url: '/mars/BB CREAM FOUNDATION.webp' },
    { name: 'Nails', image_url: '/mars/COLOR BOMB NAIL PAINT (1).webp' },
    { name: 'Removers & Wipes', image_url: '/mars/MAKEUP MELTING MICROFIBER WIPES.webp' },
    { name: 'Tools & Accessories', image_url: '/mars/TOOLS OF TITAN BRUSH SET.webp' },
  ];

  for (const update of updates) {
    const { error } = await supabase
      .from('category_settings')
      .update({ image_url: update.image_url })
      .eq('name', update.name)
      .is('brand_id', null);
    
    if (error) console.error(`Error updating ${update.name}:`, error);
    else console.log(`Updated image for ${update.name}`);
  }
};

updateCategoryImages();
