import React, { useState, useEffect } from "react";
import categoryService from "@/domains/category/services/categoryService";

function AdminCategoryPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    imageUrl: "",
    productCount: 0,
    subcategories: [],
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
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          imageUrl: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update category - would need API implementation
        const updatedCategories = categories.map((cat) =>
          cat.id === editingId ? { ...formData, id: editingId } : cat
        );
        setCategories(updatedCategories);
        alert("Category updated successfully!");
      } else {
        // Add category - would need API implementation
        const newCategory = {
          ...formData,
          id: Math.max(...categories.map((c) => c.id)) + 1,
          productCount: 0,
        };
        setCategories([...categories, newCategory]);
        alert("Category added successfully!");
      }
      handleResetForm();
    } catch (err) {
      console.error("Error saving category:", err);
      alert("Failed to save category");
    }
  };

  const handleEditCategory = (category) => {
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      imageUrl: category.imageUrl || "",
      productCount: category.productCount,
      subcategories: category.subcategories || [],
    });
    setImagePreview(category.imageUrl || null);
    setEditingId(category.id);
    setShowForm(true);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      const updatedCategories = categories.filter((cat) => cat.id !== categoryId);
      setCategories(updatedCategories);
      alert("Category deleted successfully!");
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      description: "",
      slug: "",
      imageUrl: "",
      productCount: 0,
      subcategories: [],
    });
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh mục...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Danh mục</h1>
          <p className="text-gray-600 mt-1">
            Quản lý tất cả danh mục sản phẩm ({categories.length})
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Thêm Danh mục Mới
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {editingId ? "Chỉnh sửa Danh mục" : "Thêm Danh mục Mới"}
            </h2>
            <button
              onClick={handleResetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tên Danh mục *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="VD: Máy ảnh Canon"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="VD: may-anh-canon"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tự động tạo từ tên (có thể chỉnh sửa)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Mô tả
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                rows="3"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                placeholder="Nhập mô tả cho danh mục..."
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Hình ảnh Danh mục
              </label>
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Hoặc nhập URL hình ảnh
                  </p>
                  <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleFormChange}
                    className="w-full border rounded-md px-3 py-2 mt-2 text-sm focus:outline-none focus:border-black"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                {(imagePreview || formData.imageUrl) && (
                  <div className="w-24 h-24 border rounded-md overflow-hidden">
                    <img
                      src={imagePreview || formData.imageUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button
                type="submit"
                className="flex-1 btn btn-primary"
              >
                <i className="fa-solid fa-check mr-2"></i>
                {editingId ? "Cập nhật Danh mục" : "Thêm Danh mục"}
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 btn btn-outline"
              >
                <i className="fa-solid fa-xmark mr-2"></i>
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-sm">
                  Hình ảnh
                </th>
                <th className="text-left px-6 py-3 font-semibold text-sm">
                  Tên Danh mục
                </th>
                <th className="text-left px-6 py-3 font-semibold text-sm">
                  Mô tả
                </th>
                <th className="text-center px-6 py-3 font-semibold text-sm">
                  Sản phẩm
                </th>
                <th className="text-center px-6 py-3 font-semibold text-sm">
                  Slug
                </th>
                <th className="text-center px-6 py-3 font-semibold text-sm">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <i className="fa-solid fa-folder-open text-4xl mb-2 block text-gray-300"></i>
                    Không có danh mục nào
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden border">
                        <img
                          src={category.imageUrl || "https://via.placeholder.com/100"}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{category.name}</p>
                      {category.subcategories && category.subcategories.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                          {category.subcategories.length} danh mục con
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs">
                      <p className="line-clamp-2 text-sm">
                        {category.description || "Chưa có mô tả"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {category.productCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {category.slug}
                      </code>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Chỉnh sửa"
                        >
                          <i className="fa-solid fa-pen-to-square mr-1"></i>
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(category.id)}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition"
                          title="Xóa"
                        >
                          <i className="fa-solid fa-trash mr-1"></i>
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng Danh mục</p>
              <p className="text-2xl font-bold mt-1">{categories.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-folder text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng Sản phẩm</p>
              <p className="text-2xl font-bold mt-1">
                {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-box text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Danh mục Con</p>
              <p className="text-2xl font-bold mt-1">
                {categories.reduce(
                  (sum, cat) => sum + (cat.subcategories?.length || 0),
                  0
                )}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-layer-group text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCategoryPage;
