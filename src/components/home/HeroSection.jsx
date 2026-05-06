import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// The single hero image — reduced to 800w for fastest load
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const NEW_BANNER_DESKTOP = '/hero_banner.png?v=2';
const NEW_BANNER_MOBILE = '/hero_mobile.png?v=2';
const OLD_BANNER = 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?auto=format&fit=crop&q=75&w=1200';

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <div className="relative w-full h-[85vh] md:h-[650px] overflow-hidden bg-background">
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
        {/* Slide 0: Welcome Banner - Premium Split Layout */}
        <SwiperSlide>
          <div className="relative w-full h-full flex flex-col md:flex-row bg-background overflow-hidden">
            
            {/* Desktop Left / Mobile Overlay Content */}
            <div className="absolute inset-0 md:relative md:w-[45%] h-full flex flex-col justify-center px-6 md:px-20 lg:px-32 py-12 text-left z-10">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="md:bg-transparent bg-white/5 backdrop-blur-[2px] md:backdrop-blur-0 p-8 md:p-0 rounded-[2rem] md:rounded-0 border border-white/10 md:border-none shadow-lg md:shadow-none"
              >
                <span className="text-[10px] md:text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase mb-4 block">
                  Veda Beauty Exclusive
                </span>
                
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif font-bold text-[#1A1A1A] mb-6 md:mb-8 leading-[1.1]">
                  Your Favorite <br /> 
                  <span className="text-[#D4AF37] italic">Beauty Brands,</span> <br />
                  All in One Place
                </h1>
                
                <p className="text-sm md:text-xl text-gray-800 md:text-gray-500 mb-8 md:mb-12 max-w-md font-medium leading-relaxed">
                  Shop top cosmetic brands with trusted quality and amazing offers
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -5px rgba(212, 175, 55, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-fit px-12 py-4.5 bg-[#D4AF37] text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_10px_20px_-5px_rgba(212, 175, 55, 0.3)] transition-all"
                >
                  Explore Now
                </motion.button>
              </motion.div>
            </div>

            {/* Desktop Right / Mobile Background Image */}
            <div className="w-full md:w-[55%] h-full md:h-full p-0 md:p-10 bg-background flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="w-full h-full md:h-full md:aspect-square md:rounded-[2.5rem] overflow-hidden md:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.25)] bg-transparent"
              >
                <img 
                  src="/hero_poster.jpg"
                  alt="Veda Beauty Brands"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            
          </div>
        </SwiperSlide>


        {/* Slide 1: Combo Offer Banner */}
        <SwiperSlide>
          <div className="relative w-full h-full flex flex-col md:flex-row bg-background overflow-hidden">
            
            {/* Desktop Left / Mobile Overlay Content */}
            <div className="absolute inset-0 md:relative md:w-[45%] h-full flex flex-col justify-center px-6 md:px-20 lg:px-32 py-12 text-center md:text-left z-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="md:bg-transparent bg-white/5 backdrop-blur-[2px] md:backdrop-blur-0 p-8 md:p-0 rounded-[2rem] md:rounded-0 border border-white/10 md:border-none shadow-lg md:shadow-none"
              >
                <span className="text-[10px] md:text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase mb-4 block">
                  Limited Time Deal
                </span>
                
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold text-white md:text-[#1A1A1A] mb-6 md:mb-8 leading-[1.1]">
                  Luxury Beauty, <br className="hidden md:block" /> Now Within Reach
                </h1>
                
                <p className="text-sm md:text-xl text-white/80 md:text-gray-500 mb-8 md:mb-12 max-w-md font-medium leading-relaxed">
                  Elevate Your Glow at 30% Off
                </p>
                
                <div className="flex justify-center md:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -5px rgba(212, 175, 55, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/product/e1f8c14a-5f6b-4e1a-8c1d-9e2f3a4b5c6d')} 
                    className="w-fit px-12 py-4.5 bg-[#D4AF37] text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_10px_20px_-5px_rgba(212, 175, 55, 0.3)] transition-all"
                  >
                    Buy Now
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Desktop Right / Mobile Background Image */}
            <div className="w-full md:w-[55%] h-full md:h-full p-0 md:p-10 bg-background flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="w-full h-full md:h-full md:aspect-square md:rounded-[2.5rem] overflow-hidden md:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] bg-transparent"
              >
                <img 
                  src="/combo_offer.jpg"
                  alt="Insight Combo Offer"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            
          </div>
        </SwiperSlide>

        {/* Slide 2: Global Dispatch Banner */}
        <SwiperSlide>
          <div className="relative w-full h-full flex flex-col md:flex-row bg-background overflow-hidden">
            
            {/* Desktop Left / Mobile Overlay Content */}
            <div className="absolute inset-0 md:relative md:w-[45%] h-full flex flex-col justify-center px-6 md:px-20 lg:px-32 py-12 text-center md:text-left z-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="md:bg-transparent bg-white/5 backdrop-blur-[2px] md:backdrop-blur-0 p-8 md:p-0 rounded-[2rem] md:rounded-0 border border-white/10 md:border-none shadow-lg md:shadow-none"
              >
                <span className="text-[10px] md:text-xs font-bold text-[#D4AF37] md:text-accent tracking-[0.3em] uppercase mb-4 block">
                  Business Ready Shipping
                </span>
                
                <h1 className="text-3xl md:text-5xl lg:text-7xl font-serif font-bold text-white md:text-[#1A1A1A] mb-6 md:mb-8 leading-[1.1]">
                  Fast Global Dispatch <br className="hidden md:block" /> & Bulk Loyalty
                </h1>
                
                <p className="text-sm md:text-xl text-white/80 md:text-gray-500 mb-8 md:mb-12 max-w-md font-medium leading-relaxed">
                  Priority shipping within 24 hours for all professional orders.
                </p>
                
                <div className="flex justify-center md:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -5px rgba(212, 175, 55, 0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-fit px-12 py-4.5 bg-[#D4AF37] text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_10px_20px_-5px_rgba(212, 175, 55, 0.3)] transition-all"
                  >
                    Shop Now
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Desktop Right / Mobile Background Image */}
            <div className="w-full md:w-[55%] h-full md:h-full p-0 md:p-10 bg-background flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className="w-full h-full md:h-full md:aspect-square md:rounded-[2.5rem] overflow-hidden md:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] bg-transparent"
              >
                <img 
                  src="/global_dispatch.png"
                  alt="Veda Beauty Global Dispatch"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
            
          </div>
        </SwiperSlide>
      </Swiper>

    </div>
  );
};

export default HeroSection;

