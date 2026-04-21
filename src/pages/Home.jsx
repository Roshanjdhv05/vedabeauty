import React, { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import ShopByBrand from '../components/home/ShopByBrand';
import ShopByCategory from '../components/home/ShopByCategory';
import ProductSection from '../components/home/ProductSection';
import ValueForMoney from '../components/home/ValueForMoney';
import WholesaleCTA from '../components/home/WholesaleCTA';
import ProductCard from '../components/ui/ProductCard';
import { getProducts } from '../services/productService';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

const Home = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerRow, setItemsPerRow] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getProducts();
      setAllProducts(data);
      setFilteredProducts(data.filter(p => p.price < 499));
      setLoading(false);
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

  const pageSize = itemsPerRow * 7; // Show 7 rows
  const totalPages = Math.ceil(allProducts.length / pageSize);
  const pagedProducts = allProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden flex flex-col gap-0 min-h-screen bg-background">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. SHOP BY CATEGORY (Circles) */}
      <ShopByCategory />

      {/* 3. SHOP BY BRAND (Boxes) */}
      <ShopByBrand />

      {/* 5. PRODUCT SECTIONS */}
      <div className="space-y-12 max-w-7xl mx-auto px-4 py-10">
        {/* Just Launched / Trending */}
        <div>
          <div className="flex justify-between items-end mb-6">
             <div>
               <h2 className="text-2xl md:text-4xl font-serif font-bold text-black">Just Launched</h2>
               <p className="text-sm text-gray-400 mt-1">Discover our latest professional additions</p>
             </div>
             <button 
              onClick={() => navigate('/categories')}
              className="text-[10px] font-bold uppercase tracking-widest text-accent border-b-2 border-accent pb-1"
             >
               View All
             </button>
          </div>
          {loading ? (
            <div className="h-64 flex items-center justify-center text-gray-400">Loading...</div>
          ) : (
            <ProductSection products={allProducts.slice(0, 10)} />
          )}
        </div>

        {/* Luxury Selection */}
        <div>
          <div className="mb-6">
             <h2 className="text-2xl md:text-4xl font-serif font-bold text-black">Luxury Selection</h2>
             <p className="text-sm text-gray-400 mt-1">Premium products for professional results</p>
          </div>
          {loading ? null : (
            <ProductSection products={allProducts.filter(p => p.price > 800).slice(0, 10)} />
          )}
        </div>

        <ValueForMoney onFilterChange={handlePriceFilter} />
        
        <div>
          <div className="mb-6">
             <h2 className="text-2xl md:text-4xl font-serif font-bold text-black">Great Deals</h2>
             <p className="text-sm text-gray-400 mt-1">Professional quality, wholesale prices</p>
          </div>
          {loading ? null : (
            <ProductSection products={filteredProducts.slice(0, 10)} />
          )}
        </div>
      </div>

      {/* 7. ALL PRODUCTS SECTION */}
      <section id="all-products" className="py-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 mb-12 text-center">
           <h2 className="text-4xl md:text-5xl font-serif font-bold text-black mb-4">All Professional Products</h2>
           <div className="w-20 h-1 bg-accent mx-auto mb-6" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto px-4">
             {[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="aspect-[3/4] bg-white/50 animate-pulse rounded-2xl" />)}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 mb-12">
              {pagedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

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
                    // Logic to show 1, 2, ..., last or adjacent pages
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
              Page {currentPage} of {totalPages} &bull; Total {allProducts.length} Products
            </p>
          </div>
        )}
      </section>

      <WholesaleCTA />
      
      <div className="bg-[#0a0a0a] py-8 text-center border-t border-white/5">
        <p className="text-[10px] text-white/20 font-sans uppercase tracking-[0.4em]">
          &copy; {new Date().getFullYear()} VEDA BEAUTY. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Home;
