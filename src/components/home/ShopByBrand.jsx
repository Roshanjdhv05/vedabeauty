import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getBrands } from '../../services/productService';

const ShopByBrand = () => {
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

  if (loading) return null;

  return (
    <section className="pt-10 pb-6 bg-background">
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-black">Brands We Carry</h2>
        </div>
        <div className="flex gap-10 md:gap-20 overflow-x-auto no-scrollbar items-center justify-start md:justify-center pb-4">
          {brands.map((brand) => {
            const isMars = brand.name.toUpperCase().includes('MARS');
            const hasCustomLogo = brand.logo_url && brand.logo_url !== '/brands/default_logo.png';
            
            return (
              <motion.div 
                key={brand.id} 
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/brand/${brand.id}`)}
                className="flex-shrink-0 flex flex-col items-center gap-6 group cursor-pointer"
              >
                <div className={`relative w-28 h-28 md:w-36 md:h-36 flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                  hasCustomLogo 
                    ? 'rounded-full border-[1.5px] border-[#E8B4C0] bg-white overflow-hidden p-2' 
                    : isMars 
                      ? 'bg-black rounded-2xl p-4' 
                      : 'rounded-full border-[1.5px] border-[#E8B4C0] bg-[#FDEEF4] p-4'
                }`}>
                  {hasCustomLogo ? (
                    <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-contain rounded-full" />
                  ) : isMars ? (
                    <div className="text-white font-bold text-center">
                       <p className="text-xl tracking-tighter">MARS</p>
                    </div>
                  ) : (
                    <span className="text-[10px] md:text-[11px] font-sans font-bold text-[#8E9AAF] uppercase tracking-tighter text-center leading-tight">
                      {brand.name}
                    </span>
                  )}
                </div>
                <span className="text-[9px] md:text-[10px] font-sans font-bold text-[#8E9AAF] uppercase tracking-widest text-center">
                  {brand.name}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ShopByBrand;
