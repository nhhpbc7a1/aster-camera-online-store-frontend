// Store Service - Business logic layer
import storeApi from "@/domains/store/api/storeApi";

const storeService = {
  // Get all stores
  getAllStores: async (filters = {}) => {
    try {
      const response = await storeApi.getAllStores(filters);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single store by ID
  getStoreById: async (storeId) => {
    try {
      const response = await storeApi.getStoreById(storeId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new store (Admin only)
  createStore: async (storeData) => {
    try {
      const response = await storeApi.createStore(storeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update store (Admin only)
  updateStore: async (storeId, storeData) => {
    try {
      const response = await storeApi.updateStore(storeId, storeData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete store (Admin only)
  deleteStore: async (storeId) => {
    try {
      const response = await storeApi.deleteStore(storeId);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default storeService;
