import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function deduplicate() {
  const { data: brand } = await supabase.from('brands').select('id, name').ilike('name', 'vega').single();
  if (!brand) { console.error('Vega brand not found'); return; }

  const { data: products } = await supabase.from('products').select('id, name, created_at').eq('brand_id', brand.id);
  
  const seen = new Set();
  const toDelete = [];

  // Sort by created_at so we keep the first one and delete the rest
  products.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  products.forEach(p => {
    if (seen.has(p.name)) {
      toDelete.push(p.id);
    } else {
      seen.add(p.name);
    }
  });

  console.log(`Found ${toDelete.length} duplicates to delete in Vega brand.`);

  let deleted = 0;
  for (let i = 0; i < toDelete.length; i += 100) {
    const batch = toDelete.slice(i, i + 100);
    const { error } = await supabase.from('products').delete().in('id', batch);
    if (error) {
      console.error('Error deleting batch:', error);
    } else {
      deleted += batch.length;
    }
  }

  console.log(`Deleted ${deleted} duplicate products successfully.`);
}

deduplicate();
