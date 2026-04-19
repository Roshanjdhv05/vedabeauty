import React from 'react';
import ProductCard from '../ui/ProductCard';

const ProductSection = ({ products }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 overflow-hidden">
      {/* Premium Horizontal Slider - Mobile Stable */}
      <div className="flex overflow-x-auto no-scrollbar gap-4 md:gap-6 pb-6 -mx-4 px-4 scroll-smooth">
        {products.map((product) => (
          <div key={product.id} className="w-[180px] md:w-[280px] flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
