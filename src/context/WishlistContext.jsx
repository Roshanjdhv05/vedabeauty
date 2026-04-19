import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getWishlistItems, toggleDBWishlist } from '../services/productService';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist on auth state change
  useEffect(() => {
    const loadWishlist = async () => {
      if (user) {
        setLoading(true);
        try {
          const data = await getWishlistItems(user.id);
          // Map to include the product details directly in the array
          const items = data.map(item => ({
            ...(item.products || {}),
            wishlist_id: item.id
          }));
          setWishlist(items);
        } catch (error) {
          console.error("Failed to load DB wishlist:", error);
        } finally {
          setLoading(false);
        }
      } else {
        const saved = localStorage.getItem('veda_wishlist');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) setWishlist(parsed);
          } catch (e) {
            console.error("Corrupted guest wishlist:", e);
            localStorage.removeItem('veda_wishlist');
          }
        }
      }
    };
    loadWishlist();
  }, [user]);

  // Save guest wishlist to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('veda_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const toggleWishlist = async (product) => {
    const isPresent = wishlist.some(item => item.id === product.id);
    
    if (user) {
      const { error } = await toggleDBWishlist(user.id, product.id, !isPresent);
      if (!error) {
        if (isPresent) {
          setWishlist(prev => prev.filter(item => item.id !== product.id));
        } else {
          setWishlist(prev => [...prev, product]);
        }
      }
    } else {
      // Guest local update
      if (isPresent) {
        setWishlist(prev => prev.filter(item => item.id !== product.id));
      } else {
        setWishlist(prev => [...prev, product]);
      }
    }
  };

  const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
