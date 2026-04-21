import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// The single hero image — reduced to 800w for fastest load
const HERO_IMAGE = 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=75&w=800';

const HeroSection = () => {
  // Preload the hero image as soon as the component is mounted
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = HERO_IMAGE;
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden">
      {/* Hero Image — native img with highest fetch priority */}
      <img
        src={HERO_IMAGE}
        alt="Veda Beauty Wholesale"
        fetchpriority="high"
        decoding="async"
        className="w-full h-full object-cover"
        style={{ display: 'block' }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-xs md:max-w-3xl"
        >
          <span className="text-[10px] md:text-sm font-sans font-bold text-accent tracking-[0.4em] uppercase mb-4 block">
            Business Ready Shipping
          </span>
          <h1 className="text-3xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.1]">
            Fast Global Dispatch <br className="hidden md:block" /> &amp; Bulk Loyalty
          </h1>
          <p className="text-xs md:text-lg text-white/70 mb-10 max-w-md mx-auto font-sans leading-relaxed">
            Priority shipping within 24 hours for all professional orders. Scale your business with our dedicated support.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-4 bg-accent text-black text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg hover:scale-105 transition-transform shadow-xl">
              Learn More
            </button>
            <button className="w-full sm:w-auto px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 text-[10px] font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-white/20 transition-all">
              Apply for Wholesale
            </button>
          </div>
        </motion.div>
      </div>

      {/* Decorative Slide Indicator */}
      <div className="absolute bottom-12 left-0 w-full flex justify-center gap-2 z-30 pointer-events-none">
        <div className="w-2 h-2 bg-white/30 rounded-full" />
        <div className="w-8 h-2 bg-accent rounded-full" />
        <div className="w-2 h-2 bg-white/30 rounded-full" />
      </div>

      {/* Premium Blur Merge Effect at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-40 z-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FCBACB] via-[#FCBACB]/80 to-transparent" />
      </div>
    </div>
  );
};

export default HeroSection;

