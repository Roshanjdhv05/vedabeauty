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
      className="relative w-full overflow-hidden bg-background"
      style={{ height: 'clamp(280px, 52vw, 650px)' }}
    >
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation={false}
        breakpoints={{ 768: { navigation: true } }}
        loop={true}
        className="w-full h-full"
      >

        {/* ── Slide 0: Welcome Banner ── */}
        <SwiperSlide>
          <div className="relative w-full h-full flex flex-row bg-background overflow-hidden">

            {/* LEFT */}
            <div className={leftPanel}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-[7px] md:text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase mb-1 md:mb-4 block">
                  Veda Beauty Exclusive
                </span>
                <h1 className="text-sm sm:text-lg md:text-5xl lg:text-6xl font-serif font-bold text-[#1A1A1A] mb-1 md:mb-8 leading-[1.2]">
                  Your Favorite <br />
                  <span className="text-[#D4AF37] italic">Beauty Brands,</span> <br />
                  All in One Place
                </h1>
                <p className="text-[9px] sm:text-xs md:text-xl text-gray-600 mb-2 md:mb-12 max-w-md font-medium leading-relaxed">
                  Shop top cosmetic brands with trusted quality and amazing offers
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 15px 30px -5px rgba(212,175,55,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-fit px-3 sm:px-5 md:px-12 py-1.5 md:py-4 bg-[#D4AF37] text-white text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_10px_20px_-5px_rgba(212,175,55,0.3)] transition-all"
                >
                  Explore Now
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT */}
            <div className={rightPanel}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className={imageContainer}
              >
                <img src="/hero_poster.jpg" alt="Veda Beauty Brands" className="w-full h-full object-cover" />
              </motion.div>
            </div>

          </div>
        </SwiperSlide>

        {/* ── Slide 1: Special Offers Banner ── */}
        <SwiperSlide>
          <div className="relative w-full h-full flex flex-row bg-background overflow-hidden">

            {/* LEFT */}
            <div className={leftPanel}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-[7px] md:text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase mb-1 md:mb-4 block">
                  Limited Time Deals
                </span>
                <h1 className="text-sm sm:text-lg md:text-5xl lg:text-6xl font-serif font-bold text-[#1A1A1A] mb-1 md:mb-6 leading-[1.2]">
                  Special{' '}
                  <span className="text-[#D4AF37] italic">Combo</span>{' '}
                  Offers
                </h1>
                <p className="text-[9px] sm:text-xs md:text-lg text-gray-600 mb-2 md:mb-10 max-w-md font-medium leading-relaxed">
                  Handpicked combos from top brands — up to 30% off!
                </p>
                {/* Pills — desktop only */}
                <div className="hidden md:flex flex-wrap gap-2 mb-8">
                  {['Insight 30% OFF', 'Mars 25% OFF', 'Pilgrim 25% OFF'].map(label => (
                    <span key={label} className="text-[10px] font-bold bg-[#D4AF37]/10 text-[#c49b2e] border border-[#D4AF37]/30 px-3 py-1 rounded-full uppercase tracking-wide">
                      {label}
                    </span>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 15px 30px -5px rgba(212,175,55,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/offers')}
                  className="w-fit px-3 sm:px-5 md:px-10 py-1.5 md:py-4 bg-[#D4AF37] text-white text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_10px_20px_-5px_rgba(212,175,55,0.3)] transition-all"
                  id="hero-offer-banner-cta"
                >
                  🎁 Shop Offers
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT */}
            <div className={rightPanel}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className={`${imageContainer} cursor-pointer`}
                onClick={() => navigate('/offers')}
              >
                <img src="/offer.png" alt="Special Combo Offers" className="w-full h-full object-cover object-center md:hidden" />
                <img src="/offerban.png" alt="Special Combo Offers" className="hidden md:block w-full h-full object-cover object-center" />
              </motion.div>
            </div>

          </div>
        </SwiperSlide>

        {/* ── Slide 2: Global Dispatch Banner ── */}
        <SwiperSlide>
          <div className="relative w-full h-full flex flex-row bg-background overflow-hidden">

            {/* LEFT */}
            <div className={leftPanel}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-[7px] md:text-xs font-bold text-[#D4AF37] tracking-[0.3em] uppercase mb-1 md:mb-4 block">
                  Business Ready Shipping
                </span>
                <h1 className="text-sm sm:text-lg md:text-5xl lg:text-7xl font-serif font-bold text-[#1A1A1A] mb-1 md:mb-8 leading-[1.2]">
                  Fast Global <br />
                  Dispatch &amp; <br className="hidden md:block" />
                  Bulk Loyalty
                </h1>
                <p className="text-[9px] sm:text-xs md:text-xl text-gray-600 mb-2 md:mb-12 max-w-md font-medium leading-relaxed">
                  Priority shipping within 24 hours for all professional orders.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 15px 30px -5px rgba(212,175,55,0.4)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-fit px-3 sm:px-5 md:px-12 py-1.5 md:py-4 bg-[#D4AF37] text-white text-[8px] md:text-xs font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_10px_20px_-5px_rgba(212,175,55,0.3)] transition-all"
                >
                  Shop Now
                </motion.button>
              </motion.div>
            </div>

            {/* RIGHT */}
            <div className={rightPanel}>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                className={imageContainer}
              >
                <img src="/global_dispatch.png" alt="Veda Beauty Global Dispatch" className="w-full h-full object-cover" />
              </motion.div>
            </div>

          </div>
        </SwiperSlide>

      </Swiper>
    </div>
  );
};

export default HeroSection;
