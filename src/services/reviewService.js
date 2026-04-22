import { supabase } from '../lib/supabase';

export const getProductReviews = async (productId) => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const submitReview = async (reviewData) => {
  try {
    const { data, error } = await supabase
      .from('product_reviews')
      .insert([reviewData])
      .select();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error submitting review:', error);
    return { data: null, error };
  }
};
