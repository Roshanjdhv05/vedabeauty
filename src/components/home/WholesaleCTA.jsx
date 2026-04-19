import React from 'react';
import { motion } from 'framer-motion';

const WholesaleCTA = () => {
  return (
    <section className="py-20 px-4 bg-[#121212] text-white">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
            Scale Your Beauty <br /> Business with Veda
          </h2>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <button className="px-8 py-3 bg-accent text-white text-xs font-bold rounded-sm uppercase tracking-widest hover:bg-accent/90 transition-all">
              Apply for Wholesale
            </button>
            <button className="px-8 py-3 bg-white/10 text-white text-xs font-bold rounded-sm uppercase tracking-widest hover:bg-white/20 transition-all border border-white/20">
              Download Catalog
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full lg:w-auto">
          {/* Feature 1 */}
          <motion.div 
            whileHover={{ x: 10 }}
            className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between min-w-[300px]"
          >
            <div>
              <p className="text-2xl font-serif font-bold text-accent">45% OFF</p>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">First bulk order sign-up</p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div 
            whileHover={{ x: 10 }}
            className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between min-w-[300px]"
          >
            <div>
              <p className="text-2xl font-serif font-bold text-accent">24h</p>
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Priority Dispatch Promise</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WholesaleCTA;
