import React from 'react';
import ProductCard from '../ui/ProductCard';

const ProductSection = ({ products }) => {
  return (
    /* 
       Matching the Category Page's slider pattern exactly:
       - -mx-4 and px-4 for full-bleed edge-to-edge scrolling.
       - gap-4 for consistent spacing.
       - w-[160px] for consistent card sizing on mobile.
    */
    <div className="overflow-x-auto no-scrollbar scroll-smooth">
      <div className="flex gap-4 pb-8 w-max px-4">
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className="flex-shrink-0 w-[160px] md:w-[280px]"
          >
            <ProductCard 
              product={product} 
              priority={index < 4} 
            />
          </div>
        ))}
        {/* Physical spacer to ensure the last item is fully visible and has room */}
        <div className="w-12 flex-shrink-0" aria-hidden="true" />
      </div>
    </div>
  );
};

export default ProductSection;
