import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, AlertCircle, ChevronRight, Home as HomeIcon, Lock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { getProductImageCandidates, FALLBACK_IMAGE } from '../lib/imageResolver';
import SmartProductImage from '../components/ui/SmartProductImage';
import SEO from '../components/SEO';

// ─── Lock Popup Modal ────────────────────────────────────────────────────────
const LockPopup = ({ isOpen, onClose, startTimeLeft }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        />
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="relative bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-accent/5 blur-3xl pointer-events-none" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white/60 hover:text-white transition-all"
          >
            <X size={16} />
          </button>

          <div className="w-16 h-16 bg-accent/10 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Lock size={28} className="text-accent" />
          </div>

          <h3 className="text-xl font-serif font-bold text-white mb-2">
            Offer Not Started Yet
          </h3>
          <p className="text-white/50 text-sm mb-6">
            This collection is locked. Come back when the offer goes live!
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] mb-2">
              Starting In
            </p>
            <div className="text-4xl font-mono font-bold text-accent tracking-wider drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
              {startTimeLeft}
            </div>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-widest transition-all"
          >
            Got it, I'll wait!
          </button>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// ─── Locked Product Card (upcoming) ─────────────────────────────────────────
const LockedProductCard = ({ product, discountPercentage, onLockedClick }) => {
  const originalPrice = parseFloat(product.price);
  const discountedPrice = Math.round(originalPrice - originalPrice * (discountPercentage / 100));
  const brandName = (product.brands?.name || product.brand || product.brand_name || '').trim();
  const imageCandidates = getProductImageCandidates(product);

  return (
    <div
      onClick={onLockedClick}
      className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-3 flex flex-col h-full border border-black/5 cursor-pointer group relative overflow-hidden select-none"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-3">
        <SmartProductImage
          candidates={imageCandidates}
          fallbackSrc={FALLBACK_IMAGE}
          alt={product.name}
          loading="lazy"
          className="blur-[2px] scale-105"
          objectFit="contain"
        />
        {/* Lock overlay */}
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30">
            <Lock size={18} className="text-white" />
          </div>
        </div>
        <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-[9px] font-bold rounded-lg">
          {discountPercentage}% OFF
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{brandName}</p>
        <p className="text-sm font-serif font-medium text-black line-clamp-2 h-10 leading-tight">
          {product.name}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold text-black">₹{discountedPrice}</span>
          <span className="text-[10px] text-gray-400 line-through">₹{originalPrice}</span>
        </div>
        <div className="mt-3 w-full py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 bg-gray-100 text-gray-400">
          <Lock className="w-3.5 h-3.5" /> Locked
        </div>
      </div>
    </div>
  );
};

// ─── Active Product Card (offer live — view only, no cart) ───────────────────
const ActiveProductCard = ({ product, discountPercentage }) => {
  const originalPrice = parseFloat(product.price);
  const discountedPrice = Math.round(originalPrice - originalPrice * (discountPercentage / 100));
  const brandName = (product.brands?.name || product.brand || product.brand_name || '').trim();
  const imageCandidates = getProductImageCandidates(product);

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.08)] p-3 flex flex-col h-full border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-white mb-3">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <SmartProductImage
            candidates={imageCandidates}
            fallbackSrc={FALLBACK_IMAGE}
            alt={product.name}
            loading="lazy"
            className="group-hover:scale-110 transition-transform duration-700"
            objectFit="contain"
          />
        </Link>
        <div className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-[9px] font-bold rounded-lg">
          {discountPercentage}% OFF
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">{brandName}</p>
        <Link
          to={`/product/${product.id}`}
          className="text-sm font-serif font-medium text-black line-clamp-2 h-10 group-hover:text-accent transition-colors block leading-tight"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold text-black">₹{discountedPrice}</span>
          <span className="text-[10px] text-gray-400 line-through">₹{originalPrice}</span>
        </div>
        <Link
          to={`/product/${product.id}`}
          className="mt-3 w-full py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-black"
        >
          View Product
        </Link>
      </div>
    </motion.div>
  );
};

