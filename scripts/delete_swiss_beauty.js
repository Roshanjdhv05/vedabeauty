import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env');
const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
const env = envLines.reduce((acc, line) => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function deleteSwissBeauty() {
  // Find the Swiss Beauty brand
  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('id, name')
    .ilike('name', '%swiss%')
    .single();

  if (brandError || !brand) {
    console.log('Swiss Beauty brand not found:', brandError?.message);
    return;
  }

  console.log(`Found brand: ${brand.name} (${brand.id})`);

  // Get all products for this brand
  const { data: products, error: prodError } = await supabase
    .from('products')
    .select('id, name')
    .eq('brand_id', brand.id);

  if (prodError) {
    console.error('Error fetching products:', prodError.message);
    return;
  }

  console.log(`Found ${products.length} products to delete.`);

  // Delete product variants first (FK constraint)
  if (products.length > 0) {
    const productIds = products.map(p => p.id);

    const { error: variantError } = await supabase
      .from('product_variants')
      .delete()
      .in('product_id', productIds);

    if (variantError) {
      console.error('Error deleting variants:', variantError.message);
    } else {
      console.log('Deleted all product variants.');
    }

    // Delete from cart & wishlist too
    await supabase.from('cart').delete().in('product_id', productIds);
    await supabase.from('wishlist').delete().in('product_id', productIds);

    // Delete all products
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('brand_id', brand.id);

    if (deleteError) {
      console.error('Error deleting products:', deleteError.message);
      return;
    }

    console.log(`Deleted ${products.length} products.`);
  }

  // Delete the brand itself
  const { error: deleteBrandError } = await supabase
    .from('brands')
    .delete()
    .eq('id', brand.id);

  if (deleteBrandError) {
    console.error('Error deleting brand:', deleteBrandError.message);
  } else {
    console.log(`Brand "${brand.name}" deleted successfully.`);
  }
}

deleteSwissBeauty();
