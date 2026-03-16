// Product Service - Business logic layer
// Calls productApi for data
import productApi from "@/domains/product/api/productApi";

const productService = {
  // Get all products with filters
  getProducts: async (filters = {}) => {
    try {
      const response = await productApi.getAllProducts(filters);
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  },

  // Get single product by ID
  getProductById: async (productId) => {
    try {
      const response = await productApi.getProductById(productId);
      return response.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  },

  // Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    try {
      const response = await productApi.getRelatedProducts(productId, limit);
      return response.data;
    } catch (error) {
      console.error("Error fetching related products:", error);
      throw error;
    }
  },

  // Get featured products
  getFeaturedProducts: async (limit = 6) => {
    try {
      const response = await productApi.getFeaturedProducts(limit);
      return response.data;
    } catch (error) {
      console.error("Error fetching featured products:", error);
      throw error;
    }
  },

  // Get flash sale products
  getFlashSaleProducts: async () => {
    try {
      const response = await productApi.getFlashSaleProducts();
      return response.data;
    } catch (error) {
      console.error("Error fetching flash sale products:", error);
      throw error;
    }
  },

  // Search products
  searchProducts: async (searchTerm) => {
    return this.getProducts({ search: searchTerm });
  },

  // Filter products by price range
  getProductsByPriceRange: async (minPrice, maxPrice) => {
    return this.getProducts({ minPrice, maxPrice });
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    return this.getProducts({ categoryId });
  },
};

export default productService;
