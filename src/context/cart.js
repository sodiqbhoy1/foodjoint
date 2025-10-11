"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNotification } from './notification';

const CartContext = createContext(null);

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const notification = useNotification();
  const showCartNotification = notification?.showCartNotification;

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('foodjoint_cart');
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (e) {
      // ignore parse errors
      console.warn('Failed to load cart from localStorage', e);
    }
  }, []);

  // Persist cart to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('foodjoint_cart', JSON.stringify(items));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const add = (product, qty = 1) => {
    // Update cart items
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.key === product.key);
      const isNewItem = idx === -1;
      
      if (isNewItem) {
        return [...prev, { ...product, qty }];
      } else {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return copy;
      }
    });

    // Show notification (only once, outside of setState)
    if (showCartNotification) {
      showCartNotification(product.title || product.name, qty);
    }
  };

  const update = (key, qty) => {
    setItems((prev) => prev.map((p) => (p.key === key ? { ...p, qty } : p)));
  };
  
  const remove = (key) => setItems((prev) => prev.filter((p) => p.key !== key));
  const clear = () => setItems([]);

  return (
    <CartContext.Provider value={{ items, add, update, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartContext;
