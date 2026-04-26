import React from 'react';
import ProductCard from '../ui/ProductCard';

const ProductSection = ({ products }) => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Premium Horizontal Slider - Boxed Style to match Brand Page */}
      <div className="flex overflow-x-auto no-scrollbar gap-3 pb-6 px-4 scroll-smooth">
        {products.map((product) => (
          <div key={product.id} className="w-[180px] md:w-[calc((100%-48px)/5)] flex-shrink-0">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductSection;
