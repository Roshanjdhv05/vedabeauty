import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Tag, Sparkles, Search, X, SlidersHorizontal } from 'lucide-react';
import { getOfferProducts } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import SEO from '../components/SEO';

// The 3 combo offer product IDs we insert via SQL
const OFFER_IDS = [
  'e1f8c14a-5f6b-4e1a-8c1d-9e2f3a4b5c6d', // Insight Combo
  'b3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7f', // Mars Combo
  'c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f', // Pilgrim Combo
];

const BRAND_FILTERS = [
  { label: 'All Brands', value: null },
  { label: 'Insight', value: 'Insight' },
  { label: 'Offer', value: 'Offer' },
  { label: 'Pilgrim', value: 'Pilgrim' },
];

const SORT_OPTIONS = [
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Biggest Discount', value: 'discount_desc' },
  { label: 'Name A–Z', value: 'name' },
];

const PAGE_SIZE = 20;

const OffersPage = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeBrand, setActiveBrand] = useState(null);
  const [sortBy, setSortBy] = useState('discount_desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchOfferProducts = async () => {
      setLoading(true);
      const data = await getOfferProducts();
      setAllProducts(data);
      setLoading(false);
    };
    fetchOfferProducts();
  }, []);

  // Filter + sort
  const filtered = allProducts
    .filter(p => !activeBrand || p.brand_name === activeBrand || p.brands?.name === activeBrand)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price || a.selling_price) - (b.price || b.selling_price);
      if (sortBy === 'price_desc') return (b.price || b.selling_price) - (a.price || a.selling_price);
      if (sortBy === 'discount_desc') return (b.discount || 0) - (a.discount || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleBrandChange = (val) => {
    setActiveBrand(val);
    setCurrentPage(1);
  };

  const handleSearch = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #fff5f8 0%, #fce8f0 40%, #f5f0ff 100%)' }}>
      <SEO
        title="Special Offers & Combo Deals | Veda Beauty"
        description="Shop exclusive combo offers and discounted beauty products at Veda Beauty. Get the best deals on Insight, Mars, and Pilgrim brands."
        keywords="beauty combo offers, discounted cosmetics, makeup deals, Veda Beauty offers"
      />

      {/* ── Hero Header ── */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #2d1b3d 50%, #1a1a2e 100%)' }}>
        {/* Decorative blobs */}
        <div style={{ position:'absolute', top:'-60px', right:'-60px', width:'300px', height:'300px', borderRadius:'50%', background:'radial-gradient(circle, rgba(233,85,120,0.25) 0%, transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:'220px', height:'220px', borderRadius:'50%', background:'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)', pointerEvents:'none' }} />

        <div className="max-w-7xl mx-auto px-4 py-10 relative z-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white/60 hover:text-white text-sm font-semibold mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded-full mb-4 border border-white/10">
                <Tag size={11} strokeWidth={2.5} />
                Limited Time Deals
              </div>
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-3 leading-tight">
                🎁 Special<br />
                <span style={{ color:'#f472b6' }}>Combo Offers</span>
              </h1>
              <p className="text-white/60 text-sm font-medium max-w-md">
                Handpicked brand combos and discounted products — all in one place
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
                <div className="text-3xl font-black text-white">{allProducts.length}</div>
                <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">Products</div>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10">
                <div className="text-3xl font-black" style={{ color:'#f472b6' }}>3</div>
                <div className="text-white/50 text-[10px] font-bold uppercase tracking-widest mt-1">Brands</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Combo Offer Highlights Strip ── */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'e1f8c14a-5f6b-4e1a-8c1d-9e2f3a4b5c6d', img: '/insight_combo_offer.png', brand: 'Insight', name: 'Insight Combo', mrp: 1163, price: 885 },
            { id: 'b3c4d5e6-f7a8-4b9c-0d1e-2f3a4b5c6d7f', img: '/mars_combo_offer.png', brand: 'Mars', name: '5 Min Daily Makeup Kit', mrp: 999, price: 749 },
            { id: 'c4d5e6f7-a8b9-4c0d-1e2f-3a4b5c6d7e8f', img: '/pilgrim_combo_offer.png', brand: 'Pilgrim', name: 'Morning Glow & Protect', mrp: 1565, price: 1179 },
          ].map((combo, i) => {
            const disc = Math.round(((combo.mrp - combo.price) / combo.mrp) * 100);
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-md border border-white/60"
                style={{ background: '#fff' }}
                onClick={() => navigate(`/product/${combo.id}`)}
              >
                <div className="absolute top-2 left-2 z-10 bg-rose-500 text-white text-[9px] font-black rounded-full px-2 py-0.5 uppercase tracking-wide">
                  {disc}% OFF
                </div>
                <img src={combo.img} alt={combo.name} className="w-full h-28 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="p-2.5">
                  <div className="text-[9px] font-bold text-rose-500 uppercase tracking-widest mb-0.5">{combo.brand}</div>
                  <div className="text-xs font-bold text-gray-800 leading-tight">{combo.name}</div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-sm font-black text-gray-900">₹{combo.price}</span>
                    <span className="text-[10px] text-gray-400 line-through">₹{combo.mrp}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ── Filters + Search ── */}
      <div className="max-w-7xl mx-auto px-4 pb-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search offer products..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-rose-300 transition-colors"
                id="offers-search-input"
              />
              {search && (
                <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>

            <div className="flex gap-2 items-center">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold outline-none focus:border-rose-300 cursor-pointer"
                id="offers-sort-select"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>

              {/* Filter toggle (mobile) */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden flex items-center gap-1.5 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold"
              >
                <SlidersHorizontal size={14} />
                Filter
              </button>
            </div>
          </div>

          {/* Brand Pills */}
          <div className={`flex flex-wrap gap-2 mt-3 ${showFilters || 'hidden sm:flex'}`}>
            {BRAND_FILTERS.map(b => (
              <button
                key={b.label}
                onClick={() => handleBrandChange(b.value)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  activeBrand === b.value
                    ? 'bg-rose-500 text-white border-rose-500 shadow-md'
                    : 'bg-white text-gray-500 border-gray-200 hover:border-rose-300'
                }`}
                id={`brand-filter-${b.label.toLowerCase().replace(/ /g, '-')}`}
              >
                {b.label}
              </button>
            ))}
            <span className="ml-auto text-xs text-gray-400 font-medium self-center">
              {filtered.length} products
            </span>
          </div>
        </div>
      </div>

      {/* ── Products Grid ── */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-white/60 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : paged.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">🎁</p>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No offer products found</h2>
            <p className="text-gray-400 text-sm">Try clearing your search or changing the brand filter.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {paged.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(i * 0.04, 0.4) }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2 flex-wrap">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-white transition bg-white/50"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const p = i + 1;
                  if (p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)) {
                    return (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                          currentPage === p
                            ? 'bg-rose-500 text-white shadow-md'
                            : 'bg-white border border-gray-200 text-gray-500 hover:border-rose-300'
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

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="p-2.5 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-white transition bg-white/50 rotate-180"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 font-medium tracking-widest uppercase mt-6">
              Showing {paged.length} of {filtered.length} offer products
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default OffersPage;
