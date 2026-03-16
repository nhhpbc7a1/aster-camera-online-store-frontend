// Mock API layer - returns mock data initially
// Later: replace with actual API calls
import { mockProducts } from "@/domains/product/mockData/products";

// Simulates API delay
const apiDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

const productApi = {
  // Get all products
  getAllProducts: async (filters = {}) => {
    await apiDelay();

    let products = [...mockProducts];

    if (filters.categoryId) {
      products = products.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower),
      );
    }

    if (filters.minPrice !== undefined) {
      products = products.filter((p) => p.price >= filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      products = products.filter((p) => p.price <= filters.maxPrice);
    }

    if (filters.isFlashSale) {
      products = products.filter((p) => p.isFlashSale);
    }

    if (filters.isFeatured) {
      products = products.filter((p) => p.isFeatured);
    }

    return {
      data: products,
      total: products.length,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  },

  // Get product by ID
  getProductById: async (productId) => {
    await apiDelay();

    const product = mockProducts.find((p) => p.id === productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    return { data: product };
  },

  // Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    await apiDelay();

    const product = mockProducts.find((p) => p.id === productId);
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`);
    }

    const related = mockProducts
      .filter((p) => p.id !== productId && p.categoryId === product.categoryId)
      .slice(0, limit);

    return { data: related };
  },

  // Get featured products
  getFeaturedProducts: async (limit = 6) => {
    await apiDelay();

    const featured = mockProducts.filter((p) => p.isFeatured).slice(0, limit);

    return { data: featured };
  },

  // Get flash sale products
  getFlashSaleProducts: async () => {
    await apiDelay();

    const flashSale = mockProducts.filter((p) => p.isFlashSale);

    return { data: flashSale };
  },
};

export default productApi;
