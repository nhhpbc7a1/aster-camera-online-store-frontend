import apiClient, { handleApiError } from '@/core/api/apiClient';

const storeApi = {
  // Public: Get all stores
  getAllStores: async (filters = {}) => {
    try {
      const response = await apiClient.get('/stores', { params: filters });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Public: Get store by ID
  getStoreById: async (storeId) => {
    try {
      const response = await apiClient.get(`/stores/${storeId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Create store
  createStore: async (storeData) => {
    try {
      const response = await apiClient.post('/stores', storeData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Update store
  updateStore: async (storeId, storeData) => {
    try {
      const response = await apiClient.put(`/stores/${storeId}`, storeData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Delete store
  deleteStore: async (storeId) => {
    try {
      const response = await apiClient.delete(`/stores/${storeId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default storeApi;
