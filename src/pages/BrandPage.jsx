import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Flame, Trophy, Tag,
  SlidersHorizontal, X, Search, Sparkles, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductsByBrand } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import { supabase } from '../lib/supabase';

/* ─────────────────────────────────────────────────
   CONSTANTS & DESIGN SYSTEM
   Primary: #F8C8DC, Secondary: #000000, Accent: #D4AF37
───────────────────────────────────────────────── */
const CATEGORY_IMAGES = {
  Lips:        'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400',
  Eyes:        'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=400',
  Face:        'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400',
  Kits:        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400',
  Nails:       'https://images.unsplash.com/photo-1634749377443-6902409746e0?auto=format&fit=crop&q=80&w=400',
  Skincare:    'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=400',
  Tools:       'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=400',
  Accessories: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400',
};

const PRICE_TABS = [
  { id: 99,  label: 'Under ₹99'  },
  { id: 199, label: 'Under ₹199' },
  { id: 299, label: 'Under ₹299' },
  { id: 499, label: 'Under ₹499' },
];

const SORT_OPTIONS = [
  { val: 'default',    label: 'Default'    },
  { val: 'price_asc',  label: 'Price ↑'    },
  { val: 'price_desc', label: 'Price ↓'    },
  { val: 'discount',   label: 'Best Deals' },
];

const PAGE_SIZE = 12;

/* ─────────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────────── */

const SectionHeader = ({ icon: Icon, title, subtitle, accentClass = 'text-black' }) => (
  <div className="flex flex-col mb-4 px-4">
    <div className="flex items-center gap-2">
      <Icon className={`w-5 h-5 ${accentClass}`} />
      <h2 className="text-xl font-bold text-black">{title}</h2>
    </div>
    {subtitle && <p className="text-sm text-gray-400 mt-0.5 ml-7">{subtitle}</p>}
  </div>
);

