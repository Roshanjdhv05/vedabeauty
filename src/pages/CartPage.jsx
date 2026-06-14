import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, MapPin, Building, Home, CheckCircle2, ChevronLeft, Loader2, Tag, X, Phone, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createOrder } from '../services/orderService';
import { getCartItemImageCandidates, FALLBACK_IMAGE } from '../lib/imageResolver';
import SmartProductImage from '../components/ui/SmartProductImage';
import { supabase } from '../lib/supabase';
import { openRazorpayCheckout } from '../utils/razorpay';

const CartPage = () => {
  const { cart, removeFromCart, cartTotal, addToCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  
  const [customerName, setCustomerName] = useState('');
  const [phoneCountry, setPhoneCountry] = useState({ code: '+91', digits: 10, label: '🇮🇳 India +91' });
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const COUNTRY_CODES = [
    { code: '+91',  digits: 10, label: '🇮🇳 +91' },
    { code: '+1',   digits: 10, label: '🇺🇸 +1' },
    { code: '+44',  digits: 10, label: '🇬🇧 +44' },
    { code: '+971', digits: 9,  label: '🇦🇪 +971' },
    { code: '+61',  digits: 9,  label: '🇦🇺 +61' },
    { code: '+65',  digits: 8,  label: '🇸🇬 +65' },
    { code: '+60',  digits: 9,  label: '🇲🇾 +60' },
    { code: '+880', digits: 10, label: '🇧🇩 +880' },
    { code: '+92',  digits: 10, label: '🇵🇰 +92' },
    { code: '+94',  digits: 9,  label: '🇱🇰 +94' },
    { code: '+977', digits: 10, label: '🇳🇵 +977' },
    { code: '+49',  digits: 10, label: '🇩🇪 +49' },
    { code: '+33',  digits: 9,  label: '🇫🇷 +33' },
    { code: '+81',  digits: 10, label: '🇯🇵 +81' },
    { code: '+86',  digits: 11, label: '🇨🇳 +86' },
  ];

  const handlePhoneChange = (val) => {
    const cleaned = val.replace(/\D/g, '');
    setPhoneNumber(cleaned);
    if (cleaned.length > 0 && cleaned.length !== phoneCountry.digits) {
      setPhoneError(`Enter a valid ${phoneCountry.digits}-digit number for ${phoneCountry.code}`);
    } else {
      setPhoneError('');
    }
  };

  const handleCountryChange = (e) => {
    const selected = COUNTRY_CODES.find(c => c.code === e.target.value);
    setPhoneCountry(selected);
    setPhoneNumber('');
    setPhoneError('');
  };

  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    landmark: '',
    pincode: '',
    city: '',
    state: ''
  });

  const [promoInput, setPromoInput] = useState('');
  const [applyingPromo, setApplyingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  const eligibleTotal = cart.reduce((total, item) => {
    // A product is considered on offer if it's explicitly marked or has a discount
    const isOffer = item.is_offer === true || (item.discount && item.discount > 0);
    if (!isOffer) {
      const itemPrice = item.variant?.price || item.price;
      return total + (itemPrice * item.quantity);
    }
    return total;
  }, 0);

  const discountAmount = appliedPromo ? Math.round(eligibleTotal * (appliedPromo.discount_percentage / 100)) : 0;

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    if (!user) {
      setPromoError('Please login to apply promo codes');
      return;
    }

    if (eligibleTotal === 0) {
      setPromoError('Promo codes cannot be applied to products already on offer');
      return;
    }

    setApplyingPromo(true);
    setPromoError('');

    try {
      const { data: promo, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', promoInput.toUpperCase().trim())
        .single();

      if (error || !promo) throw new Error('Invalid promo code');
      if (new Date(promo.expiry_date) < new Date()) throw new Error('This promo code has expired');

      const { data: usage } = await supabase
        .from('promo_code_usages')
        .select('id')
        .eq('promo_code_id', promo.id)
        .eq('user_email', user.email)
        .single();

      if (usage) throw new Error('You have already used this promo code');

      setAppliedPromo(promo);
      setPromoInput('');
    } catch (err) {
      setPromoError(err.message);
    } finally {
      setApplyingPromo(false);
    }
  };

  const removePromo = () => {
    setAppliedPromo(null);
    setPromoError('');
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=cart');
      return;
    }
    // Phone validation
    if (phoneNumber.length !== phoneCountry.digits) {
      setPhoneError(`Enter a valid ${phoneCountry.digits}-digit number for ${phoneCountry.code}`);
      return;
    }

    setIsSubmitting(true);
    
    const shippingFee = cartTotal < 500 ? 60 : 0;
    const totalAmount = cartTotal - discountAmount + shippingFee;
    const itemsCount = cart.reduce((total, item) => total + item.quantity, 0);

    const userDetails = {
      name: customerName.trim() || user.email.split('@')[0],
      email: user.email,
      contact: `${phoneCountry.code}${phoneNumber}`
    };

    openRazorpayCheckout(
      totalAmount,
      userDetails,
      async (paymentResponse) => {
        // Payment successful, now create the order
        const orderData = {
          user_id: user.id,
          customer_name: userDetails.name,
          phone: userDetails.contact,
          total_amount: totalAmount,
          profit_amount: Math.round(totalAmount * 0.15),
          items_count: itemsCount,
          address_line1: address.line1,
          address_line2: address.line2,
          landmark: address.landmark,
          pincode: address.pincode,
          city: address.city,
          state: address.state,
          items: cart,
          shipping_fee: shippingFee,
          promo_code_id: appliedPromo ? appliedPromo.id : null,
          discount_amount: discountAmount || 0,
          payment_id: paymentResponse.razorpay_payment_id
        };

        const { error } = await createOrder(orderData);
        
        if (error) {
          console.error('Checkout Error:', error);
          setPaymentError(`Payment was successful but failed to save order: ${error.message || 'Contact support'}`);
          setIsSubmitting(false);
          return;
        }

        if (appliedPromo) {
          await supabase.from('promo_code_usages').insert([{
            promo_code_id: appliedPromo.id,
            user_email: user.email
          }]);
        }

        setOrderSuccess(true);
        clearCart();
        setIsSubmitting(false);
      },
      (error) => {
        // Payment failed
        setPaymentError(error.description || 'Payment failed. Please try again.');
        setIsSubmitting(false);
      }
    );
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
                      <SmartProductImage
                        candidates={getCartItemImageCandidates(item)}
                        fallbackSrc={FALLBACK_IMAGE}
                        alt={item.name}
                        objectFit="cover"
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h3 className="text-sm md:text-lg font-bold text-black leading-tight line-clamp-2">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id, item.variant_id)}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <p className="text-[10px] text-accent font-bold uppercase tracking-widest mt-1">{item.brand || item.brand_name}</p>
                        {item.variant && (
                          <div className="mt-2 flex items-center gap-2">
                            {item.variant.color_code && (
                              <div className="w-3 h-3 rounded-full border border-gray-200" style={{ backgroundColor: item.variant.color_code }} />
                            )}
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              {item.variant.name}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                          <button 
                            onClick={() => removeFromCart(item.id, item.variant_id)} // This will need a decrementQuantity instead, but for now we follow the existing pattern
                            className="p-1.5 hover:bg-white rounded-lg transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-gray-400" />
                          </button>
                          <span className="px-4 font-bold text-xs">{item.quantity}</span>
                          <button 
                            onClick={() => addToCart(item, item.variant_id, item.variant)}
                            className="p-1.5 hover:bg-white rounded-lg transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-black" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">₹{(item.variant?.price || item.price) * item.quantity}</p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">₹{item.variant?.price || item.price} Each</p>
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
                {/* Section: Personal Info */}
                <div className="mb-6">
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-5">Personal Information</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Full Name */}
                    <div className="col-span-2 md:col-span-1">
                      <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">
                        <User size={12} className="text-accent" />
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="col-span-2 md:col-span-1">
                      <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">
                        <Phone size={12} className="text-accent" />
                        Phone Number *
                      </label>
                      <div className="flex gap-2">
                        {/* Country Code Select */}
                        <div className="relative flex-shrink-0">
                          <select
                            value={phoneCountry.code}
                            onChange={handleCountryChange}
                            className="appearance-none h-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-3 pr-6 text-xs font-semibold focus:outline-none focus:border-accent/50 transition-all cursor-pointer min-w-[80px]"
                          >
                            {COUNTRY_CODES.map(c => (
                              <option key={c.code} value={c.code}>{c.label}</option>
                            ))}
                          </select>
                          <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        {/* Phone Input */}
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => handlePhoneChange(e.target.value)}
                          placeholder={`${phoneCountry.digits}-digit number`}
                          maxLength={phoneCountry.digits}
                          className={`flex-1 bg-gray-50 border rounded-2xl py-4 px-4 text-xs focus:outline-none transition-all ${
                            phoneError ? 'border-red-300 focus:border-red-400' : 'border-gray-100 focus:border-accent/50'
                          }`}
                        />
                      </div>
                      {phoneError && (
                        <p className="text-[11px] text-red-500 font-semibold mt-2 ml-2">{phoneError}</p>
                      )}
                      {!phoneError && phoneNumber.length === phoneCountry.digits && (
                        <p className="text-[11px] text-green-500 font-semibold mt-2 ml-2 flex items-center gap-1">
                          <CheckCircle2 size={11} /> Valid number
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-2 mb-6" />

                {/* Section: Delivery Address */}
                <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em] mb-5">Delivery Address</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">
                      <MapPin size={12} className="text-accent" />
                      Address Line 1 *
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
                      Address Line 2 *
                    </label>
                    <input 
                      type="text" required value={address.line2} onChange={(e) => setAddress({...address, line2: e.target.value})}
                      placeholder="Area / Sector / Apartment"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-2">
                      <Home size={12} className="text-gray-400" />
                      Landmark *
                    </label>
                    <input 
                      type="text" required value={address.landmark} onChange={(e) => setAddress({...address, landmark: e.target.value})}
                      placeholder="Nearby school, hospital, etc."
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-2">Pincode *</label>
                    <input 
                      type="text"
                      required
                      value={address.pincode}
                      onChange={(e) => setAddress({...address, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                      placeholder="6 Digit PIN"
                      maxLength={6}
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-2">City *</label>
                    <input 
                      type="text" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})}
                      placeholder="City name"
                      className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 block ml-2">State *</label>
                    <input 
                      type="text" required value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})}
                      placeholder="State name"
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
              
              {appliedPromo && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <Tag size={14} /> {appliedPromo.code} ({appliedPromo.discount_percentage}%)
                  </span>
                  <span className="text-green-600 font-bold">-₹{discountAmount}</span>
                </div>
              )}
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 font-medium">Shipping Fee</span>
                {cartTotal < 500 ? (
                  <span className="text-black font-bold">₹60</span>
                ) : (
                  <span className="text-green-600 font-bold uppercase tracking-widest text-[10px]">Free</span>
                )}
              </div>
              
              {!appliedPromo && !isCheckingOut && (
                <div className="pt-2">
                  <div className="flex flex-col gap-3">
                    <input 
                      type="text" 
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                      placeholder="Enter Promo Code"
                      className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors font-bold uppercase"
                    />
                    <button 
                      onClick={handleApplyPromo}
                      disabled={applyingPromo || !promoInput.trim()}
                      className="w-full py-3 bg-black text-white rounded-xl text-xs font-bold uppercase tracking-widest disabled:opacity-50 hover:bg-accent hover:text-black transition-colors flex items-center justify-center"
                    >
                      {applyingPromo ? <Loader2 size={14} className="animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                  {promoError && <p className="text-xs text-red-500 mt-2 font-medium">{promoError}</p>}
                </div>
              )}
              
              {appliedPromo && !isCheckingOut && (
                <div className="pt-2">
                  <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle2 size={16} />
                      <span className="text-xs font-bold uppercase tracking-widest">Promo Applied!</span>
                    </div>
                    <button onClick={removePromo} className="text-green-700 hover:text-red-500 p-1 transition-colors">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div className="pt-4 mt-4 border-t border-gray-200">
                <div className="flex justify-center mb-2">
                  <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Tax are included in this order</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Grand Total</span>
                  <span className="text-2xl font-bold text-black">
                    ₹{(cartTotal - discountAmount + (cartTotal < 500 ? 60 : 0)).toFixed(0)}
                  </span>
                </div>
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
                disabled={
                  isSubmitting ||
                  !customerName.trim() ||
                  phoneNumber.length !== phoneCountry.digits ||
                  !!phoneError ||
                  !address.line1 ||
                  !address.line2 ||
                  !address.landmark ||
                  !address.pincode ||
                  !address.city ||
                  !address.state
                }
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

      {/* Error Modal */}
      <AnimatePresence>
        {paymentError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative"
            >
              <button 
                onClick={() => setPaymentError(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
              >
                <X size={20} />
              </button>
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">Payment Failed</h3>
              <p className="text-gray-500 mb-6 text-sm leading-relaxed">{paymentError}</p>
              <button 
                onClick={() => setPaymentError(null)}
                className="w-full bg-black text-white py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-accent hover:text-black transition-all"
              >
                Try Again
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CartPage;

