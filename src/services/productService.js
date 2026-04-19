import { supabase } from '../lib/supabase';

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, brands(name, logo_url)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
};

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, brands(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching product ${id}:`, error);
    return null;
  }
  return data;
};

export const getBrands = async () => {
  const { data: dbBrands, error } = await supabase
    .from('brands')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching brands:', error);
  }

  // If we have registered brands, use them
  if (dbBrands && dbBrands.length > 0) {
    return dbBrands;
  }

  // Fallback: Extract unique brands from products if brands table is empty
  const { data: products, error: prodError } = await supabase.from('products').select('brand_name');
  if (prodError) console.error("Error fetching product brand names:", prodError);
  
  if (products) {
    const uniqueBrandNames = [...new Set(products.map(p => p.brand_name).filter(Boolean))];
    return uniqueBrandNames.map((name) => ({
      id: `name_${name}`,
      name: name,
      logo_url: null
    }));
  }

  return [];
};

export const getProductsByBrand = async (brandId) => {
  if (brandId && brandId.startsWith('name_')) {
    const brandName = brandId.replace('name_', '');
    const { data, error } = await supabase
      .from('products')
      .select('*, brands(*)')
      .eq('brand_name', brandName);
      
    if (error) {
      console.error(`Error fetching products for brand name ${brandName}:`, error);
      return [];
    }
    
    // Polyfill the brand data so the BrandPage doesn't break
    return data.map(product => ({
      ...product,
      brands: { name: brandName, description: `Discover the best of ${brandName} beauty products.` }
    }));
  }

  const { data, error } = await supabase
    .from('products')
    .select('*, brands(*)')
    .eq('brand_id', brandId);

  if (error) {
    console.error(`Error fetching products for brand ${brandId}:`, error);
    return [];
  }
  return data;
};

// --- CART SERVICES ---

export const getCartItems = async (userId) => {
  const { data, error } = await supabase
    .from('cart')
    .select('*, products(*, brands(name))')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
  return data;
};

export const addToDBCart = async (userId, productId, quantity) => {
  const { data, error } = await supabase
    .from('cart')
    .upsert(
      { user_id: userId, product_id: productId, quantity },
      { onConflict: 'user_id, product_id' }
    )
    .select();

  if (error) console.error('Error adding to DB cart:', error);
  return { data, error };
};

export const removeFromDBCart = async (userId, productId) => {
  const { error } = await supabase
    .from('cart')
    .delete()
    .match({ user_id: userId, product_id: productId });

  if (error) console.error('Error removing from DB cart:', error);
  return { error };
};

export const clearDBCart = async (userId) => {
  const { error } = await supabase
    .from('cart')
    .delete()
    .eq('user_id', userId);

  if (error) console.error('Error clearing DB cart:', error);
  return { error };
};

export const getSimilarProducts = async (brandId, excludeId, limit = 8) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, brands(*)')
    .eq('brand_id', brandId)
    .neq('id', excludeId)
    .limit(limit);

  if (error) {
    console.error('Error fetching similar products:', error);
    return [];
  }
  return data;
};

export const getRecommendedProducts = async (excludeId, limit = 8) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, brands(*)')
    .neq('id', excludeId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching recommended products:', error);
    return [];
  }
  return data;
};

// --- WISHLIST SERVICES ---

export const getWishlistItems = async (userId) => {
  const { data, error } = await supabase
    .from('wishlist')
    .select('*, products(*, brands(name))')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching wishlist:', error);
    return [];
  }
  return data;
};

export const toggleDBWishlist = async (userId, productId, isAdding) => {
  if (isAdding) {
    const { data, error } = await supabase
      .from('wishlist')
      .upsert({ user_id: userId, product_id: productId })
      .select();
    if (error) console.error('Error adding to DB wishlist:', error);
    return { data, error };
  } else {
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .match({ user_id: userId, product_id: productId });
    if (error) console.error('Error removing from DB wishlist:', error);
    return { error };
  }
};

