import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { Link } from 'react-router-dom';
import { getMarsImages } from '../../lib/marsImages';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(product.id);

  const [added, setAdded] = React.useState(false);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const brandNameRaw = product.brands?.name || product.brand || '';
  const brandName = brandNameRaw.trim();
  const isMars = brandName.toUpperCase().includes('MARS');
  
  // Resolve local Mars image if it exists
  let marsImage = null;
  if (isMars) {
    const images = getMarsImages(product.name);
    if (images.length > 0) marsImage = images[0];
  }

  const thumbnail = marsImage || product.image_url || 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=300';

  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-sm p-3 flex flex-col h-full group cursor-pointer border border-black/5 hover:shadow-xl transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 mb-3">
        <Link to={`/product/${product.id}`} className="block w-full h-full">
          <img 
            src={thumbnail} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null; // Prevent infinite loop
              e.target.src = 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?auto=format&fit=crop&q=80&w=300';
            }}
          />
        </Link>
        
        {/* Wishlist Button - Always Visible */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 z-10">
          <button 
            onClick={handleToggleWishlist}
            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-all active:scale-90"
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
          </button>
        </div>

        {product.discount > 0 && (
          <div className="absolute top-2 left-2 px-1.5 py-0.5 bg-red-500 text-white text-[9px] font-bold rounded">
            {product.discount}% OFF
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
          {brandName}
        </p>
        <Link 
          to={`/product/${product.id}`} 
          className="text-sm font-serif font-medium text-black line-clamp-2 h-10 group-hover:text-accent transition-colors block leading-tight"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold text-black">₹{product.price}</span>
          {product.original_price && (
            <span className="text-[10px] text-gray-400 line-through">₹{product.original_price}</span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button 
          onClick={handleAddToCart}
          className={`mt-3 w-full py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all flex items-center justify-center gap-2 ${
            added ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-accent'
          }`}
        >
          {added ? (
            <>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <ShoppingBag className="w-3.5 h-3.5" />
              </motion.div>
              Added!
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
