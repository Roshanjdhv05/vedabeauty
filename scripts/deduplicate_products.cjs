
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const content = fs.readFileSync('.env', 'utf8');
const env = {};
content.split('\n').forEach(line => {
  const [k, v] = line.split('=');
  if (k && v) env[k.trim()] = v.trim();
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function deduplicate() {
  console.log('Fetching products...');
  const { data, error } = await supabase.from('products').select('id, name');
  
  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  const seen = new Set();
  const toDelete = [];

  data.forEach(p => {
    if (seen.has(p.name)) {
      toDelete.push(p.id);
    } else {
      seen.add(p.name);
    }
  });

  console.log(`Found ${toDelete.length} duplicates to delete.`);

  if (toDelete.length === 0) {
    console.log('No duplicates found.');
    return;
  }

  // Delete in batches of 100
  for (let i = 0; i < toDelete.length; i += 100) {
    const batch = toDelete.slice(i, i + 100);
    console.log(`Deleting batch ${i / 100 + 1}...`);
    const { error: delError } = await supabase.from('products').delete().in('id', batch);
    if (delError) {
      console.error('Error deleting duplicates:', delError);
      if (delError.code === '42501') {
        console.log('RLS policy prevents deletion. Please check Supabase dashboard.');
      }
      break;
    }
  }

  console.log('Deduplication complete.');
}

deduplicate();
