import cartApi from "@/domains/cart/api/cartApi";

const cartService = {
  // Get cart
  getCart: async () => {
    try {
      const response = await cartApi.getCart();
      return response.data;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  },

  // Add product to cart
  addToCart: async (product, quantity = 1) => {
    try {
      const response = await cartApi.addToCart(product, quantity);
      return response.data;
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId, quantity) => {
    try {
      const response = await cartApi.updateCartItem(cartItemId, quantity);
      return response.data;
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  },

  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    try {
      const response = await cartApi.removeFromCart(cartItemId);
      return response.data;
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  },

  // Clear cart
  clearCart: async () => {
    try {
      const response = await cartApi.clearCart();
      return response.data;
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  },
};

export default cartService;