// ─── Main Page ───────────────────────────────────────────────────────────────
const LimitedOfferPage = () => {
  const { id } = useParams();
  const [offer, setOffer] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState('');
  const [startTimeLeft, setStartTimeLeft] = useState('');
  const [status, setStatus] = useState('upcoming');
  const [lockPopupOpen, setLockPopupOpen] = useState(false);

  useEffect(() => {
    const fetchOfferData = async () => {
      setLoading(true);
      try {
        const { data: offerData, error: offerError } = await supabase
          .from('limited_offers')
          .select('*')
          .eq('id', id)
          .single();
        if (offerError) throw offerError;
        setOffer(offerData);

        if (offerData) {
          const { data: linkData, error: linkError } = await supabase
            .from('limited_offer_products')
            .select('product_id')
            .eq('offer_id', id);
          if (linkError) throw linkError;

          const productIds = linkData.map(l => l.product_id);
          if (productIds.length > 0) {
            const { data: productsData, error: productsError } = await supabase
              .from('products')
              .select('*')
              .in('id', productIds);
            if (productsError) throw productsError;
            setProducts(productsData || []);
          }
        }
      } catch (error) {
        console.error('Error fetching limited offer data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOfferData();
  }, [id]);

  useEffect(() => {
    if (!offer) return;

    const fmt = (ms) => {
      const d = Math.floor(ms / 86400000);
      const h = Math.floor((ms % 86400000) / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      return `${d > 0 ? d + 'd ' : ''}${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const tick = () => {
      const now = Date.now();
      const start = new Date(offer.start_time).getTime();
      const end = new Date(offer.end_time).getTime();
      if (now < start) {
        setStatus('upcoming');
        setStartTimeLeft(fmt(start - now));
      } else if (now >= start && now <= end) {
        setStatus('active');
        setTimeLeft(fmt(end - now));
      } else {
        setStatus('expired');
      }
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [offer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading Offer...</p>
      </div>
    );
  }

  if (!offer || status === 'expired') {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
          <AlertCircle size={40} className="text-gray-300" />
        </div>
        <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Offer Expired or Not Found</h2>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto">
          The limited time offer you are looking for has ended or doesn't exist.
        </p>
        <Link to="/" className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-xl">
          <HomeIcon size={16} /> Return Home
        </Link>
      </div>
    );
  }

  const isUpcoming = status === 'upcoming';

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      <SEO
        title={`Limited Offer — ${offer.discount_percentage}% OFF | Veda Beauty`}
        description={`Get ${offer.discount_percentage}% off selected premium beauty products at Veda Beauty.`}
      />

      {/* Lock Popup */}
      <LockPopup
        isOpen={lockPopupOpen}
        onClose={() => setLockPopupOpen(false)}
        startTimeLeft={startTimeLeft}
      />

      {/* Banner */}
      <div className="relative w-full h-[40vh] md:h-[50vh] bg-black overflow-hidden">
        <img
          src={offer.banner_url}
          alt="Limited Offer Banner"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end items-center pb-12 px-4 text-center">
          {isUpcoming ? (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-widest mb-4 border border-white/20">
                <Lock size={12} /> Offer Locked
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4">
                {offer.discount_percentage}% OFF — Coming Soon
              </h1>
              <div className="text-3xl md:text-5xl font-mono font-bold text-accent tracking-wider drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]">
                {startTimeLeft}
              </div>
              <p className="text-white/60 text-sm mt-3 uppercase tracking-widest font-bold">Starting In</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/90 backdrop-blur-md text-white rounded-full text-xs font-bold uppercase tracking-widest mb-4">
                <Clock size={16} className="animate-pulse" /> Ends In
              </div>
              <div className="text-4xl md:text-7xl font-mono font-bold text-accent tracking-wider drop-shadow-[0_0_15px_rgba(255,215,0,0.4)] mb-4">
                {timeLeft}
              </div>
              <h1 className="text-2xl md:text-4xl font-serif font-bold text-white">
                Exclusive {offer.discount_percentage}% OFF
              </h1>
            </>
          )}
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-400">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight size={12} />
          <span className="text-black">Limited Offer</span>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 mt-2">
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900">
              {isUpcoming ? 'Preview Collection' : 'Offer Products'}
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">
              {products.length} {products.length === 1 ? 'item' : 'items'} in this offer
              {isUpcoming && ' · Unlocks when offer starts'}
            </p>
          </div>
          {isUpcoming && (
            <div className="ml-auto inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 text-amber-600 rounded-full text-[10px] font-bold uppercase tracking-widest">
              <Lock size={12} /> Products Locked
            </div>
          )}
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {products.map(product =>
              isUpcoming ? (
                <LockedProductCard
                  key={product.id}
                  product={product}
                  discountPercentage={offer.discount_percentage}
                  onLockedClick={() => setLockPopupOpen(true)}
                />
              ) : (
                <ActiveProductCard
                  key={product.id}
                  product={product}
                  discountPercentage={offer.discount_percentage}
                />
              )
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-500 font-medium">No products have been added to this offer yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LimitedOfferPage;
