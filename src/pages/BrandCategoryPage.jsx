import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getProductsByBrand } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import { ChevronLeft, SlidersHorizontal, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BrandCategoryPage = () => {
  const { brandId, categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState(null);
  
  // Optional Filters/Sort
  const [sortBy, setSortBy] = useState('default');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch all products for the brand (handles UUIDs and legacy name_ formats)
        const allBrandProducts = await getProductsByBrand(brandId);
        
        if (allBrandProducts.length > 0) {
          if (!cancelled) {
            setBrandData(allBrandProducts[0].brands);
            // Filter by category exactly
            const filtered = allBrandProducts.filter(
              p => p.category?.toLowerCase() === categoryName.toLowerCase()
            );
            setProducts(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching brand category products:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);

    return () => { cancelled = true; };
  }, [brandId, categoryName]);

  const SORT_OPTIONS = [
    { val: 'default',    label: 'Default'    },
    { val: 'price_asc',  label: 'Price ↑'    },
    { val: 'price_desc', label: 'Price ↓'    },
    { val: 'discount',   label: 'Best Deals' },
  ];

  const sortedProducts = [...products].sort((a, b) => {
    if (sortBy === 'price_asc')  return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'discount')   return (b.discount ?? 0) - (a.discount ?? 0);
    return 0;
  });

  const bName = brandData?.name || 'Brand';

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumbs & Back Button */}
        <div className="flex items-center gap-4 mb-4 md:mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40">
            <span className="cursor-pointer hover:text-black" onClick={() => navigate('/')}>Home</span>
            <span>/</span>
            <span className="cursor-pointer hover:text-black" onClick={() => navigate(-1)}>{bName}</span>
            <span>/</span>
            <span className="text-black">{categoryName}</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-6 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-accent uppercase tracking-[0.3em] mb-2">
              {bName}
            </p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-black capitalize tracking-tighter leading-none break-words">
              {categoryName}
            </h1>
            <div className="flex items-center gap-4 mt-4">
              <div className="h-px w-12 bg-black" />
              <p className="text-[10px] font-bold text-black uppercase tracking-[0.3em]">
                {products.length} Products
              </p>
            </div>
          </div>

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`self-start md:self-auto flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider transition-colors ${
              showFilters ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-200 hover:border-black hover:text-black'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Sort
          </button>
        </div>

        {/* Filters/Sort UI */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sort By</p>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setSortBy(opt.val)}
                      className={`px-4 py-2 rounded-full text-[10px] font-bold tracking-widest uppercase transition-all ${
                        sortBy === opt.val ? 'bg-accent text-black border-accent' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {[...Array(10)].map((_, j) => (
              <div key={j} className="aspect-[3/4] bg-white/50 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8"
          >
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-black/5 px-6">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <Search size={32} className="text-gray-200" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-black">No products available</h2>
            <p className="text-sm text-gray-500 mt-2 max-w-xs">
              We couldn't find any products in the {categoryName} category for {bName}.
            </p>
            <button 
              onClick={() => navigate(-1)}
              className="mt-8 px-8 py-3 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-accent transition-colors"
            >
              Go Back
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default BrandCategoryPage;
