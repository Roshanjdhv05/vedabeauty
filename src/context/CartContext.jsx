import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getCartItems, addToDBCart, removeFromDBCart, clearDBCart } from '../services/productService';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Synchronize Cart on Auth State Change
  useEffect(() => {
    const syncCart = async () => {
      setLoading(true);
      
      // Load local cart first for immediate fallback
      const localCart = localStorage.getItem('veda_cart');
      let parsedLocal = [];
      if (localCart) {
        try {
          const parsed = JSON.parse(localCart);
          if (Array.isArray(parsed)) parsedLocal = parsed;
        } catch (e) {
          console.error("Corrupted local cart data:", e);
        }
      }

      if (user) {
        // 1. Fetch current DB cart
        const dbItems = await getCartItems(user.id);
        
        if (dbItems && dbItems.length > 0) {
           // Trust DB if it has items
           const mappedDB = dbItems.map(item => ({ 
             ...(item.products || {}), 
             quantity: item.quantity,
             variant_id: item.variant_id,
             variant: item.product_variants
           }));
           setCart(mappedDB);
        } else if (parsedLocal.length > 0) {
           // DB is empty or failed, fallback to local storage
           setCart(parsedLocal);
           // Attempt to sync these back to DB silently
           parsedLocal.forEach(item => {
             addToDBCart(user.id, item.id, item.quantity, item.variant_id).catch(() => {});
           });
        } else {
           setCart([]);
        }
      } else {
        // Guest mode
        if (parsedLocal.length > 0) setCart(parsedLocal);
      }
      setLoading(false);
    };
    
    syncCart();
  }, [user]);

  // Persist Cart to localStorage
  useEffect(() => {
    localStorage.setItem('veda_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product, variantId = null, variant = null) => {
    // Guard: if user is not logged in, redirect to login page
    if (!user) {
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    // 1. Optimistically update local state immediately
    const existing = cart.find((item) => item.id === product.id && item.variant_id === variantId);
    const newQuantity = existing ? existing.quantity + 1 : 1;

    setCart((prev) => {
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.variant_id === variantId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, variant_id: variantId, variant }];
    });

    // 2. Sync with DB in background
    try {
      const { error } = await addToDBCart(user.id, product.id, newQuantity, variantId);
      if (error) {
        console.warn('Cart DB Sync failed (Check RLS policies):', error.message);
      }
    } catch (e) {
      console.error('Cart DB Sync Exception:', e);
    }
  };

  const removeFromCart = async (productId, variantId = null) => {
    if (user) {
      const { error } = await removeFromDBCart(user.id, productId, variantId);
      if (error) return;
    }
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.variant_id === variantId)));
  };

  const clearCart = async () => {
    if (user) {
      const { error } = await clearDBCart(user.id);
      if (error) return;
    }
    setCart([]);
    localStorage.removeItem('veda_cart');
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => {
    const itemPrice = item.variant?.price || item.price;
    return total + (itemPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
