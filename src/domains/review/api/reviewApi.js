import apiClient, { handleApiError } from '@/core/api/apiClient';

const reviewApi = {
  // Get all reviews
  getAllReviews: async (filters = {}) => {
    try {
      const response = await apiClient.get('/reviews', { params: filters });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Get review by ID
  getReviewById: async (reviewId) => {
    try {
      const response = await apiClient.get(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Create review (public)
  createReview: async (reviewData) => {
    try {
      const response = await apiClient.post('/reviews', reviewData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Update review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  // Admin: Delete review
  deleteReview: async (reviewId) => {
    try {
      const response = await apiClient.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default reviewApi;
