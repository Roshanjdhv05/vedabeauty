import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, X, Search } from 'lucide-react';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';

const PRICE_DEALS = [
  { id: 99,  label: 'Under ₹99',  color: 'bg-[#FFF9C4]', border: 'border-[#FFF176]', text: 'text-[#827717]' },
  { id: 199, label: 'Under ₹199', color: 'bg-[#FCE4EC]', border: 'border-[#F8BBD0]', text: 'text-[#880E4F]' },
  { id: 299, label: 'Under ₹299', color: 'bg-[#E8F5E9]', border: 'border-[#C8E6C9]', text: 'text-[#1B5E20]' },
  { id: 499, label: 'Under ₹499', color: 'bg-[#E3F2FD]', border: 'border-[#BBDEFB]', text: 'text-[#0D47A1]' },
];

const PAGE_SIZE = 20;

const DealsPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialPrice = parseInt(searchParams.get('price')) || 499;
  const [activePrice, setActivePrice] = useState(initialPrice);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('price_asc');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const data = await getProducts();
      setAllProducts(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  // Sync URL when price tab changes
  const handlePriceChange = (price) => {
    setActivePrice(price);
    setCurrentPage(1);
    setSearchParams({ price });
  };

  // Filter & sort
  const filtered = allProducts
    .filter(p => p.price <= activePrice)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeDeal = PRICE_DEALS.find(d => d.id === activePrice) || PRICE_DEALS[3];

  return (
    <div className="min-h-screen bg-[#FFF8FB]">
      {/* ── Header ── */}
      <div className={`${activeDeal.color} border-b-2 ${activeDeal.border} py-8 px-4`}>
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black mb-6 transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <h1 className={`text-3xl md:text-5xl font-serif font-bold ${activeDeal.text} mb-2`}>
            Wholesale Deals by Price
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            {filtered.length} products available · Showing {activeDeal.label}
          </p>

          {/* Price Tabs */}
          <div className="flex flex-wrap gap-3 mt-6">
            {PRICE_DEALS.map(deal => (
              <button
                key={deal.id}
                onClick={() => handlePriceChange(deal.id)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold border-2 transition-all ${
                  activePrice === deal.id
                    ? `${deal.color} ${deal.border} ${deal.text} shadow-lg scale-105`
                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {deal.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-2xl text-sm outline-none focus:border-[#F8C8DC] transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm font-semibold outline-none focus:border-[#F8C8DC] cursor-pointer"
        >
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>

      {/* ── Products Grid ── */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : paged.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-4xl mb-4">🛍️</p>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No products found</h2>
            <p className="text-gray-400 text-sm">Try a different price range or clear your search.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {paged.map(product => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
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
                  className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition"
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
                            ? 'bg-[#F8C8DC] text-black shadow'
                            : 'bg-white border border-gray-200 text-gray-500 hover:border-[#F8C8DC]'
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
                  className="p-2 rounded-xl border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition rotate-180"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            )}

            <p className="text-center text-xs text-gray-300 font-medium tracking-widest uppercase mt-6">
              Showing {paged.length} of {filtered.length} products
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default DealsPage;
