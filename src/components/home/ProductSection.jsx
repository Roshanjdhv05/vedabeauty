import React from 'react';
import ProductCard from '../ui/ProductCard';

const ProductSection = ({ products }) => {
  return (
    <div className="w-full relative">
      {/* 
         Robust Horizontal Slider with Large End-Padding
         - pl-4: Left padding to align with header
         - pr-[50%]: MASSIVE right padding to ensure last card can be pulled fully into view
         - snap-x snap-mandatory: Smooth mobile snapping experience
      */}
      <div className="flex overflow-x-auto gap-4 pl-4 pr-[50%] pb-6 scroll-smooth no-scrollbar snap-x snap-mandatory">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="w-[150px] md:w-[280px] flex-shrink-0 snap-start"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
