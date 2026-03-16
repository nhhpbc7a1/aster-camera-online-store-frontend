import orderApi from "@/domains/order/api/order.api";

const orderService = {
  // Get user orders
  getUserOrders: async (userId) => {
    try {
      const response = await orderApi.getUserOrders(userId);
      return response.data;
    } catch (error) {
      console.error("Error fetching user orders:", error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await orderApi.getOrderById(orderId);
      return response.data;
    } catch (error) {
      console.error("Error fetching order:", error);
      throw error;
    }
  },

  // Create new order
  createOrder: async (orderData) => {
    try {
      const response = await orderApi.createOrder(orderData);
      return response.data;
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await orderApi.updateOrderStatus(orderId, status);
      return response.data;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await orderApi.cancelOrder(orderId);
      return response.data;
    } catch (error) {
      console.error("Error cancelling order:", error);
      throw error;
    }
  },

  // Track order
  trackOrder: async (trackingNumber) => {
    try {
      const response = await orderApi.trackOrder(trackingNumber);
      return response.data;
    } catch (error) {
      console.error("Error tracking order:", error);
      throw error;
    }
  },
};

export default orderService;
