import apiClient, { handleApiError } from '@/core/api/apiClient';

const productApi = {
  // Get all products
  getAllProducts: async (filters = {}) => {
    try {
      // For admin pages, fetch all products by setting a high limit
      // Default limit=100 to show more products in admin panel
      const params = {
        limit: 100,
        ...filters,
      };
      const response = await apiClient.get('/products', { params });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      const response = await apiClient.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    try {
      const response = await apiClient.get(`/products/${productId}/related`, {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get featured products
  getFeaturedProducts: async (limit = 6) => {
    try {
      const response = await apiClient.get('/products/featured', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get flash sale products
  getFlashSaleProducts: async () => {
    try {
      const response = await apiClient.get('/products/flash-sale');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Create product
  createProduct: async (productData) => {
    try {
      const response = await apiClient.post('/products', productData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Update product
  updateProduct: async (productId, productData) => {
    try {
      const response = await apiClient.put(`/products/${productId}`, productData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Delete product
  deleteProduct: async (productId) => {
    try {
      const response = await apiClient.delete(`/products/${productId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default productApi;
