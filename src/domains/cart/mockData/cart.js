export const mockCart = {
  id: "cart-1",
  userId: "user-1",
  items: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockCartItem = (product, quantity = 1) => ({
  id: `cart-item-${product.id}-${Date.now()}`,
  productId: product.id,
  product: product,
  quantity: quantity,
  price: product.price,
  subtotal: product.price * quantity,
  addedAt: new Date().toISOString(),
});
