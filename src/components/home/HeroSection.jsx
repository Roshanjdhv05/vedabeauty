import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const HeroSection = () => {
  const navigate = useNavigate();

  // Shared classes
  const leftPanel = "relative flex-1 h-full flex flex-col justify-center px-4 md:px-20 lg:px-32 py-4 md:py-12 text-left z-10";
  // Right panel: fixed width on mobile (44%), full flex-1 feeling on desktop
  const rightPanel = "w-[44%] md:flex-1 md:w-auto h-full p-3 md:p-10 bg-background flex items-center justify-center";
  // Image container: rounded card on mobile too
  const imageContainer = "w-full h-[80%] md:h-full rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-[0_8px_32px_-8px_rgba(0,0,0,0.18)] md:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.25)]";

  return (
    <div
      className="relative w-full overflow-hidden bg-background px-2 sm:px-4 md:px-8 py-2 md:py-4 max-w-7xl mx-auto"
      style={{ height: 'clamp(280px, 52vw, 650px)' }}
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={false}
        breakpoints={{ 768: { navigation: true } }}
        loop={true}
        className="w-full h-full rounded-2xl md:rounded-[2rem] shadow-sm overflow-hidden"
      >

        {/* ── Slide 0: Welcome Banner ── */}
        <SwiperSlide>
          <motion.div
            className="relative w-full h-full overflow-hidden cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            onClick={() => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <img
              src="/hero_slide1.jpg"
              alt="Your Favorite Beauty Brands, All in One Place"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </SwiperSlide>

        {/* ── Slide 1: Special Offers Banner ── */}
        <SwiperSlide>
          <motion.div
            className="relative w-full h-full overflow-hidden cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            onClick={() => navigate('/offers')}
          >
            <img
              src="/hero_slide2.jpg"
              alt="Special Combo Offers - Handpicked combos from top brands up to 30% off"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </SwiperSlide>

        {/* ── Slide 2: Global Dispatch Banner ── */}
        <SwiperSlide>
          <motion.div
            className="relative w-full h-full overflow-hidden cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            onClick={() => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' })}
          >
            <img
              src="/hero_slide3.jpg"
              alt="Fast Global Dispatch & 24 Hours Priority Shipping"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
        </SwiperSlide>

      </Swiper>
    </div>
  );
};

export default HeroSection;
