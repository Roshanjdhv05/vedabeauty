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
import OptimizedImage from '../components/ui/OptimizedImage';
import ProductCard from '../components/ui/ProductCard';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import ProductReviews from '../components/product/ProductReviews';
import SEO from '../components/SEO';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

/* ─── tiny skeleton ─── */
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />
);

/* ─── horizontal product row ─── */
const ProductRow = React.memo(({ title, products, loading }) => {
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
            <div key={`prod-${p.id}`} className="w-[170px] md:w-auto flex-shrink-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

/* ─── main page ─── */
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [product, setProduct]           = useState(null);
  const [similar, setSimilar]           = useState([]);
  const [recommended, setRecommended]   = useState([]);
  const [reviews, setReviews]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [simLoading, setSimLoading]     = useState(true);
  const [recLoading, setRecLoading]     = useState(true);
  const [addedToCart, setAddedToCart]   = useState(false);
  const [activeTab, setActiveTab]       = useState('description');
  const [activeSlide, setActiveSlide]   = useState(0);
  const [selectedVariants, setSelectedVariants] = useState({});
  const [showReturnPolicy, setShowReturnPolicy] = useState(false);
  const [errorMessage, setErrorMessage]         = useState('');
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
        // fetch similar, recommended, and reviews in parallel
        const [sim, rec, revs] = await Promise.all([
          getSimilarProducts(data.brand_id, data.id, 10),
          getRecommendedProducts(data.id, 10),
          import('../services/reviewService').then(m => m.getProductReviews(data.id))
        ]);
        setSimilar(sim);
        setSimLoading(false);
        setRecommended(rec);
        setRecLoading(false);
        setReviews(revs);
      } else {
        setSimLoading(false);
        setRecLoading(false);
      }
    };
    run();
  }, [id]);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : "4.5"; // Fallback to a nice default if no reviews yet

  const handleAddToCart = useCallback(() => {
    const variantGroups = {};
    const variants = product?.product_variants || [];
    variants.forEach(v => {
      const g = v.sub_product_name?.trim() || 'Default';
      if (!variantGroups[g]) variantGroups[g] = [];
      variantGroups[g].push(v);
    });

    if (variants.length > 0) {
      const requiredGroups = Object.keys(variantGroups);
      const selectedGroups = Object.keys(selectedVariants);
      const missingGroups = requiredGroups.filter(g => !selectedGroups.includes(g));

      if (missingGroups.length > 0) {
        // Create a user-friendly error message
        const missingNames = missingGroups.map(g => g === 'Default' ? 'Variant' : g).join(', ');
        setErrorMessage(`Please select an option for: ${missingNames}`);
        setTimeout(() => setErrorMessage(''), 4000);
        return;
      }
    }

    // For cart integration, if multiple variants, we combine their names
    const comboVariantName = Object.entries(selectedVariants)
      .map(([group, v]) => `${group !== 'Default' ? group + ': ' : ''}${v.name}`)
      .join(' + ');
    const firstVariant = Object.values(selectedVariants)[0];
    
    // Create a virtual combined variant for the cart
    const combinedVariant = firstVariant ? {
      ...firstVariant,
      id: Object.values(selectedVariants).map(v => v.id).join('-'),
      name: comboVariantName
    } : null;

    addToCart(product, combinedVariant?.id, combinedVariant);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }, [addToCart, product, selectedVariants]);

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
  const variants      = product.product_variants || [];
  const firstSelected = Object.values(selectedVariants)[0];
  const activePrice   = firstSelected?.selling_price || firstSelected?.price || product.selling_price || product.price;
  const originalPrice = firstSelected?.mrp_price || product.mrp_price || product.original_price || product.originalPrice;
  
  // Calculate dynamic discount if mrp and selling price are available
  let discount = product.discount || 0;
  if (originalPrice && activePrice && originalPrice > activePrice && !product.discount) {
    discount = Math.round(((originalPrice - activePrice) / originalPrice) * 100);
  }
  const brandName     = product.brands?.name || product.brand || '';
  const variantType   = variants[0]?.type || 'shade';

  // Group variants
  const variantGroups = {};
  variants.forEach(v => {
    const groupName = v.sub_product_name?.trim() || 'Default';
    if (!variantGroups[groupName]) variantGroups[groupName] = [];
    variantGroups[groupName].push(v);
  });

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
    // Add any additional gallery images stored in the DB
    if (Array.isArray(product.gallery_images) && product.gallery_images.length > 0) {
      productImages.push(...product.gallery_images);
    }
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

  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": productImages[0],
    "description": product.description || tabContent.description,
    "brand": {
      "@type": "Brand",
      "name": brandName
    },
    "offers": {
      "@type": "Offer",
      "url": window.location.href,
      "priceCurrency": "INR",
      "price": activePrice,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": avgRating,
      "reviewCount": reviews.length || 1
    }
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://vedabeauty.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": product.category || "Cosmetics",
        "item": `https://vedabeauty.in/category/${product.category}`
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": product.name,
        "item": window.location.href
      }
    ]
  };

  return (
    <div className="bg-white pb-28 md:pb-12 min-h-screen">
      <SEO 
        title={product.name}
        description={`Buy ${product.name} online at Veda Beauty. Premium quality ${product.category || 'cosmetic'} from ${brandName} at best prices in India. Fast delivery in Thane and Maharashtra.`}
        image={productImages[0]}
        keywords={`${product.name}, buy ${product.name} online, ${brandName} cosmetics, ${product.category} Thane, ${brandName} ${product.name}, best ${product.category} India, affordable ${product.category}, premium beauty ${brandName}, buy now ${product.name}, beauty deals online`}
        schemaData={[productSchema, breadcrumbSchema]}
      />

      {/* ─── Mobile top floating nav ─── */}
      <div className="md:hidden absolute top-20 left-0 w-full z-40 px-4 flex items-center justify-between pointer-events-none">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 transition-all active:scale-90 pointer-events-auto"
        >
          <ArrowLeft className="w-5 h-5 text-black" />
        </button>
        
        <button
          onClick={() => toggleWishlist(product)}
          className="p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 transition-all active:scale-90 pointer-events-auto"
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
                    <OptimizedImage
                      src={img}
                      alt={`${product.name} view ${i + 1}`}
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
                    <OptimizedImage
                      src={img}
                      alt={`thumb ${i + 1}`}
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
              <button 
                onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-1 bg-green-50 px-2.5 py-1 rounded-lg hover:bg-green-100 transition-colors"
              >
                <span className="text-green-700 font-bold text-sm">{avgRating}</span>
                <Star className="w-4 h-4 fill-green-700 text-green-700" />
              </button>
              <button 
                onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-gray-400 text-sm hover:text-black transition-colors"
              >
                {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-black">₹{activePrice}</span>
              {originalPrice && (
                <span className="text-xl text-gray-400 line-through">₹{originalPrice}</span>
              )}
              {discount > 0 && (
                <span className="text-green-600 font-bold text-base">{discount}% OFF</span>
              )}
            </div>

            {/* Variants Selector */}
            {variants.length > 0 && (
              <div className="mb-8">
                {Object.entries(variantGroups).map(([groupName, groupVariants]) => (
                  <div key={groupName} className="mb-6 last:mb-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                        Select {groupName !== 'Default' ? groupName : variantType === 'shade' ? 'Shade' : variantType === 'size' ? 'Size' : 'Volume'}
                      </h3>
                      {selectedVariants[groupName] && (
                        <span className="text-xs font-bold text-black">{selectedVariants[groupName].name}</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-3 overflow-x-auto no-scrollbar pb-2">
                      {groupVariants.map((v) => {
                        const isSelected = selectedVariants[groupName]?.id === v.id;
                        
                        if (v.type === 'shade') {
                          return (
                            <button
                              key={v.id}
                              onClick={() => {
                                setSelectedVariants(prev => ({...prev, [groupName]: v}));
                                setErrorMessage('');
                              }}
                              className={`group relative flex-shrink-0 w-14 h-14 rounded-full p-0.5 transition-all duration-500 ${
                                isSelected ? 'ring-2 ring-pink-500 ring-offset-2 scale-105' : 'hover:scale-110 grayscale-[0.2] hover:grayscale-0'
                              }`}
                            >
                              <div className="w-full h-full rounded-full overflow-hidden border border-gray-200 shadow-sm bg-white flex items-center justify-center">
                                {v.image_url ? (
                                  <img 
                                    src={v.image_url} 
                                    alt={v.name} 
                                    className="w-full h-full object-cover block"
                                    loading="eager"
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div 
                                  className={`${v.image_url ? 'hidden' : 'flex'} w-full h-full items-center justify-center text-[10px] font-bold text-gray-400`}
                                  style={{ backgroundColor: v.color_code || '#f3f4f6' }}
                                >
                                  {!v.color_code && v.name ? v.name.substring(0, 1).toUpperCase() : ''}
                                </div>
                              </div>
                              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-pink-500 transition-all ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`} />
                            </button>
                          );
                        }
                        
                        return (
                          <button
                            key={v.id}
                            onClick={() => {
                              setSelectedVariants(prev => ({...prev, [groupName]: v}));
                              setErrorMessage('');
                            }}
                            className={`flex-shrink-0 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest border-2 transition-all ${
                              isSelected 
                                ? 'border-pink-400 bg-pink-50 text-pink-600' 
                                : 'border-gray-100 bg-white text-gray-400 hover:border-gray-300'
                            }`}
                          >
                            {v.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

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
            {errorMessage && (
              <div className="hidden md:flex items-center gap-2 mt-4 text-red-500 text-[11px] font-bold uppercase tracking-widest bg-red-50 px-4 py-2 rounded-lg border border-red-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                {errorMessage}
              </div>
            )}
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
                {addedToCart ? 'Added!' : variants.length > 0 ? 'Add to Cart' : 'Add to Cart'}
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

            {/* Trust & Policy Info */}
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-tight">
                    Free delivery over ₹500
                  </span>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setShowReturnPolicy(!showReturnPolicy)}
                    className="flex items-center gap-2 group transition-all"
                  >
                    <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center group-hover:bg-red-100">
                      <RefreshCw className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-tight border-b border-dashed border-gray-300 group-hover:border-red-300">
                      Return Policy*
                    </span>
                  </button>

                  <AnimatePresence>
                    {showReturnPolicy && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute bottom-full right-0 mb-4 w-64 p-4 bg-white border border-gray-100 shadow-2xl rounded-2xl z-50 pointer-events-auto"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-4 h-4 text-orange-500" />
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest mb-1">Return Exceptions</h4>
                            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                              Products with damage, products with expiry, or products different from the order are accepted, else not.
                            </p>
                          </div>
                        </div>
                        <div className="absolute bottom-[-6px] right-8 w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-tight">
                    100% Authentic
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Product Reviews ─── */}
      <div id="reviews-section">
        <ProductReviews productId={product.id} />
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
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/95 backdrop-blur-md border-t border-gray-100 flex flex-col p-4 z-50">
        {errorMessage && (
          <div className="flex items-center gap-2 mb-3 text-red-500 text-[10px] font-bold uppercase tracking-widest bg-red-50 px-4 py-2.5 rounded-xl border border-red-100 animate-in fade-in slide-in-from-bottom-1 duration-300">
            <Shield className="w-3.5 h-3.5 flex-shrink-0" />
            {errorMessage}
          </div>
        )}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => toggleWishlist(product)}
            className={`flex-shrink-0 w-14 h-14 border rounded-2xl flex items-center justify-center transition-colors ${
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
            {addedToCart ? 'Added!' : variants.length > 0 ? 'Add to Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
