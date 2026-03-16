import React, { useState, useEffect } from "react";
import categoryService from "@/domains/category/services/categoryService";

function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    productCount: 0,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    handleFormChange(e);
    if (!editingId) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(name),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      // Update category
      console.log("Update category:", editingId, formData);
    } else {
      // Add category
      console.log("Add category:", formData);
    }
    handleResetForm();
  };

  const handleEditCategory = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      productCount: category.productCount,
    });
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      console.log("Delete category:", categoryId);
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      description: "",
      slug: "",
      productCount: 0,
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="p-6">Loading categories...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Categories Management</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add New Category
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingId ? "Edit Category" : "Add New Category"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Category Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                required
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., DSLR Cameras"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Slug</label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g., dslr-cameras"
                disabled={!editingId}
              />
              <p className="text-xs text-gray-500 mt-1">
                Auto-generated from name (disabled when editing)
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows="4"
                className="w-full border rounded px-3 py-2"
                placeholder="Category description..."
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {editingId ? "Update Category" : "Add Category"}
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left px-6 py-3 font-semibold">Name</th>
              <th className="text-left px-6 py-3 font-semibold">Description</th>
              <th className="text-center px-6 py-3 font-semibold">Products</th>
              <th className="text-center px-6 py-3 font-semibold">Slug</th>
              <th className="text-center px-6 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{category.name}</td>
                <td className="px-6 py-4 text-gray-600">
                  {category.description}
                </td>
                <td className="px-6 py-4 text-center">
                  {category.productCount}
                </td>
                <td className="px-6 py-4 text-center text-gray-600">
                  {category.slug}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleEditCategory(category)}
                    className="text-blue-600 hover:text-blue-800 mr-3 font-semibold"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-black hover:text-red-800 font-semibold"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminCategoryPage;
