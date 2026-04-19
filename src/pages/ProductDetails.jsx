import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import {
  Heart, ShoppingBag, Star, ArrowLeft, Shield,
  Truck, RefreshCw, ChevronRight, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  getProductById,
  getSimilarProducts,
  getRecommendedProducts
} from '../services/productService';
import { getMarsImages } from '../lib/marsImages';
import ProductCard from '../components/ui/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/* ─── tiny skeleton ─── */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
);

/* ─── horizontal product row ─── */
const ProductRow = ({ title, products, loading }) => {
  if (loading) {
    return (
      <section className="py-8 border-t border-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-6 w-48 mb-6" />
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[160px] flex-shrink-0">
                <Skeleton className="aspect-[4/5] w-full mb-3" />
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <section className="py-10 border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-black tracking-tight">{title}</h2>
          <Link
            to="/"
            className="text-sm font-semibold text-[var(--color-accent,#D4AF37)] flex items-center gap-1 hover:underline"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 lg:grid-cols-5">
          {products.map((p) => (
            <div key={p.id} className="w-[170px] md:w-auto flex-shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ─── main page ─── */
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct]           = useState(null);
  const [similar, setSimilar]           = useState([]);
  const [recommended, setRecommended]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [simLoading, setSimLoading]     = useState(true);
  const [recLoading, setRecLoading]     = useState(true);
  const [addedToCart, setAddedToCart]   = useState(false);
  const [activeTab, setActiveTab]       = useState('description');
  const [activeSlide, setActiveSlide]   = useState(0);
  const swiperRef                       = useRef(null);

  /* ── fetch main product ── */
  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setSimLoading(true);
      setRecLoading(true);
      setActiveSlide(0);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      const data = await getProductById(id);
      setProduct(data);
      setLoading(false);

      if (data) {
        // fetch similar (same brand) and recommended in parallel
        const [sim, rec] = await Promise.all([
          getSimilarProducts(data.brand_id, data.id, 10),
          getRecommendedProducts(data.id, 10),
        ]);
        setSimilar(sim);
        setSimLoading(false);
        setRecommended(rec);
        setRecLoading(false);
      } else {
        setSimLoading(false);
        setRecLoading(false);
      }
    };
    run();
  }, [id]);

  const handleAddToCart = useCallback(() => {
    addToCart(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [addToCart, product]);

  const isWishlisted = product ? isInWishlist(product.id) : false;

  /* ── loading skeleton ── */
  if (loading) {
    return (
      <div className="bg-white min-h-screen pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto md:px-4 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
            <Skeleton className="aspect-square w-full md:rounded-3xl" />
            <div className="px-4 md:px-0 pt-4 md:pt-0 flex flex-col gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-8 w-1/2" />
              <Skeleton className="h-32 w-full mt-4" />
              <Skeleton className="h-14 w-full mt-4 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── not found ── */
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-gray-500">
        <Package className="w-16 h-16 text-gray-200" />
        <p className="text-lg font-medium">Product not found.</p>
        <button
          onClick={() => navigate('/')}
          className="px-8 py-3 bg-black text-white rounded-full font-semibold hover:opacity-80 transition-all"
        >
          Back to Home
        </button>
      </div>
    );
  }

  /* ── normalise DB fields ── */
  const price         = product.price;
  const originalPrice = product.original_price || product.originalPrice;
  const discount      = product.discount || 0;
  const brandName     = product.brands?.name || product.brand || '';

  // ── Resolve gallery images ──────────────────────────────────────────────
  // For MARS products: use local /mars/ images mapped by name
  // For other brands:  use the Supabase image_url + a single generic fallback
  const isMars = brandName.toUpperCase().includes('MARS');
  const marsLocalImages = isMars ? getMarsImages(product.name) : [];

  let productImages = [];
  
  // Prioritise local images for Mars
  if (isMars && marsLocalImages.length > 0) {
    productImages = [...marsLocalImages];
    // Add the DB image_url only if it's not already in the local set and is NOT an Unsplash placeholder
    if (product.image_url && 
        !marsLocalImages.includes(product.image_url) && 
        !product.image_url.includes('unsplash.com')) {
      productImages.push(product.image_url);
    }
  } else if (product.image_url) {
    productImages.push(product.image_url);
  }

  if (productImages.length === 0) {
    productImages = ['https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800'];
  }

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'how_to_use',  label: 'How to Use' },
  ];

  const tabContent = {
    description: `Discover the ultimate secret to radiant skin. This premium formula is enriched with natural botanicals and advanced scientific complexes to deliver visible results within 7 days. Dermatologically tested and suitable for all skin types. Free from parabens, sulphates, and harsh chemicals.`,
    ingredients: `Aqua, Glycerin, Niacinamide, Hyaluronic Acid, Panthenol, Allantoin, Carbomer, Sodium Hyaluronate, Aloe Barbadensis Leaf Extract, Tocopheryl Acetate (Vitamin E), Retinyl Palmitate (Vitamin A), Phenoxyethanol, Ethylhexylglycerin.`,
    how_to_use: `1. Cleanse your face thoroughly.\n2. Apply a small amount to damp skin.\n3. Gently massage in circular motions for 60 seconds.\n4. Rinse off or leave on as directed.\n5. Follow with moisturiser and SPF.\n\nFor best results, use twice daily — morning and night.`,
  };

  return (
    <div className="bg-white pb-28 md:pb-12 min-h-screen">

      {/* ─── Mobile top nav ─── */}
      <div className="md:hidden sticky top-16 z-40 bg-white/90 backdrop-blur-md px-4 py-2 flex items-center justify-between border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-semibold text-gray-700 line-clamp-1 max-w-[180px]">{product.name}</span>
        <button
          onClick={() => toggleWishlist(product)}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>
      </div>

      <div className="max-w-7xl mx-auto md:px-4 md:py-10 lg:py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-20">

          {/* ─── 1. Image gallery ─── */}
          <div>
            {/* Main swiper */}
            <div className="relative">
              <Swiper
                modules={[Pagination, Navigation]}
                pagination={productImages.length > 1 ? { clickable: true } : false}
                navigation={productImages.length > 1}
                onSwiper={(swiper) => { swiperRef.current = swiper; }}
                onSlideChange={(swiper) => setActiveSlide(swiper.activeIndex)}
                className="aspect-square w-full md:rounded-3xl overflow-hidden shadow-md"
              >
                {productImages.map((img, i) => (
                  <SwiperSlide key={i}>
                    <img
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=800';
                      }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Discount badge */}
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black text-white text-xs font-bold rounded-full shadow">
                  {discount}% OFF
                </div>
              )}

              {/* Photo count badge */}
              {productImages.length > 1 && (
                <div className="absolute top-4 right-4 z-10 px-2.5 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  {activeSlide + 1} / {productImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail strip — visible whenever there are multiple images */}
            {productImages.length > 1 && (
              <div className="flex gap-2 mt-3 px-1 overflow-x-auto no-scrollbar pb-1">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setActiveSlide(i);
                      swiperRef.current?.slideTo(i);
                    }}
                    className={`flex-shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      activeSlide === i
                        ? 'border-black scale-105 shadow-md'
                        : 'border-transparent opacity-60 hover:opacity-100 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`thumb ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=200';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── 2. Product info ─── */}
          <div className="px-4 md:px-0 flex flex-col pt-4 md:pt-0">

            {/* Brand */}
            <Link
              to={product.brand_id ? `/brand/${product.brand_id}` : '#'}
              className="flex items-center gap-3 w-fit group mb-4"
            >
              {product.brands?.logo_url && product.brands.logo_url !== '/brands/default_logo.png' && (
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 shadow-sm bg-white p-0.5">
                  <img src={product.brands.logo_url} alt={brandName} className="w-full h-full object-contain rounded-full" />
                </div>
              )}
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4AF37] group-hover:underline">
                {brandName}
              </span>
            </Link>

            {/* Name */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-black mb-4 leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-lg">
                <span className="text-green-700 font-bold text-sm">4.5</span>
                <Star className="w-4 h-4 fill-green-700 text-green-700" />
              </div>
              <span className="text-gray-400 text-sm">842 Reviews</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-3xl font-bold text-black">₹{price}</span>
              {originalPrice && (
                <span className="text-xl text-gray-400 line-through">₹{originalPrice}</span>
              )}
              {discount > 0 && (
                <span className="text-green-600 font-bold text-base">{discount}% OFF</span>
              )}
            </div>

            {/* Tabs */}
            <div className="mb-4">
              <div className="flex gap-1 bg-gray-50 rounded-xl p-1 mb-5">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white text-black shadow-sm'
                        : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="text-gray-600 text-sm leading-relaxed whitespace-pre-line min-h-[80px]"
                >
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Desktop CTA buttons */}
            <div className="hidden md:flex gap-4 mt-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 font-bold rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 ${
                  addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-black text-white hover:opacity-90'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                {addedToCart ? 'Added!' : 'Add to Cart'}
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className={`w-14 h-14 border rounded-2xl flex items-center justify-center transition-colors ${
                  isWishlisted
                    ? 'border-red-200 bg-red-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-gray-100">
              {[
                { icon: Shield,    label: '100% Authentic' },
                { icon: Truck,     label: 'Free Delivery'  },
                { icon: RefreshCw, label: 'Easy Returns'   },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <span className="text-[10px] md:text-xs font-medium text-gray-500 uppercase tracking-tight leading-tight">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Similar Products (same brand) ─── */}
      <ProductRow
        title={`More from ${brandName}`}
        products={similar}
        loading={simLoading}
      />

      {/* ─── Recommended for You ─── */}
      <ProductRow
        title="You Might Also Like"
        products={recommended}
        loading={recLoading}
      />

      {/* ─── Mobile sticky CTA ─── */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 flex items-center gap-3 p-4 z-50">
        <button
          onClick={() => toggleWishlist(product)}
          className={`w-14 h-14 border rounded-2xl flex items-center justify-center transition-colors ${
            isWishlisted ? 'border-red-200 bg-red-50' : 'border-gray-200 hover:bg-gray-50'
          }`}
        >
          <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
        </button>

        <button
          onClick={handleAddToCart}
          className={`flex-1 h-14 font-bold rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 ${
            addedToCart ? 'bg-green-500 text-white' : 'bg-black text-white'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          {addedToCart ? 'Added!' : 'Add to Cart'}
        </button>

        <button className="flex-1 h-14 bg-[#F8C8DC] text-black font-bold rounded-2xl active:scale-95 transition-transform">
          Buy Now
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;
