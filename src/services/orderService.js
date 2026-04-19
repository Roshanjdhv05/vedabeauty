import { supabase } from '../lib/supabase';

export const createOrder = async (orderData) => {
  try {
    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        user_id: orderData.user_id,
        customer_name: orderData.customer_name,
        total_amount: orderData.total_amount,
        status: 'pending',
        address_line1: orderData.address_line1,
        address_line2: orderData.address_line2,
        landmark: orderData.landmark,
        pincode: orderData.pincode,
        city: orderData.city,
        state: orderData.state,
        items: orderData.items,
        profit_amount: orderData.profit_amount || 0,
        items_count: orderData.items_count || 0
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    return { data: order, error: null };
  } catch (error) {
    console.error('Error creating order:', error);
    return { data: null, error };
  }
};


export const getUserOrders = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

