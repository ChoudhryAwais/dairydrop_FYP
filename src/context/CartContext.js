'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from './myContext';

// Create the CartContext
export const CartContext = createContext();

// Custom hook to use the CartContext
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// CartProvider component to wrap the app
export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  // Initialize cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('dairydrop_cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing saved cart:', error);
        setCartItems([]);
      }
    }
    setLoading(false);
  }, []);

  // Sync cart with localStorage
  useEffect(() => {
    localStorage.setItem('dairydrop_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync cart with Firebase for authenticated users
  useEffect(() => {
    if (currentUser && cartItems.length > 0) {
      syncCartToFirebase(currentUser.uid, cartItems);
    } else if (currentUser && cartItems.length === 0) {
      deleteCartFromFirebase(currentUser.uid);
    }
  }, [currentUser, cartItems]);

  // Load cart from Firebase when user logs in
  useEffect(() => {
    if (currentUser) {
      loadCartFromFirebase(currentUser.uid);
    }
  }, [currentUser]);

  const syncCartToFirebase = async (uid, items) => {
    try {
      await setDoc(doc(db, 'users', uid, 'cart', 'items'), { items });
    } catch (error) {
      console.error('Error syncing cart to Firebase:', error);
    }
  };

  const deleteCartFromFirebase = async (uid) => {
    try {
      await deleteDoc(doc(db, 'users', uid, 'cart', 'items'));
    } catch (error) {
      console.error('Error deleting cart from Firebase:', error);
    }
  };

  const loadCartFromFirebase = async (uid) => {
    try {
      const cartDoc = await getDoc(doc(db, 'users', uid, 'cart', 'items'));
      if (cartDoc.exists()) {
        setCartItems(cartDoc.data().items || []);
      }
    } catch (error) {
      console.error('Error loading cart from Firebase:', error);
    }
  };

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    const currentCartQuantity = existingItem ? existingItem.quantity : 0;
    const availableStock = product.quantity || 0;
    const newTotalQuantity = currentCartQuantity + quantity;

    // Check if adding would exceed available stock
    if (newTotalQuantity > availableStock) {
      const canAdd = availableStock - currentCartQuantity;
      if (canAdd <= 0) {
        return {
          success: false,
          message: 'This item is already at maximum available quantity in your cart',
          availableToAdd: 0
        };
      }
      // Add only what's available
      setCartItems((prevItems) => {
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === product.id
              ? { ...item, quantity: availableStock }
              : item
          );
        }
        return [...prevItems, { ...product, stock: product.quantity, quantity: canAdd }];
      });
      return {
        success: true,
        message: `Only ${canAdd} item(s) available. Added maximum quantity to cart.`,
        availableToAdd: canAdd
      };
    }

    // Normal add to cart
    setCartItems((prevItems) => {
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, stock: product.quantity, quantity }];
    });
    
    return { success: true, message: 'Added to cart successfully' };
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  // Update cart item quantity
  const updateCartItem = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return { success: true };
    }

    const item = cartItems.find((item) => item.id === productId);
    if (!item) {
      return { success: false, message: 'Item not found in cart' };
    }

    const availableStock = item.stock || item.quantity || 0;
    
    // Check if new quantity exceeds available stock
    if (quantity > availableStock) {
      return {
        success: false,
        message: `Only ${availableStock} item(s) available in stock`,
        maxQuantity: availableStock
      };
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
    
    return { success: true };
  };

  // Clear entire cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = subtotal * 0.1;
    const total = subtotal + tax;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateCartItem,
    clearCart,
    calculateTotals,
    cartCount: cartItems.reduce((count, item) => count + item.quantity, 0),
  };

  return (
    <CartContext.Provider value={value}>
      {!loading && children}
    </CartContext.Provider>
  );
};
