import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, ShieldCheck, Truck, Sparkles, 
  CheckCircle2, Users, ShoppingBag, Star, ArrowRight
} from 'lucide-react';
import SEO from '../components/SEO';

const AboutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const stagger = {
    animate: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      <SEO 
        title="About Us"
        description="Learn more about Veda Beauty, your trusted destination for premium cosmetics in Thane. Discover our story, mission, and commitment to quality."
        keywords="about Veda Beauty, premium cosmetics store, beauty marketplace India"
      />
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-32 pb-20 px-4 bg-gradient-to-b from-[#F8C8DC]/40 to-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
            <span className="inline-block py-1 px-3 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-bold tracking-widest uppercase mb-6">
              Welcome to Veda Beauty
            </span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-black tracking-tighter leading-tight mb-6"
          >
            About <span className="italic text-[#F8C8DC]">Veda</span> Beauty
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto"
          >
            Your trusted destination for premium beauty products. We bring the world's best cosmetics right to your doorstep.
          </motion.p>
        </div>
      </section>

      {/* 2. OUR STORY */}
      <section className="py-16 px-4">
        <motion.div 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeIn}
          className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#F8C8DC]/20 text-center relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#F8C8DC]/20 rounded-full blur-3xl pointer-events-none" />
          <Heart className="w-8 h-8 text-[#D4AF37] mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-serif font-bold text-black mb-4">Our Story</h2>
          <p className="text-gray-600 leading-relaxed text-base md:text-lg">
            Veda Beauty is a curated marketplace dedicated to top cosmetic brands. We were born out of a simple desire: to make high-quality beauty products accessible to everyone without compromising on authenticity. Our focus has always been on providing an exceptional shopping experience with affordability and genuine products at our core.
          </p>
        </motion.div>
      </section>

      {/* 3. WHAT WE OFFER */}
      <section className="py-16 px-4 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-black mb-4">What We Offer</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need for a perfect beauty regimen.</p>
          </div>
          
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: ShoppingBag, title: "Wide Range of Brands", desc: "Explore collections from the most sought-after beauty brands." },
              { icon: Sparkles, title: "Affordable Pricing", desc: "Premium quality beauty products at prices you will love." },
              { icon: ShieldCheck, title: "Authentic Products", desc: "100% genuine products sourced directly from manufacturers." },
              { icon: Truck, title: "Fast Delivery", desc: "Quick and secure shipping to bring your favorites to your door." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                variants={fadeIn}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group text-center"
              >
                <div className="w-14 h-14 mx-auto bg-[#F8C8DC]/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-[#D4AF37]" />
                </div>
                <h3 className="font-bold text-black text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. WHY CHOOSE US */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2"
            >
              <div className="aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden relative">
                <img 
                  src="https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&q=80&w=800" 
                  alt="Beauty Products" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/20 backdrop-blur-md border border-white/30 p-6 rounded-2xl text-white">
                    <p className="font-serif italic text-xl">"Beauty that empowers you."</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full md:w-1/2 space-y-8"
            >
              <div>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-black mb-6">Why Choose Us</h2>
                <p className="text-gray-600 text-lg">
                  We go above and beyond to ensure your beauty shopping is seamless, secure, and satisfying.
                </p>
              </div>
              
              <div className="space-y-4">
                {[
                  "Trusted by thousands of customers nationwide",
                  "Carefully selected, premium quality brands",
                  "Easy, intuitive shopping experience",
                  "Secure checkout and safe payments"
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-xl hover:bg-[#F8C8DC]/10 transition-colors">
                    <CheckCircle2 className="w-6 h-6 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                    <p className="font-medium text-black">{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. MISSION & VISION */}
      <section className="py-16 px-4 bg-[#F8C8DC]/10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-3xl shadow-sm border border-[#F8C8DC]/20 text-center"
          >
            <h3 className="text-xl font-bold tracking-widest uppercase text-gray-400 mb-6">Our Mission</h3>
            <p className="text-2xl font-serif text-black leading-snug">
              To make high-quality, authentic beauty products accessible to everyone, everywhere.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: 0.2 }}
            className="bg-black p-10 rounded-3xl shadow-xl text-center"
          >
            <h3 className="text-xl font-bold tracking-widest uppercase text-[#D4AF37] mb-6">Our Vision</h3>
            <p className="text-2xl font-serif text-white leading-snug">
              To become the leading and most trusted beauty marketplace globally.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 6. CUSTOMER TRUST */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-black uppercase tracking-widest mb-12">The Numbers Speak</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { number: "1000+", label: "Products", icon: ShoppingBag },
              { number: "10+", label: "Top Brands", icon: Star },
              { number: "50k+", label: "Happy Customers", icon: Users }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="w-16 h-16 bg-[#F8C8DC]/30 rounded-full flex items-center justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-black" />
                </div>
                <h4 className="text-4xl font-serif font-bold text-black mb-2">{stat.number}</h4>
                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION */}
      <section className="py-16 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-black to-gray-900 rounded-[2.5rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none" />
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-6 relative z-10">
            Ready to upgrade your beauty routine?
          </h2>
          <p className="text-gray-400 mb-10 max-w-lg mx-auto relative z-10 text-lg">
            Explore our curated collections and find your new favorites today.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="group relative z-10 inline-flex items-center gap-3 bg-[#F8C8DC] text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-white transition-colors"
          >
            Shop Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </section>

    </div>
  );
};

export default AboutPage;
