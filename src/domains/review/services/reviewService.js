import reviewApi from "@/domains/review/api/reviewApi";
import { mockReviews } from "@/domains/review/mockData/reviews";

const reviewService = {
  // Get all reviews
  getReviews: async (filters = {}) => {
    try {
      // Using mock data for now
      return mockReviews;
    } catch (error) {
      throw error;
    }
  },

  // Get review by ID
  getReviewById: async (reviewId) => {
    try {
      const review = mockReviews.find((r) => r.id === reviewId);
      if (!review) {
        throw new Error("Review not found");
      }
      return review;
    } catch (error) {
      throw error;
    }
  },

  // Create review
  createReview: async (reviewData) => {
    try {
      const response = await reviewApi.createReview(reviewData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update review
  updateReview: async (reviewId, reviewData) => {
    try {
      const response = await reviewApi.updateReview(reviewId, reviewData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete review
  deleteReview: async (reviewId) => {
    try {
      const response = await reviewApi.deleteReview(reviewId);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default reviewService;
