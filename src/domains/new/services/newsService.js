// News Service - Business logic layer
// Calls newsApi for data
import newsApi from "@/domains/new/api/newsApi";

const newsService = {
  // Get all news with filters
  getNews: async (filters = {}) => {
    try {
      const response = await newsApi.getAllNews(filters);
      return response.data;
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  },

  // Get all news with pagination info
  getNewsWithPagination: async (filters = {}) => {
    try {
      const response = await newsApi.getAllNews(filters);
      return response;
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  },

  // Get single news by ID
  getNewsById: async (newsId) => {
    try {
      const response = await newsApi.getNewsById(newsId);
      return response.data;
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  },

  // Get single news by slug
  getNewsBySlug: async (slug) => {
    try {
      const response = await newsApi.getNewsBySlug(slug);
      return response.data;
    } catch (error) {
      console.error("Error fetching news:", error);
      throw error;
    }
  },

  // Get related news
  getRelatedNews: async (newsId, limit = 4) => {
    try {
      const response = await newsApi.getRelatedNews(newsId, limit);
      return response.data;
    } catch (error) {
      console.error("Error fetching related news:", error);
      throw error;
    }
  },

  // Get latest news
  getLatestNews: async (limit = 6) => {
    try {
      const response = await newsApi.getLatestNews(limit);
      return response.data;
    } catch (error) {
      console.error("Error fetching latest news:", error);
      throw error;
    }
  },

  // Search news
  searchNews: async (searchTerm) => {
    return this.getNews({ search: searchTerm });
  },

  // Get news by category
  getNewsByCategory: async (category) => {
    return this.getNews({ category });
  },
};

export default newsService;
