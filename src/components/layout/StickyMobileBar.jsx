import React from 'react';
import { ShoppingBag, Star, Zap } from 'lucide-react';

const StickyMobileBar = ({ visible = false }) => {
  if (!visible) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 px-4 py-3 flex gap-3 z-50">
      <button className="flex-1 px-6 py-3 bg-white border-2 border-black text-black font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform">
        <Star className="w-5 h-5 fill-black" />
        Wishlist
      </button>
      <button className="flex-[2] px-6 py-3 bg-black text-white font-bold rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-lg shadow-black/20">
        <ShoppingBag className="w-5 h-5" />
        Add to Cart
      </button>
    </div>
  );
};

export default StickyMobileBar;
