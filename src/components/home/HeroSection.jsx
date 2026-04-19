import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const banners = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=1200',
    title: 'Glow Like Never Before',
    subtitle: 'upto 40% OFF on Premium Skincare',
    buttonText: 'Shop Now'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1200',
    title: 'Luxury Fragrances',
    subtitle: 'New Collection Just Arrived',
    buttonText: 'Explore'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&q=80&w=1200',
    title: 'Organic Makeup',
    subtitle: 'Chemical Free, Pure Beauty',
    buttonText: 'View Details'
  }
];

const HeroSection = () => {
  return (
    <div className="relative w-full h-[500px] md:h-[650px] overflow-hidden">
      {/* Background Image with Darker Overlay */}
      <img 
        src="https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=80&w=1600" 
        alt="Veda Beauty Wholesale" 
        className="w-full h-full object-cover"
      />
      {/* Content Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xs md:max-w-3xl"
        >
          <span className="text-[10px] md:text-sm font-sans font-bold text-accent tracking-[0.4em] uppercase mb-4 block">
            Business Ready Shipping
          </span>
          <h1 className="text-3xl md:text-7xl font-serif font-bold text-white mb-6 leading-[1.1]">
            Fast Global Dispatch <br className="hidden md:block" /> & Bulk Loyalty
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
