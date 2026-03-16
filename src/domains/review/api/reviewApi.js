import apiClient from "@/core/api/apiClient";

const reviewApi = {
  getAllReviews: async (filters = {}) => {
    try {
      const response = await apiClient.get("/reviews", { params: filters });
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }
  },

  getReviewById: async (reviewId) => {
    try {
      const response = await apiClient.get(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching review:", error);
      throw error;
    }
  },

  createReview: async (reviewData) => {
    try {
      const response = await apiClient.post("/reviews", reviewData);
      return response.data;
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  },

  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await apiClient.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error("Error updating review:", error);
      throw error;
    }
  },

  deleteReview: async (reviewId) => {
    try {
      const response = await apiClient.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  },
};

export default reviewApi;
