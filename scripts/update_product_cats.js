import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const updateProductCategories = async () => {
  // Put face kit inside face
  const { data: faceData, error: faceError } = await supabase
    .from('products')
    .update({ category: 'FACE' })
    .eq('category', 'FACE KITS')
    .select();
  
  if (faceError) console.error('Error updating face kits:', faceError);
  else console.log(`Updated ${faceData.length} FACE KITS to FACE.`);

  // Combine brushes, sponges, blenders, accessories into TOOLS & ACCESSORIES
  const toolsCategoriesToUpdate = ['TOOLS & BRUSHES', 'SPONGES & BLENDERS', 'ACCESSORIES', 'Brushes', 'Tools & Accessories'];
  
  const { data: toolsData, error: toolsError } = await supabase
    .from('products')
    .update({ category: 'TOOLS & ACCESSORIES' })
    .in('category', toolsCategoriesToUpdate)
    .select();
    
  if (toolsError) console.error('Error updating tools & accessories:', toolsError);
  else console.log(`Updated ${toolsData.length} items to TOOLS & ACCESSORIES.`);
  
  // What about 'REMOVERS & WIPES', 'NAILS', 'LIPS', 'EYES'? They remain as is.
};

updateProductCategories();
