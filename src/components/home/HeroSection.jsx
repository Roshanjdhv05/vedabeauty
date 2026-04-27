import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

// The single hero image — reduced to 800w for fastest load
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const NEW_BANNER_DESKTOP = '/hero_banner.png';
const NEW_BANNER_MOBILE = '/hero_mobile.png';
const OLD_BANNER = 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=75&w=1200';

const HeroSection = () => {
  return (
    <div className="relative w-full h-[65vh] md:h-[650px] overflow-hidden bg-[#f8ede7]">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={false} 
        breakpoints={{
          768: { navigation: true }
        }}
        loop={true}
        className="w-full h-full"
      >
        {/* Slide 1: Professional Banners (Responsive) */}
        <SwiperSlide className="bg-[#f8ede7]">
          <div 
            onClick={() => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' })}
            className="relative w-full h-full cursor-pointer group flex items-center justify-center"
          >
            {/* Desktop Image */}
            <img
              src={NEW_BANNER_DESKTOP}
              alt="Veda Beauty Brands"
              className="hidden md:block w-full h-full object-contain"
            />
            {/* Mobile Image */}
            <img
              src={NEW_BANNER_MOBILE}
              alt="Explore the World of Beauty"
              className="block md:hidden w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
          </div>
        </SwiperSlide>

        {/* Slide 2: Original Hero */}
        <SwiperSlide>
          <div className="relative w-full h-full">
            <img
              src={OLD_BANNER}
              alt="Veda Beauty Wholesale"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 z-10" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-[340px] md:max-w-3xl"
              >
                <span className="text-[10px] md:text-sm font-sans font-bold text-accent tracking-[0.3em] uppercase mb-3 block">
                  Business Ready Shipping
                </span>
                <h1 className="text-3xl md:text-7xl font-serif font-bold text-white mb-4 md:mb-6 leading-tight">
                  Fast Global Dispatch <br className="hidden md:block" /> &amp; Bulk Loyalty
                </h1>
                <p className="text-xs md:text-lg text-white/70 mb-6 md:mb-10 max-w-md mx-auto font-sans leading-relaxed line-clamp-2 md:line-clamp-none">
                  Priority shipping within 24 hours for all professional orders.
                </p>
                <div className="flex justify-center">
                  <button 
                    onClick={() => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' })}
                    className="px-8 py-3.5 md:px-12 md:py-5 bg-accent text-black text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] rounded-lg hover:scale-105 transition-transform shadow-2xl"
                  >
                    Shop Now
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      {/* Premium Glassmorphism Transition at Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-16 z-20 pointer-events-none backdrop-blur-[2px]">
        <div className="absolute inset-0 bg-gradient-to-t from-[#FCBACB] via-[#FCBACB]/60 to-transparent" />
      </div>
    </div>
  );
};

export default HeroSection;

