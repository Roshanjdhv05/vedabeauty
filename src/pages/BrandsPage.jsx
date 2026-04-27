import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBrands } from '../services/productService';
import OptimizedImage from '../components/ui/OptimizedImage';
import { ArrowLeft, Sparkles, ShoppingBag } from 'lucide-react';

const BRANDS_BANNER = '/brands_banner.png';

const BrandsPage = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      const data = await getBrands();
      setBrands(data);
      setLoading(false);
    };
    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 1. HERO BANNER */}
      <div className="relative w-full h-[250px] md:h-[450px] overflow-hidden bg-[#fdf2f0]">
        <img 
          src={BRANDS_BANNER} 
          alt="Top Beauty Brands" 
          className="w-full h-full object-contain md:object-cover"
        />
        {/* Subtle Overlay */}
        <div className="absolute inset-0 bg-black/5 md:hidden" />
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-2.5 bg-white/30 backdrop-blur-md rounded-full text-black border border-white/40 hover:bg-white/50 transition-all z-20"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* 2. CONTENT SECTION */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-black mb-4">Our Brand Partners</h1>
          <div className="w-24 h-1.5 bg-accent mx-auto mb-6 rounded-full" />
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            We collaborate with the world's most prestigious beauty brands to bring you professional-grade cosmetics, skincare, and fragrances.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-100 animate-pulse" />
                <div className="w-16 h-2 bg-gray-100 animate-pulse rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
            {brands.map((brand) => {
              const hasCustomLogo = brand.logo_url && brand.logo_url !== '/brands/default_logo.png';
              
              return (
                <motion.div 
                  key={brand.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  onClick={() => navigate(`/brand/${brand.id}`)}
                  className="flex flex-col items-center gap-4 group cursor-pointer"
                >
                  <div className={`relative w-28 h-28 md:w-40 md:h-40 flex items-center justify-center transition-all duration-500 rounded-full border border-gray-100 bg-white shadow-sm group-hover:shadow-xl group-hover:border-accent p-4 overflow-hidden`}>
                    {hasCustomLogo ? (
                      <OptimizedImage 
                        src={brand.logo_url} 
                        alt={brand.name} 
                        containerClassName="rounded-full"
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-tighter text-center">
                        {brand.name}
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <h3 className="text-xs md:text-sm font-bold text-black uppercase tracking-widest">{brand.name}</h3>
                    <div className="flex items-center justify-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="text-[9px] font-bold text-accent uppercase">Shop Collection</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. TRUST SECTION */}
      <div className="mt-24 py-16 bg-[#FDFDFD] border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          <div className="space-y-3">
             <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} />
             </div>
             <h4 className="font-bold uppercase tracking-widest text-xs">100% Authentic</h4>
             <p className="text-xs text-gray-400">Directly sourced from authorized brand distributors.</p>
          </div>
          <div className="space-y-3">
             <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag size={24} />
             </div>
             <h4 className="font-bold uppercase tracking-widest text-xs">Bulk Savings</h4>
             <p className="text-xs text-gray-400">Special pricing for beauty professionals and retailers.</p>
          </div>
          <div className="space-y-3">
             <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowLeft size={24} className="rotate-180" />
             </div>
             <h4 className="font-bold uppercase tracking-widest text-xs">Fast Shipping</h4>
             <p className="text-xs text-gray-400">Express delivery across the country within 48 hours.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsPage;
