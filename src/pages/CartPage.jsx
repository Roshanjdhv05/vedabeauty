import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, MapPin, Building, Home, CheckCircle2, ChevronLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createOrder } from '../services/orderService';

const CartPage = () => {
  const { cart, removeFromCart, cartTotal, addToCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    landmark: '',
    pincode: '',
    city: '',
    state: ''
  });

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=cart');
      return;
    }

    setIsSubmitting(true);
    
    const totalAmount = Math.round(cartTotal * 1.18);
    const itemsCount = cart.reduce((total, item) => total + item.quantity, 0);
    
    const orderData = {
      user_id: user.id,
      customer_name: user.email.split('@')[0], // Fallback name
      total_amount: totalAmount,
      profit_amount: Math.round(totalAmount * 0.15), // Estimated 15% profit margin
      items_count: itemsCount,
      address_line1: address.line1,
      address_line2: address.line2,
      landmark: address.landmark,
      pincode: address.pincode,
      city: address.city,
      state: address.state,
      items: cart
    };

    const { error } = await createOrder(orderData);
    
    if (error) {
      console.error('Checkout Error:', error);
      alert(`Failed to place order: ${error.message || 'Check your connection'}`);
      setIsSubmitting(false);
      return;
    }

    setOrderSuccess(true);
    clearCart();
    setIsSubmitting(false);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500" />
        </motion.div>
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Order Placed Successfully!</h2>
        <p className="text-gray-500 mb-10 max-w-sm mx-auto">Your order has been received and is being processed by our professional team. You'll receive updates soon.</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/" className="px-8 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-black transition-all">Continue Shopping</Link>
          <Link to="/profile" className="px-8 py-4 bg-gray-100 text-black rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-gray-200 transition-all">Track Order</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 max-w-xs">Looks like you haven't added anything to your cart yet.</p>
        <Link to="/" className="px-10 py-4 bg-black text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-black transition-all shadow-xl">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center gap-4 mb-8">
        {isCheckingOut && (
          <button 
            onClick={() => setIsCheckingOut(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-3xl font-bold tracking-tighter uppercase">
          {isCheckingOut ? 'Checkout Details' : `My Cart (${cart.length})`}
        </h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Cart Items OR Address Form */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {!isCheckingOut ? (
              <motion.div 
                key="cart-list"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 md:gap-6 p-4 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm md:text-lg font-bold text-black leading-tight line-clamp-2">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-accent font-bold uppercase tracking-widest mt-1">{item.brand || item.brand_name}</p>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <button 
                            onClick={() => removeFromCart(item.id)} // This will need a decrementQuantity instead
                            className="p-1.5 hover:bg-white rounded-lg transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                          <span className="px-4 font-bold text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item)}
                            className="p-1.5 hover:bg-white rounded-lg transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-black" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">₹{item.price * item.quantity}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">₹{item.price} Each</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="address-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">
                      <MapPin size={12} className="text-accent" />
                      Address Line 1*
                    </label>
                    <input 
                      type="text" required value={address.line1} onChange={(e) => setAddress({...address, line1: e.target.value})}
                      placeholder="Flat / House No. / Street"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">
                      <Building size={12} className="text-gray-400" />
                      Address Line 2
                    </label>
                    <input 
                      type="text" value={address.line2} onChange={(e) => setAddress({...address, line2: e.target.value})}
                      placeholder="Area / Sector / Apartment"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">
                      <Home size={12} className="text-gray-400" />
                      Landmark
                    </label>
                    <input 
                      type="text" value={address.landmark} onChange={(e) => setAddress({...address, landmark: e.target.value})}
                      placeholder="Nearby school, hospital, etc."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-2">Pincode*</label>
                    <input 
                      type="number" required value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})}
                      placeholder="6 Digit PIN"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-2">City*</label>
                    <input 
                      type="text" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-2">State*</label>
                    <input 
                      type="text" required value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-[2.5rem] p-8 sticky top-24 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold mb-8 tracking-tight border-b border-gray-200 pb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="text-black font-bold">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Shipping Fee</span>
                <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Free</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">GST (18%)</span>
                <span className="text-black font-bold">₹{(cartTotal * 0.18).toFixed(0)}</span>
              </div>
              <div className="pt-4 mt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-lg font-bold">Grand Total</span>
                <span className="text-2xl font-bold text-black">₹{(cartTotal * 1.18).toFixed(0)}</span>
              </div>
            </div>
            
            {!isCheckingOut ? (
              <button 
                onClick={() => setIsCheckingOut(true)}
                className="w-full bg-black text-white py-5 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-accent hover:text-black transition-all active:scale-95"
              >
                Go to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button 
                onClick={handleCheckout}
                disabled={isSubmitting || !address.line1 || !address.pincode}
                className="w-full bg-black text-white py-5 rounded-2xl flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-[0.2em] shadow-xl hover:bg-accent hover:text-black transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
            
            <div className="mt-8 flex flex-col gap-3">
               <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Safe Checkout Guarantee
               </div>
               <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                  Cash on Delivery Available
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

