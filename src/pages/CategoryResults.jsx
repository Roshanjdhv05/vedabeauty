import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProducts } from '../services/productService';
import ProductCard from '../components/ui/ProductCard';
import { ChevronLeft, SlidersHorizontal, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const CategoryResults = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [allCategoryProducts, setAllCategoryProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState(2000);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const data = await getProducts();
      // Case insensitive match
      const filtered = data.filter(p => 
        p.category?.toLowerCase() === categoryName?.toLowerCase()
      );
      setAllCategoryProducts(filtered);
      setLoading(false);
    };
    fetchProducts();
    window.scrollTo(0, 0);
  }, [categoryName]);

  const filteredProducts = allCategoryProducts;

  // Categorize products for sections
  const trendingProducts = allCategoryProducts.filter(p => (p.reviews_count || 0) > 20).slice(0, 10);
  const valueForMoneyProducts = allCategoryProducts.filter(p => p.price < 499).slice(0, 10);
  const otherProducts = allCategoryProducts.filter(p => 
    !trendingProducts.find(t => t.id === p.id) && 
    !valueForMoneyProducts.find(v => v.id === p.id)
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/20 rounded-full transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-black/40">
            <span className="cursor-pointer hover:text-black" onClick={() => navigate('/')}>Home</span>
            <span>/</span>
            <span className="text-black">{categoryName}</span>
          </div>
        </div>

        {/* Simplified Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-8xl font-serif font-bold text-black uppercase tracking-tighter leading-none">
            {categoryName}
          </h1>
          <div className="flex items-center gap-4 mt-6">
            <div className="h-px w-20 bg-black" />
            <p className="text-[10px] font-bold text-black uppercase tracking-[0.3em]">
              Professional {categoryName} collection &bull; {allCategoryProducts.length} Items
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-12">
             {[1,2].map(i => (
               <div key={i} className="grid grid-cols-2 md:grid-cols-5 gap-6">
                 {[...Array(5)].map((_, j) => <div key={j} className="aspect-[3/4] bg-white rounded-3xl animate-pulse" />)}
               </div>
             ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="space-y-20">
            
            {/* Section 1: Trending */}
            {trendingProducts.length > 0 && (
              <section>
                <div className="flex justify-between items-end mb-8">
                  <div>
                    <h2 className="text-2xl md:text-4xl font-serif font-bold text-black uppercase tracking-tight">Trending in {categoryName}</h2>
                    <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Most Loved by Professionals</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-10 h-1 bg-accent rounded-full" />
                    <div className="w-4 h-1 bg-gray-200 rounded-full" />
                  </div>
                </div>
                <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-8 -mx-4 px-4 scroll-smooth">
                  {trendingProducts.map(product => (
                    <div key={product.id} className="flex-shrink-0 w-[160px] md:w-[240px]">
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 2: Value for Money */}
            {valueForMoneyProducts.length > 0 && (
              <section className="bg-black -mx-4 px-4 py-16 md:rounded-[3rem] shadow-2xl">
                <div className="max-w-7xl mx-auto">
                  <div className="flex justify-between items-end mb-8">
                    <div>
                      <h2 className="text-2xl md:text-4xl font-serif font-bold text-white uppercase tracking-tight">Value for Money</h2>
                      <p className="text-xs text-accent mt-1 uppercase tracking-widest font-bold">Budget Friendly Professional Choice</p>
                    </div>
                    <span className="px-4 py-1.5 bg-accent/20 text-accent text-[10px] font-bold rounded-full border border-accent/30 uppercase tracking-widest">Under ₹499</span>
                  </div>
                  <div className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar pb-8 -mx-4 px-4 scroll-smooth">
                    {valueForMoneyProducts.map(product => (
                      <div key={product.id} className="flex-shrink-0 w-[160px] md:w-[240px]">
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Section 3: All Other Products */}
            <section>
              <div className="flex items-center gap-4 mb-10">
                <h2 className="text-2xl md:text-4xl font-serif font-bold text-black uppercase tracking-tight">All Collections</h2>
                <div className="h-px flex-1 bg-gray-100" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
                {otherProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center bg-white rounded-[3rem] border border-black/5">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
              <LayoutGrid size={32} className="text-gray-200" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-black">No products found</h2>
            <p className="text-sm text-gray-500 mt-2">Adjust your filters or check back later.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default CategoryResults;
