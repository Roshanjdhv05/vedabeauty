import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OptimizedImage from '../ui/OptimizedImage';
import { supabase } from '../../lib/supabase';

const DEFAULT_CATEGORIES = [
  { name: 'Lips', image_url: '/mars/cloud_kiss_lipstick.webp' },
  { name: 'Eyes', image_url: '/mars/36_color_eyeshadow_palette.webp' },
  { name: 'Face', image_url: '/mars/BB CREAM FOUNDATION.webp' },
  { name: 'Nails', image_url: '/mars/COLOR BOMB NAIL PAINT (1).webp' },
  { name: 'Removers & Wipes', image_url: '/mars/MAKEUP MELTING MICROFIBER WIPES.webp' },
  { name: 'Tools & Accessories', image_url: '/mars/TOOLS OF TITAN BRUSH SET.webp' },
];

const ShopByCategory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('category_settings')
          .select('*')
          .is('brand_id', null)
          .eq('is_active', true)
          .order('display_order', { ascending: true });

        if (error) throw error;
        setCategories(data?.length > 0 ? data : DEFAULT_CATEGORIES);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return null;
  return (
    <section className="pt-4 pb-2 bg-background">
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        <h2 className="text-3xl md:text-5xl font-serif font-medium text-center mb-10 text-[#333]">
          Shop by Category
        </h2>
        
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
              onClick={() => navigate(`/category/${cat.name}`)}
            >
              <div className="relative w-[70px] h-[70px] md:w-44 md:h-44 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-sm transition-transform duration-500 group-hover:scale-105 border border-white/20">
                <OptimizedImage 
                  src={cat.image_url} 
                  alt={cat.name} 
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
              </div>
              <span className="mt-2 text-[8px] md:text-sm font-bold text-black/60 uppercase tracking-widest text-center max-w-[70px] leading-tight">
                {cat.name}
              </span>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-[-1rem]">
          <button 
            onClick={() => navigate('/categories')}
            className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#333] border-b border-black/20 pb-1 hover:border-black transition-all"
          >
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
