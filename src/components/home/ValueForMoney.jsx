import React, { useState } from 'react';
import { motion } from 'framer-motion';

const priceDeals = [
  { id: 99,  label: 'Under ₹99', color: 'bg-[#FFF9C4]', borderColor: 'border-[#FFF176]', textColor: 'text-[#827717]' },
  { id: 199, label: 'Under ₹199', color: 'bg-[#FCE4EC]', borderColor: 'border-[#F8BBD0]', textColor: 'text-[#880E4F]' },
  { id: 299, label: 'Under ₹299', color: 'bg-[#E8F5E9]', borderColor: 'border-[#C8E6C9]', textColor: 'text-[#1B5E20]' },
  { id: 499, label: 'Under ₹499', color: 'bg-[#E3F2FD]', borderColor: 'border-[#BBDEFB]', textColor: 'text-[#0D47A1]' },
];

const ValueForMoney = ({ onFilterChange }) => {
  const [activeTab, setActiveTab] = useState(499);

  return (
    <section className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-center mb-10 text-black">
          Wholesale Deals by Price
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {priceDeals.map((deal) => (
            <motion.div
              key={deal.id}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab(deal.id);
                onFilterChange && onFilterChange(deal.id);
              }}
              className={`${deal.color} ${deal.borderColor} border-2 rounded-[2rem] p-6 md:p-10 flex items-center justify-between cursor-pointer transition-all duration-300 hover:shadow-2xl relative overflow-hidden group ${
                activeTab === deal.id ? 'ring-2 ring-accent ring-offset-4' : ''
              }`}
            >
              <div className="relative z-10">
                <h3 className={`text-lg md:text-2xl font-serif font-bold ${deal.textColor} transition-transform group-hover:scale-105`}>
                  {deal.label}
                </h3>
              </div>
              
              <div className={`${deal.textColor} opacity-20 transition-opacity`}>
                <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center font-serif text-2xl font-bold">
                  ₹
                </div>
              </div>

              {activeTab === deal.id && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-accent animate-pulse" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValueForMoney;
