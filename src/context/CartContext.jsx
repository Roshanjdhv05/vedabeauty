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
      if (user) {
        setLoading(true);
        // 1. Fetch current DB cart
        const dbItems = await getCartItems(user.id);
        
        // 2. Check for local guest items to merge
        const localCart = localStorage.getItem('veda_cart');
        if (localCart) {
          try {
            const guestItems = JSON.parse(localCart);
            if (Array.isArray(guestItems) && guestItems.length > 0) {
              // Merge guest items into DB
              for (const item of guestItems) {
                const existingInDB = dbItems.find(dbi => dbi.product_id === item.id);
                const newQuantity = existingInDB ? existingInDB.quantity + item.quantity : item.quantity;
                await addToDBCart(user.id, item.id, newQuantity);
              }
              // Clear local storage after successful merge
              localStorage.removeItem('veda_cart');
              // Refresh DB items after merge
              const updatedDBItems = await getCartItems(user.id);
              setCart(updatedDBItems.map(item => ({ ...(item.products || {}), quantity: item.quantity })));
            } else {
              setCart(dbItems.map(item => ({ ...(item.products || {}), quantity: item.quantity })));
            }
          } catch (e) {
            console.error("Failed to parse local cart:", e);
            setCart(dbItems.map(item => ({ ...(item.products || {}), quantity: item.quantity })));
          }
        } else {
          setCart(dbItems.map(item => ({ ...(item.products || {}), quantity: item.quantity })));
        }
        setLoading(false);
      } else {
        // Load from localStorage for guest
        const savedCart = localStorage.getItem('veda_cart');
        if (savedCart) {
          try {
            const parsed = JSON.parse(savedCart);
            if (Array.isArray(parsed)) setCart(parsed);
          } catch (e) {
            console.error("Corrupted local cart data:", e);
            localStorage.removeItem('veda_cart');
          }
        }
      }
    };
    syncCart();
  }, [user]);

  // Persist Guest Cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('veda_cart', JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = async (product) => {
    // 1. Optimistically update local state immediately
    const existing = cart.find((item) => item.id === product.id);
    const newQuantity = existing ? existing.quantity + 1 : 1;

    setCart((prev) => {
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    // 2. Sync with DB in background if user is logged in
    if (user) {
      try {
        const { error } = await addToDBCart(user.id, product.id, newQuantity);
        if (error) {
          console.warn('Cart DB Sync failed (Check RLS policies):', error.message);
          // We don't revert local state here to avoid jitter, 
          // but we log it for the developer to see in the console.
        }
      } catch (e) {
        console.error('Cart DB Sync Exception:', e);
      }
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      const { error } = await removeFromDBCart(user.id, productId);
      if (error) return;
    }
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = async () => {
    if (user) {
      const { error } = await clearDBCart(user.id);
      if (error) return;
    }
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal, loading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
