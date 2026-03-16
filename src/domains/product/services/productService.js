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
    return productService.getProducts({ search: searchTerm });
  },

  // Filter products by price range
  getProductsByPriceRange: async (minPrice, maxPrice) => {
    return productService.getProducts({ minPrice, maxPrice });
  },

  // Get products by category
  getProductsByCategory: async (categoryId) => {
    return productService.getProducts({ categoryId });
  },

  // Create new product (Admin only)
  createProduct: async (productData) => {
    try {
      const response = await productApi.createProduct(productData);
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },

  // Update product (Admin only)
  updateProduct: async (productId, productData) => {
    try {
      const response = await productApi.updateProduct(productId, productData);
      return response.data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  },

  // Delete product (Admin only)
  deleteProduct: async (productId) => {
    try {
      const response = await productApi.deleteProduct(productId);
      return response.data;
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  },
};

export default productService;
