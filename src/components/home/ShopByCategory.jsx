import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import OptimizedImage from '../ui/OptimizedImage';
import { supabase } from '../../lib/supabase';

const DEFAULT_CATEGORIES = [
  { name: 'Lips',                image_url: '/category images/lip.jpg?v=2' },
  { name: 'Eyes',                image_url: '/category images/eyes.jpg?v=2' },
  { name: 'Face',                image_url: '/category images/face.jpg?v=2' },
  { name: 'Nails',               image_url: '/category images/nails.jpg?v=2' },
  { name: 'Removers & Wipes',    image_url: '/category images/removersandwioes.jfif?v=2' },
  { name: 'Tools & Accessories', image_url: '/category images/toolsandaccessories.jpg?v=2' },
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

  return (
    <section className="pt-4 pb-2 bg-background">
      <div className="max-w-7xl mx-auto px-4 overflow-hidden">
        <h2 className="text-3xl md:text-5xl font-serif font-medium text-center mb-10 text-[#333]">
          Shop by Category
        </h2>
        
        <div className="overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex gap-4 pb-6 w-max px-4">
            {loading ? (
              // Skeleton Loader
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex-shrink-0 flex flex-col items-center">
                  <div className="w-[80px] h-[80px] md:w-44 md:h-44 rounded-2xl md:rounded-[2.5rem] bg-white/20 animate-pulse flex-shrink-0" />
                  <div className="w-16 h-2 bg-white/20 animate-pulse mt-2 rounded flex-shrink-0" />
                </div>
              ))
            ) : (
              categories.map((cat, i) => (
                <motion.div
                  key={cat.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex-shrink-0 flex flex-col items-center group cursor-pointer"
                  onClick={() => navigate(`/category/${cat.name}`)}
                >
                  <div className="relative w-[80px] h-[80px] md:w-44 md:h-44 rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-sm transition-transform duration-500 group-hover:scale-105 border border-white/20 flex-shrink-0">
                    <OptimizedImage 
                      src={cat.image_url} 
                      alt={cat.name}
                      objectFit="cover"
                    />
                  </div>
                  <span className="mt-2 text-[10px] md:text-sm font-bold text-black/60 uppercase tracking-widest text-center max-w-[80px] leading-tight flex-shrink-0">
                    {cat.name}
                  </span>
                </motion.div>
              ))
            )}
            {/* Physical spacer for consistent end-padding */}
            <div className="w-12 flex-shrink-0" aria-hidden="true" />
          </div>
        </div>
        
        {!loading && (
          <div className="text-center mt-[-1rem]">
            <button 
              onClick={() => navigate('/categories')}
              className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#333] border-b border-black/20 pb-1 hover:border-black transition-all"
            >
              Shop Now
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ShopByCategory;
