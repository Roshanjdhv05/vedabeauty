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

  const slides = [
    {
      desktopSrc: '/hero_slide1.jpg',
      mobileSrc: '/phone%20screen%20posters/pster%20(1).png',
      alt: 'Your Favorite Beauty Brands, All in One Place',
      onClick: () => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' }),
    },
    {
      desktopSrc: '/hero_slide2.jpg',
      mobileSrc: '/phone%20screen%20posters/pster(2).png',
      alt: 'Special Combo Offers - Handpicked combos from top brands up to 30% off',
      onClick: () => navigate('/offers'),
    },
    {
      desktopSrc: '/hero_slide3.jpg',
      mobileSrc: '/phone%20screen%20posters/offer.png',
      alt: 'Fast Global Dispatch & 24 Hours Priority Shipping',
      onClick: () => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' }),
    },
  ];

  return (
    <div
      className="relative w-full overflow-hidden bg-background px-2 sm:px-4 md:px-8 py-2 md:py-4 max-w-7xl mx-auto h-[520px] md:h-[clamp(280px,52vw,650px)]"
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
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <motion.div
              className="relative w-full h-full overflow-hidden cursor-pointer"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              onClick={slide.onClick}
            >
              <picture className="w-full h-full block">
                {/* Mobile: phone-optimised poster */}
                <source media="(max-width: 767px)" srcSet={slide.mobileSrc} />
                {/* Desktop: original wide banner */}
                <img
                  src={slide.desktopSrc}
                  alt={slide.alt}
                  className="w-full h-full object-cover object-top"
                  style={{ display: 'block' }}
                />
              </picture>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroSection;
