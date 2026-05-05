import React, { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import ShopByBrand from '../components/home/ShopByBrand';
import ShopByCategory from '../components/home/ShopByCategory';
import ProductSection from '../components/home/ProductSection';
import ValueForMoney from '../components/home/ValueForMoney';
import ProductCard from '../components/ui/ProductCard';
import { getProducts } from '../services/productService';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerRow, setItemsPerRow] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      // 1. Fetch initial batch for sliders (fast)
      const initialData = await getProducts(200);
      setAllProducts(initialData);
      setFilteredProducts(initialData.filter(p => p.price < 499));
      setLoading(false); // Sliders show up now!

      // 2. Fetch all products in background for the "All Products" grid
      const fullData = await getProducts();
      setAllProducts(fullData);
      // Only update filteredProducts if the user hasn't started interacting with filters
      // For now, we just update it as we did before
      setFilteredProducts(fullData.filter(p => p.price < 499));
    };
    fetchData();

    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerRow(2);
      else if (window.innerWidth < 1024) setItemsPerRow(4);
      else setItemsPerRow(5);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePriceFilter = (maxPrice) => {
    setFilteredProducts(allProducts.filter(p => p.price <= maxPrice));
  };

  const pageSize = itemsPerRow * 10; // Increased rows for the main grid
  const totalPages = Math.ceil(filteredProducts.length / pageSize);
  const pagedProducts = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // 5. Categorize products for Home sections
  const trendingProducts = allProducts.slice(0, 12); // First 12 for now
  const luxuryProducts = allProducts.filter(p => p.price > 999).slice(0, 20);
  const valueProducts = allProducts
    .filter(p => p.price < 599)
    .sort((a, b) => a.price - b.price)
    .slice(0, 20);

  return (
    <div className="w-full max-w-full overflow-x-hidden flex flex-col gap-0 min-h-screen bg-background">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. SHOP BY CATEGORY */}
      <ShopByCategory />

      {/* 3. SHOP BY BRAND */}
      <ShopByBrand />

      {/* 4. VALUE FOR MONEY SECTION */}
      <ValueForMoney />

      {/* 5. FEATURED SECTIONS */}
      <div className="space-y-16 py-10 bg-background">
        {/* Trending Section */}
        {trendingProducts.length > 0 && (
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-end mb-6">
               <div>
                 <h2 className="text-2xl md:text-4xl font-serif font-bold text-black uppercase tracking-tight">Trending Products</h2>
                 <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Professional Picks & Best Rated</p>
               </div>
            </div>
            {loading ? (
              <div className="overflow-x-auto no-scrollbar scroll-smooth">
                <div className="flex gap-4 pb-8 w-max px-4">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="w-[160px] md:w-[280px] aspect-[3/4] bg-white/10 animate-pulse rounded-2xl flex-shrink-0" />
                  ))}
                </div>
              </div>
            ) : (
              <ProductSection products={trendingProducts} />
            )}
          </div>
        )}

        {/* Luxury Selection */}
        {luxuryProducts.length > 0 && (
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 mb-6">
               <h2 className="text-2xl md:text-4xl font-serif font-bold text-black uppercase tracking-tight">Luxury Selection</h2>
               <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Premium Professional Range (₹999+)</p>
            </div>
            {loading ? (
              <div className="overflow-x-auto no-scrollbar scroll-smooth">
                <div className="flex gap-4 pb-8 w-max px-4">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="w-[160px] md:w-[280px] aspect-[3/4] bg-white/10 animate-pulse rounded-2xl flex-shrink-0" />
                  ))}
                </div>
              </div>
            ) : (
              <ProductSection products={luxuryProducts} />
            )}
          </div>
        )}

        {/* Great Value */}
        {valueProducts.length > 0 && (
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 mb-6">
               <h2 className="text-2xl md:text-4xl font-serif font-bold text-black uppercase tracking-tight">Great Value</h2>
               <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold">Professional Quality under ₹599</p>
            </div>
            {loading ? (
              <div className="overflow-x-auto no-scrollbar scroll-smooth">
                <div className="flex gap-4 pb-8 w-max px-4">
                  {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="w-[160px] md:w-[280px] aspect-[3/4] bg-white/10 animate-pulse rounded-2xl flex-shrink-0" />
                  ))}
                </div>
              </div>
            ) : (
              <ProductSection products={valueProducts} />
            )}
          </div>
        )}
      </div>

      {/* 7. ALL PRODUCTS SECTION */}
      <section id="all-products" className="py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
           <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4 uppercase tracking-tighter">Professional Collection</h2>
           <div className="w-20 h-1 bg-accent mx-auto mb-6" />
           <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
             Total {allProducts?.length || 0} Products available
           </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 max-w-7xl mx-auto px-4">
             {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="aspect-[3/4] bg-white/30 animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4">
            {pagedProducts?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
                {pagedProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center text-gray-400">No products found</div>
            )}

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center items-center gap-2 mt-16">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center bg-white/50 border border-black/5 disabled:opacity-30 rounded-full hover:bg-accent transition-all"
                >
                  <ChevronLeft size={16} />
                </button>
                
                <div className="flex gap-2 items-center">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    if (
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 flex items-center justify-center text-xs font-bold transition-all rounded-full border ${
                            currentPage === page 
                            ? 'bg-black text-white border-black shadow-lg scale-110' 
                            : 'bg-white/50 text-gray-400 border-black/5 hover:border-black/20'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 || 
                      page === currentPage + 2
                    ) {
                      return <span key={page} className="text-gray-400 font-bold px-1">...</span>;
                    }
                    return null;
                  })}
                </div>

                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center bg-white/50 border border-black/5 disabled:opacity-30 rounded-full hover:bg-accent transition-all"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
            
            <p className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.3em]">
              Page {currentPage} of {totalPages} &bull; Total {allProducts?.length || 0} Products
            </p>
          </div>
        )}
      </section>


      <div className="bg-[#0a0a0a] py-8 text-center border-t border-white/5">
        <p className="text-[10px] text-white/20 font-sans uppercase tracking-[0.4em]">
          &copy; {new Date().getFullYear()} VEDA BEAUTY. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Home;
