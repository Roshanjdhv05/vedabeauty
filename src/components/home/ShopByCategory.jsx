import React from 'react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Lips', image: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=400' },
  { name: 'Eyes', image: 'https://images.unsplash.com/photo-1583241475879-da37a8ced38b?auto=format&fit=crop&q=80&w=400' },
  { name: 'Face', image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=400' },
  { name: 'Brushes', image: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=400' },
  { name: 'Tools & Accessories', image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400' },
  { name: 'Sponges & Blenders', image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=400' },
];

const ShopByCategory = () => {
  return (
    <section className="py-6 bg-background">
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
            >
              <div className="relative w-[70px] h-[70px] md:w-44 md:h-44 rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm transition-transform duration-500 group-hover:scale-105 border border-white/20">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover"
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
          <button className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#333] border-b border-black/20 pb-1 hover:border-black transition-all">
            Shop Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;
