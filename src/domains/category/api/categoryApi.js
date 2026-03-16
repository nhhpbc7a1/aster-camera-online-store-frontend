import apiClient, { handleApiError } from '@/core/api/apiClient';

const categoryApi = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get category by ID
  getCategoryById: async (categoryId) => {
    try {
      const response = await apiClient.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/categories/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Create category
  createCategory: async (categoryData) => {
    try {
      const response = await apiClient.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Update category
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await apiClient.put(`/categories/${categoryId}`, categoryData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Delete category
  deleteCategory: async (categoryId) => {
    try {
      const response = await apiClient.delete(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Create subcategory
  createSubcategory: async (subcategoryData) => {
    try {
      const response = await apiClient.post('/categories/subcategories', subcategoryData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Update subcategory
  updateSubcategory: async (subcategoryId, subcategoryData) => {
    try {
      const response = await apiClient.put(`/categories/subcategories/${subcategoryId}`, subcategoryData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Delete subcategory
  deleteSubcategory: async (subcategoryId) => {
    try {
      const response = await apiClient.delete(`/categories/subcategories/${subcategoryId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default categoryApi;
