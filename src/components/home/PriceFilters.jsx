import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign } from 'lucide-react';

const filters = [
  { label: 'Under ₹99', color: 'bg-[#FFF9C4]', borderColor: 'border-[#FFF176]', textColor: 'text-[#827717]' },
  { label: 'Under ₹199', color: 'bg-[#FCE4EC]', borderColor: 'border-[#F8BBD0]', textColor: 'text-[#880E4F]' },
  { label: 'Under ₹299', color: 'bg-[#E8F5E9]', borderColor: 'border-[#C8E6C9]', textColor: 'text-[#1B5E20]' },
  { label: 'Under ₹499', color: 'bg-[#E3F2FD]', borderColor: 'border-[#BBDEFB]', textColor: 'text-[#0D47A1]' },
];

const PriceFilters = () => {
  return (
    <section className="py-8 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
          {filters.map((filter, i) => (
            <motion.div
              key={filter.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              className={`${filter.color} ${filter.borderColor} border-2 rounded-[1.5rem] p-6 md:p-8 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all`}
            >
              <div className="absolute top-2 right-2 md:top-4 md:right-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign size={40} className={filter.textColor} />
              </div>
              <span className={`text-sm md:text-xl font-bold ${filter.textColor} tracking-tight`}>
                {filter.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PriceFilters;
