// Helper function to get category name from categoryId
import { mockCategories } from '@/domains/category/mockData/categories';

export const getCategoryName = (categoryId) => {
    if (!categoryId) return null;
    const category = mockCategories.find(cat => cat.id === categoryId);
    return category?.name || null;
};

export const getCategorySlug = (categoryId) => {
    if (!categoryId) return null;
    const category = mockCategories.find(cat => cat.id === categoryId);
    return category?.slug || null;
};

export const getSubcategoryName = (categoryId, subcategoryId) => {
    if (!categoryId || !subcategoryId) return null;
    const category = mockCategories.find(cat => cat.id === categoryId);
    if (!category) return null;
    const subcategory = category.subcategories?.find(sub => sub.id === subcategoryId);
    return subcategory?.name || null;
};

export const getSubcategorySlug = (categoryId, subcategoryId) => {
    if (!categoryId || !subcategoryId) return null;
    const category = mockCategories.find(cat => cat.id === categoryId);
    if (!category) return null;
    const subcategory = category.subcategories?.find(sub => sub.id === subcategoryId);
    return subcategory?.slug || null;
};
