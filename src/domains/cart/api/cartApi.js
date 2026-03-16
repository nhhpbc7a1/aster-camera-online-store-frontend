import { mockCart, mockCartItem } from "@/domains/cart/mockData/cart";

const apiDelay = () => new Promise((resolve) => setTimeout(resolve, 200));

// In-memory cart storage (will be replaced with API calls)
let cartStore = {
  ...mockCart,
  items: [],
};

const cartApi = {
  // Get user cart
  getCart: async () => {
    await apiDelay();
    return {
      data: {
        ...cartStore,
        total: cartStore.items.reduce((sum, item) => sum + item.subtotal, 0),
        itemCount: cartStore.items.length,
      },
    };
  },

  // Add item to cart
  addToCart: async (product, quantity = 1) => {
    await apiDelay();

    const existingItem = cartStore.items.find(
      (item) => item.productId === product.id,
    );

    if (existingItem) {
      existingItem.quantity += quantity;
      existingItem.subtotal = existingItem.price * existingItem.quantity;
    } else {
      cartStore.items.push(mockCartItem(product, quantity));
    }

    cartStore.updatedAt = new Date().toISOString();

    return {
      data: {
        ...cartStore,
        total: cartStore.items.reduce((sum, item) => sum + item.subtotal, 0),
        itemCount: cartStore.items.length,
      },
    };
  },

  // Update cart item quantity
  updateCartItem: async (cartItemId, quantity) => {
    await apiDelay();

    const item = cartStore.items.find((i) => i.id === cartItemId);
    if (!item) {
      throw new Error("Cart item not found");
    }

    if (quantity <= 0) {
      cartStore.items = cartStore.items.filter((i) => i.id !== cartItemId);
    } else {
      item.quantity = quantity;
      item.subtotal = item.price * quantity;
    }

    cartStore.updatedAt = new Date().toISOString();

    return {
      data: {
        ...cartStore,
        total: cartStore.items.reduce((sum, item) => sum + item.subtotal, 0),
        itemCount: cartStore.items.length,
      },
    };
  },

  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    await apiDelay();

    cartStore.items = cartStore.items.filter((item) => item.id !== cartItemId);
    cartStore.updatedAt = new Date().toISOString();

    return {
      data: {
        ...cartStore,
        total: cartStore.items.reduce((sum, item) => sum + item.subtotal, 0),
        itemCount: cartStore.items.length,
      },
    };
  },

  // Clear cart
  clearCart: async () => {
    await apiDelay();

    cartStore.items = [];
    cartStore.updatedAt = new Date().toISOString();

    return {
      data: {
        ...cartStore,
        total: 0,
        itemCount: 0,
      },
    };
  },
};

export default cartApi;
