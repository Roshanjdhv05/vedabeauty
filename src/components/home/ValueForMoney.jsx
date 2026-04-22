import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const priceDeals = [
  { id: 99,  label: 'Under ₹99',  color: 'bg-[#FFF9C4]', borderColor: 'border-[#FFF176]', textColor: 'text-[#827717]' },
  { id: 199, label: 'Under ₹199', color: 'bg-[#FCE4EC]', borderColor: 'border-[#F8BBD0]', textColor: 'text-[#880E4F]' },
  { id: 299, label: 'Under ₹299', color: 'bg-[#E8F5E9]', borderColor: 'border-[#C8E6C9]', textColor: 'text-[#1B5E20]' },
  { id: 499, label: 'Under ₹499', color: 'bg-[#E3F2FD]', borderColor: 'border-[#BBDEFB]', textColor: 'text-[#0D47A1]' },
];

const ValueForMoney = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-8 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* SECTION TITLE - Align Left for consistency */}
        <div className="text-left mb-8">
          <h2 className="text-2xl md:text-5xl font-serif font-bold text-black mb-2">
            Value Store
          </h2>
          <div className="w-12 h-1 bg-accent mb-4" />
          <p className="text-[10px] md:text-sm text-gray-500 font-bold uppercase tracking-[0.3em]">
            Professional Quality • Wholesale Deals
          </p>
        </div>
        
        {/* CARD LAYOUT - Align Left */}
        <div className="flex flex-col gap-4 md:grid md:grid-cols-4 md:gap-6">
          {priceDeals.map((deal) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/deals?price=${deal.id}`)}
              className={`${deal.color} ${deal.borderColor} border-2 rounded-[2rem] p-5 flex justify-between items-center cursor-pointer transition-all shadow-sm hover:shadow-xl w-full max-w-[250px] md:max-w-full relative overflow-hidden group`}
            >
              <div className="relative z-10 flex-1 min-w-0">
                <h3 className={`text-xl md:text-2xl font-bold ${deal.textColor} truncate font-serif`}>
                  {deal.label}
                </h3>
                <p className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${deal.textColor} opacity-60 mt-1`}>
                  Shop Now →
                </p>
              </div>
              
              <div className={`${deal.textColor} opacity-20 flex-shrink-0 ml-4`}>
                <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center font-serif text-2xl font-bold">
                  ₹
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueForMoney;

