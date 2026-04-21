import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const getSampleImages = async () => {
  const categories = ['LIPS', 'EYES', 'FACE', 'NAILS', 'REMOVERS & WIPES', 'TOOLS & ACCESSORIES'];
  
  for (const cat of categories) {
    const { data } = await supabase
      .from('products')
      .select('image_url, name')
      .eq('category', cat)
      .limit(1);
    
    console.log(`Category: ${cat}`, data?.[0] || 'No product found');
  }
};

getSampleImages();
