import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { getBrands, getProducts } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import { Filter, ChevronDown, LayoutGrid, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CategoryPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialBrand = searchParams.get('brand') || 'All';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedBrand, setSelectedBrand] = useState(initialBrand);
  const [priceRange, setPriceRange] = useState(2000);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Fetch Categories from category_settings
      const { data: catData } = await supabase
        .from('category_settings')
        .select('name')
        .is('brand_id', null)
        .eq('is_active', true)
        .order('display_order');
      
      const uniqueCats = ['All', ...(catData?.map(c => c.name) || [])];
      setCategories(uniqueCats);

      // Fetch Brands
      const brandData = await getBrands();
      setBrands([{ id: 'All', name: 'All Brands' }, ...brandData]);

      // Fetch all products initially
      const allProds = await getProducts();
      setProducts(allProds);
      
      setLoading(false);
    };
    fetchData();
  }, []);

  // Update URL params when selection changes
  useEffect(() => {
    const params = {};
    if (selectedCategory !== 'All') params.category = selectedCategory;
    if (selectedBrand !== 'All') params.brand = selectedBrand;
    setSearchParams(params);
  }, [selectedCategory, selectedBrand]);

  // Filtering Logic
  const filteredProducts = products.filter(p => {
    const catMatch = selectedCategory === 'All' || p.category === selectedCategory;
    const brandMatch = selectedBrand === 'All' || p.brand_id === selectedBrand || p.brand_name === selectedBrand;
    const priceMatch = p.price <= priceRange;
    return catMatch && brandMatch && priceMatch;
  }).sort((a, b) => {
    if (sortBy === 'price_low') return a.price - b.price;
    if (sortBy === 'price_high') return b.price - a.price;
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  // Get categories available for the selected brand
  const availableCategories = selectedBrand === 'All' 
    ? categories 
    : ['All', ...new Set(products.filter(p => p.brand_id === selectedBrand || p.brand_name === selectedBrand).map(p => p.category))];

  return (
    <div className="min-h-screen bg-[#FDFDFD] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              {selectedCategory === 'All' ? 'Our Collections' : selectedCategory}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Showing {filteredProducts.length} items
            </p>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
            {/* Brand Dropdown */}
            <div className="relative group min-w-[150px]">
              <select 
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-semibold focus:outline-none focus:border-accent transition-all cursor-pointer shadow-sm"
              >
                {brands.map(b => (
                  <option key={b.id} value={b.id || b.name}>{b.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort Dropdown */}
            <div className="relative min-w-[150px]">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 rounded-full px-5 py-2.5 pr-10 text-sm font-semibold focus:outline-none focus:border-accent transition-all cursor-pointer shadow-sm"
              >
                <option value="newest">Newest First</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            <div className="sticky top-28 space-y-8">
              
              {/* Categories List */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories</h3>
                <div className="flex flex-col gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`text-left py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                        selectedCategory === cat 
                        ? 'bg-black text-white shadow-lg shadow-black/10 translate-x-2' 
                        : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Max Price</h3>
                  <span className="text-sm font-bold text-accent">₹{priceRange}</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="5000" 
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(parseInt(e.target.value))}
                  className="w-full accent-black h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold">
                  <span>₹0</span>
                  <span>₹5000+</span>
                </div>
              </div>

              {/* Brand Filter (Inside Dropdown logic from prompt) */}
              {selectedBrand !== 'All' && (
                <div className="pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
                   <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Categories in {brands.find(b => b.id === selectedBrand || b.name === selectedBrand)?.name}</h3>
                   <div className="flex flex-wrap gap-2">
                      {availableCategories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${
                            selectedCategory === cat 
                            ? 'bg-accent border-accent text-white' 
                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                   </div>
                </div>
              )}
            </div>
          </aside>

          {/* Main Product Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-[3/4] bg-gray-100 rounded-3xl animate-pulse" />
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                <AnimatePresence mode='popLayout'>
                  {filteredProducts.map((product) => (
                    <motion.div
                      layout
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Filter className="text-gray-300" size={32} />
                </div>
                <h3 className="text-xl font-serif font-bold text-gray-900">No products found</h3>
                <p className="text-sm text-gray-500 mt-2 max-w-xs">
                  We couldn't find any products matching your current filters. Try adjusting them!
                </p>
                <button 
                  onClick={() => {setSelectedCategory('All'); setSelectedBrand('All'); setPriceRange(2000);}}
                  className="mt-6 px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-accent transition-all"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
