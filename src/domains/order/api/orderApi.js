import apiClient, { handleApiError } from '@/core/api/apiClient';

const orderApi = {
  // Customer: Create order from cart
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Get all orders
  getAllOrders: async (filters = {}) => {
    try {
      const response = await apiClient.get('/orders', { params: filters });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Get order by ID
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Get order by order number
  getOrderByNumber: async (orderNumber) => {
    try {
      const response = await apiClient.get(`/orders/number/${orderNumber}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Update order
  updateOrder: async (orderId, orderData) => {
    try {
      const response = await apiClient.put(`/orders/${orderId}`, orderData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Delete order
  deleteOrder: async (orderId) => {
    try {
      const response = await apiClient.delete(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Customer: Get user orders
  getUserOrders: async (userId) => {
    try {
      const response = await apiClient.get('/orders', { params: { userId } });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiClient.put(`/orders/${orderId}`, { status });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Customer: Cancel order
  cancelOrder: async (orderId) => {
    try {
      const response = await apiClient.put(`/orders/${orderId}`, { 
        status: 'cancelled' 
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Customer: Track order by tracking number
  trackOrder: async (trackingNumber) => {
    try {
      // This might need a specific endpoint, for now using order number
      const response = await apiClient.get(`/orders/number/${trackingNumber}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default orderApi;
