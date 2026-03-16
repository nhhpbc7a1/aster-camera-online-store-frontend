import categoryApi from "@/domains/category/api/categoryApi";

const categoryService = {
  // Get all categories
  getCategories: async () => {
    try {
      const response = await categoryApi.getAllCategories();
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Get category by ID
  getCategoryById: async (categoryId) => {
    try {
      const response = await categoryApi.getCategoryById(categoryId);
      return response.data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    try {
      const response = await categoryApi.getCategoryBySlug(slug);
      return response.data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  },
};

export default categoryService;
