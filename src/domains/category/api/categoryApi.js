import { mockCategories } from "@/domains/category/mockData/categories";

const apiDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

const categoryApi = {
  // Get all categories
  getAllCategories: async () => {
    await apiDelay();
    return { data: mockCategories };
  },

  // Get category by ID
  getCategoryById: async (categoryId) => {
    await apiDelay();
    const category = mockCategories.find((c) => c.id === categoryId);
    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }
    return { data: category };
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    await apiDelay();
    const category = mockCategories.find((c) => c.slug === slug);
    if (!category) {
      throw new Error(`Category with slug ${slug} not found`);
    }
    return { data: category };
  },
};

export default categoryApi;
