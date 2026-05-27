import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual .env parser for scripts
const envPath = path.resolve(process.cwd(), '.env');
const envLines = fs.readFileSync(envPath, 'utf8').split('\n');
const env = envLines.reduce((acc, line) => {
  const [key, ...valueParts] = line.split('=');
  const value = valueParts.join('=');
  if (key && value) acc[key.trim()] = value.trim();
  return acc;
}
, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function removeSugarPop() {
  console.log('Fetching Sugar Pop brand...');
  const { data: brand, error: brandError } = await supabase
    .from('brands')
    .select('id, name')
    .eq('name', 'Sugar Pop')
    .maybeSingle();

  if (brandError) {
    console.error('Error fetching brand:', brandError.message);
    return;
  }

  if (!brand) {
    console.log('Sugar Pop brand not found in database.');
    return;
  }

  const brandId = brand.id;
  console.log(`Found Sugar Pop brand (ID: ${brandId}).`);

  // 1. Fetch all products under this brand
  console.log('Fetching products...');
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name')
    .eq('brand_id', brandId);

  if (productsError) {
    console.error('Error fetching products:', productsError.message);
    return;
  }

  console.log(`Found ${products.length} products to delete.`);
  const productIds = products.map(p => p.id);

  if (productIds.length > 0) {
    // 2. Delete product variants
    console.log('Deleting product variants...');
    const { error: varError } = await supabase
      .from('product_variants')
      .delete()
      .in('product_id', productIds);
    if (varError) {
      console.warn('Warning deleting variants:', varError.message);
    } else {
      console.log('Product variants deleted successfully.');
    }

    // 3. Delete from cart
    console.log('Deleting from cart...');
    const { error: cartError } = await supabase
      .from('cart')
      .delete()
      .in('product_id', productIds);
    if (cartError) {
      console.warn('Warning deleting from cart:', cartError.message);
    } else {
      console.log('Cart items deleted successfully.');
    }

    // 4. Delete from wishlist
    console.log('Deleting from wishlist...');
    const { error: wishError } = await supabase
      .from('wishlist')
      .delete()
      .in('product_id', productIds);
    if (wishError) {
      console.warn('Warning deleting from wishlist:', wishError.message);
    } else {
      console.log('Wishlist items deleted successfully.');
    }

    // 5. Delete products
    console.log('Deleting products...');
    const { error: prodDeleteError } = await supabase
      .from('products')
      .delete()
      .eq('brand_id', brandId);
    if (prodDeleteError) {
      console.error('Error deleting products:', prodDeleteError.message);
      return;
    }
    console.log('Products deleted successfully.');
  }

  // 6. Delete from category_settings
  console.log('Deleting brand category settings...');
  const { error: catError } = await supabase
    .from('category_settings')
    .delete()
    .eq('brand_id', brandId);
  if (catError) {
    console.warn('Warning deleting category settings:', catError.message);
  } else {
    console.log('Category settings deleted successfully.');
  }

  // 7. Delete the brand
  console.log('Deleting Sugar Pop brand...');
  const { error: brandDeleteError } = await supabase
    .from('brands')
    .delete()
    .eq('id', brandId);
  if (brandDeleteError) {
    console.error('Error deleting brand:', brandDeleteError.message);
    return;
  }
  console.log('Sugar Pop brand deleted successfully!');
}

removeSugarPop();
