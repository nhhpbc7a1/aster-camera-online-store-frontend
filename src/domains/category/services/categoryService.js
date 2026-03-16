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

  // Create category
  createCategory: async (categoryData) => {
    try {
      const response = await categoryApi.createCategory(categoryData);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Update category
  updateCategory: async (categoryId, categoryData) => {
    try {
      const response = await categoryApi.updateCategory(categoryId, categoryData);
      return response.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // Delete category
  deleteCategory: async (categoryId) => {
    try {
      const response = await categoryApi.deleteCategory(categoryId);
      return response;
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },

  // Create subcategory
  createSubcategory: async (subcategoryData) => {
    try {
      const response = await categoryApi.createSubcategory(subcategoryData);
      return response.data;
    } catch (error) {
      console.error("Error creating subcategory:", error);
      throw error;
    }
  },

  // Update subcategory
  updateSubcategory: async (subcategoryId, subcategoryData) => {
    try {
      const response = await categoryApi.updateSubcategory(subcategoryId, subcategoryData);
      return response.data;
    } catch (error) {
      console.error("Error updating subcategory:", error);
      throw error;
    }
  },

  // Delete subcategory
  deleteSubcategory: async (subcategoryId) => {
    try {
      const response = await categoryApi.deleteSubcategory(subcategoryId);
      return response;
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      throw error;
    }
  },
};

export default categoryService;
