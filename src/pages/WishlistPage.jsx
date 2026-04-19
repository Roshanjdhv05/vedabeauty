import React from 'react';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ui/ProductCard';
import { useWishlist } from '../context/WishlistContext';

const WishlistPage = () => {
  const navigate = useNavigate();
  const { wishlist, loading } = useWishlist();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading your favorites...</div>;
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Heart className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8 max-w-xs">Save items you love to find them easily later.</p>
        <Link to="/" className="btn-primary">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-3xl font-bold tracking-tighter uppercase">My Wishlist ({wishlist.length})</h1>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default WishlistPage;