const BrandHero = ({ brandData, productCount, onBack }) => {
  const brandName = brandData?.name || 'Brand';
  const bannerImg = brandData?.banner_url || 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=1200';
  
  return (
    <div className="relative w-full h-[220px] md:h-[350px] overflow-hidden">
      {/* Background Banner */}
      <img 
        src={bannerImg} 
        alt={brandName} 
        className="w-full h-full object-cover"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors z-20"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      {/* Content */}
      <div className="absolute inset-0 flex items-end justify-between px-4 pb-6 md:px-10 md:pb-12">
        <div className="flex items-center gap-3 md:gap-5">
          {/* Brand Logo */}
          <div className="w-12 h-12 md:w-16 md:h-16 bg-white rounded-full p-1.5 shadow-lg flex-shrink-0 overflow-hidden">
            <img 
              src={brandData?.logo_url || 'https://via.placeholder.com/64'} 
              alt={brandName} 
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          
          <div className="flex flex-col text-white">
            <h1 className="text-xl md:text-3xl font-bold leading-tight">{brandName}</h1>
            <p className="text-xs md:text-sm text-white/80 line-clamp-2 max-w-xs md:max-w-md mt-0.5">
              {brandData?.description || `Discover the best of ${brandName} beauty products.`}
            </p>
          </div>
        </div>

        {/* Product Count Badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white text-xs font-bold">
          <ShoppingBag className="w-3.5 h-3.5" />
          {productCount} Products
        </div>
        <div className="sm:hidden px-2.5 py-1 bg-[#F8C8DC] text-black text-[10px] font-bold rounded-full">
          {productCount} Items
        </div>
      </div>
    </div>
  );
};

const CategoryScroller = ({ categories, onSelect, categoryImages }) => (
  <section className="mt-6">
    <SectionHeader icon={Sparkles} title="Shop by Category" accentClass="text-[#D4AF37]" />
    <div className="flex gap-4 overflow-x-auto no-scrollbar px-4 pb-4 items-start">
      {categories.filter(c => c !== 'All').map(cat => (
        <motion.button
          key={cat}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat)}
          className="flex-shrink-0 flex flex-col items-center gap-3 w-[80px] md:w-[100px]"
        >
          <div className="aspect-square w-full rounded-2xl bg-white flex items-center justify-center overflow-hidden border border-[#F8C8DC]/30 shadow-sm p-4 transition-all hover:border-[#F8C8DC] hover:shadow-md">
            <img 
              src={categoryImages[cat] ?? DEFAULT_CATEGORY_IMAGES[cat] ?? DEFAULT_CATEGORY_IMAGES.Face} 
              alt={cat}
              className="w-full h-full object-cover rounded-xl transition-transform duration-500 hover:scale-110"
            />
          </div>
          <span className="text-[11px] md:text-sm font-semibold text-gray-700 text-center leading-tight">
            {cat}
          </span>
        </motion.button>
      ))}
    </div>
  </section>
);

const BrandPage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading]         = useState(true);

  const [filterCat,   setFilterCat]   = useState('All');
  const [sortBy,      setSortBy]      = useState('default');
  const [search,      setSearch]      = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [vfmTab,      setVfmTab]      = useState(299);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerRow, setItemsPerRow] = useState(2);
  const [categoryImages, setCategoryImages] = useState({});

  useEffect(() => {
    const fetchCategoryImages = async () => {
      try {
        // ONLY fetch categories for THIS specific brand
        const { data, error } = await supabase
          .from('category_settings')
          .select('name, image_url')
          .eq('brand_id', id)
          .eq('is_active', true);

        if (error) throw error;

        console.log('Categories found for this brand:', data);

        const imgMap = data.reduce((acc, curr) => {
          acc[curr.name] = curr.image_url;
          return acc;
        }, {});

        setCategoryImages(imgMap);
      } catch (err) {
        console.error('Error fetching brand category images:', err);
      }
    };
    if (id) fetchCategoryImages();
  }, [id]);

  // Detect items per row for "7 rows" calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setItemsPerRow(5);
      else if (window.innerWidth >= 768) setItemsPerRow(4);
      else setItemsPerRow(2);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const pageSize = itemsPerRow * 7;

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const data = await getProductsByBrand(id);
      if (!cancelled) { setAllProducts(data); setLoading(false); }
    };
    run();
    return () => { cancelled = true; };
  }, [id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterCat, sortBy, search]);

  const brandData = allProducts[0]?.brands ?? null;
  const brandName = brandData?.name ?? 'Brand';

  // Only show categories explicitly added by admin in database
  const explicitCats = Object.keys(categoryImages).sort();
  const uniqueCats = ['All', ...explicitCats];

  const trending    = allProducts.slice(0, 10);
  const bestSellers = [...allProducts]
    .sort((a, b) => (b.reviews_count ?? 0) - (a.reviews_count ?? 0))
    .slice(0, 8);

  const vfmProducts = allProducts
    .filter(p => (p.discount ?? 0) > 0 && p.price <= vfmTab)
    .sort((a, b) => (b.discount ?? 0) - (a.discount ?? 0))
    .slice(0, 10);

  const filtered = allProducts
    .filter(p => filterCat === 'All' || p.category === filterCat)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()));

  const sortedAll = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc')  return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'discount')   return (b.discount ?? 0) - (a.discount ?? 0);
    return 0;
  });

  const totalPages = Math.ceil(sortedAll.length / pageSize);
  const pagedProducts = sortedAll.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleCategorySelect = (cat) => {
    setFilterCat(cat);
    document.getElementById('all-products-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    document.getElementById('all-products-grid')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="animate-pulse">
          <div className="h-[220px] bg-gray-200" />
          <div className="px-4 py-8 space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="aspect-square bg-gray-100 rounded-xl" />)}
            </div>
            <div className="h-64 bg-gray-50 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* 1. BRAND HERO SECTION */}
      <BrandHero 
        brandData={brandData} 
        productCount={allProducts.length} 
        onBack={() => navigate(-1)} 
      />

      {/* 2. SHOP BY CATEGORY (Only show if admin has configured categories) */}
      {explicitCats.length > 0 && (
        <CategoryScroller categories={uniqueCats} onSelect={handleCategorySelect} categoryImages={categoryImages} />
      )}

      {/* 3. TRENDING NOW */}
      {trending.length > 0 && (
        <section className="mt-8">
          <SectionHeader icon={Flame} title="Trending Now" subtitle="Hottest picks" accentClass="text-orange-500" />
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
            {trending.map(product => (
              <div key={product.id} className="w-[180px] md:w-[calc((100%-48px)/5)] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. BEST SELLERS */}
      {bestSellers.length > 0 && (
        <section className="mt-8">
          <SectionHeader icon={Trophy} title="Best Sellers" subtitle="Most loved" accentClass="text-[#D4AF37]" />
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
            {bestSellers.map((product, i) => (
              <div key={product.id} className="w-[180px] md:w-[calc((100%-48px)/5)] flex-shrink-0 relative">
                <ProductCard product={product} />
                <div className="absolute top-4 left-4 z-20 px-2 py-0.5 bg-[#D4AF37] text-black text-[9px] font-bold rounded-full shadow-sm pointer-events-none">
                  Best Seller
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. VALUE FOR MONEY SECTION */}
      <section className="mt-10 py-8 bg-[#FDEEF4]/40 border-y border-[#F8C8DC]/20">
        <SectionHeader icon={Tag} title="Value For Money" subtitle="Show ONLY discounted products" accentClass="text-green-600" />
        
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 mb-6">
          {PRICE_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setVfmTab(tab.id)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-xs font-bold transition-all ${
                vfmTab === tab.id
                  ? 'bg-[#F8C8DC] text-black shadow-md'
                  : 'bg-white text-gray-500 border border-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {vfmProducts.length === 0 ? (
          <div className="px-4 text-center py-10 text-gray-400 text-sm italic">
            No discounted products found in this range.
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-2">
            {vfmProducts.map(product => (
              <div key={product.id} className="w-[180px] md:w-[calc((100%-48px)/5)] flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 7. ALL PRODUCTS GRID */}
      <section id="all-products-grid" className="mt-10 scroll-mt-20">
        <div className="px-4 mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-xl font-bold text-black">All Products</h2>
            <p className="text-sm text-gray-400">{sortedAll.length} items available • Page {currentPage} of {totalPages || 1}</p>
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold transition-colors ${
              showFilters ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Filters UI */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden px-4 mb-6"
            >
              <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search in brand..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:border-[#F8C8DC] transition-colors"
                  />
                  {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>

                {/* Categories */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category</p>
                  <div className="flex flex-wrap gap-2">
                    {uniqueCats.map(cat => (
                      <button
                        key={cat}
                        onClick={() => setFilterCat(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          filterCat === cat ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-100'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Sort By</p>
                  <div className="flex flex-wrap gap-2">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setSortBy(opt.val)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                          sortBy === opt.val ? 'bg-[#F8C8DC] text-black border-[#F8C8DC]' : 'bg-white text-gray-600 border-gray-100'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {pagedProducts.length === 0 ? (
          <div className="px-4 py-20 text-center">
            <p className="text-gray-400 italic">No products match your current filters.</p>
            <button 
              onClick={() => {setFilterCat('All'); setSortBy('default'); setSearch('');}}
              className="mt-4 text-[#F8C8DC] font-bold underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 px-4 md:grid-cols-4 lg:grid-cols-5 transition-all duration-500">
            {pagedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination UI */}
        {totalPages > 1 && (
          <div className="mt-10 mb-6 flex items-center justify-center gap-2 px-4">
            <button
              disabled={currentPage === 1}
              onClick={() => { setCurrentPage(p => p - 1); scrollToTop(); }}
              className={`p-2 rounded-lg border transition-all ${
                currentPage === 1 ? 'text-gray-200 border-gray-100 cursor-not-allowed' : 'text-black border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => {
                const p = i + 1;
                // Only show current, first, last, and neighbors
                if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                  return (
                    <button
                      key={p}
                      onClick={() => { setCurrentPage(p); scrollToTop(); }}
                      className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                        currentPage === p
                          ? 'bg-[#F8C8DC] text-black shadow-sm'
                          : 'bg-white text-gray-500 border border-gray-200 hover:border-[#F8C8DC]'
                      }`}
                    >
                      {p}
                    </button>
                  );
                }
                if (p === currentPage - 2 || p === currentPage + 2) {
                  return <span key={p} className="text-gray-400 text-xs px-1">...</span>;
                }
                return null;
              })}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => { setCurrentPage(p => p + 1); scrollToTop(); }}
              className={`p-2 rounded-lg border transition-all rotate-180 ${
                currentPage === totalPages ? 'text-gray-200 border-gray-100 cursor-not-allowed' : 'text-black border-gray-200 hover:bg-gray-50'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="py-10 text-center">
          <p className="text-[10px] text-gray-300 font-medium tracking-widest uppercase">
            Showing {pagedProducts.length} of {sortedAll.length} items
          </p>
        </div>
      </section>

    </div>
  );
};

export default BrandPage;
