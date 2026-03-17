import React, { createContext, useContext, useState, useCallback } from "react";
import cartService from "@/domains/cart/services/cartService";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    total: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize cart
  const initializeCart = useCallback(async () => {
    try {
      setLoading(true);
      const cartData = await cartService.getCart();
      setCart(cartData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add to cart
  const addToCart = useCallback(async (product, quantity = 1) => {
    try {
      setLoading(true);
      const updatedCart = await cartService.addToCart(product, quantity);
      setCart(updatedCart);
      setError(null);
      return updatedCart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Update cart item
  const updateCartItem = useCallback(async (cartItemId, quantity) => {
    try {
      setLoading(true);
      const updatedCart = await cartService.updateCartItem(
        cartItemId,
        quantity,
      );
      setCart(updatedCart);
      setError(null);
      return updatedCart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Remove from cart
  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      setLoading(true);
      const updatedCart = await cartService.removeFromCart(cartItemId);
      setCart(updatedCart);
      setError(null);
      return updatedCart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      setLoading(true);
      const updatedCart = await cartService.clearCart();
      setCart(updatedCart);
      setError(null);
      return updatedCart;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    cart,
    loading,
    error,
    initializeCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    itemCount: cart.itemCount || 0,
    cartTotal: cart.total || 0,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
