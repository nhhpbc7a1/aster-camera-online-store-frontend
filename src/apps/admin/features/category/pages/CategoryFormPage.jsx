import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import categoryService from "@/domains/category/services/categoryService";

function CategoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    imageUrl: "",
  });
  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState({ name: "", slug: "" });
  const [editingSubcategory, setEditingSubcategory] = useState(null);

  useEffect(() => {
    if (isEditMode) {
      loadCategory();
    }
  }, [id]);

  const loadCategory = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategoryById(id);
      setFormData({
        name: data.name,
        description: data.description || "",
        slug: data.slug,
        imageUrl: data.imageUrl || "",
      });
      setSubcategories(data.subcategories || []);
    } catch (err) {
      alert("Không thể tải thông tin danh mục!");
      navigate("/admin/categories");
    } finally {
      setLoading(false);
    }
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNameChange = (e) => {
    const name = e.target.value;
    handleFormChange(e);
    if (!isEditMode) {
      setFormData((prev) => ({
        ...prev,
        slug: generateSlug(name),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên danh mục!");
      return;
    }

    if (!formData.slug.trim()) {
      alert("Vui lòng nhập slug!");
      return;
    }

    try {
      setSaving(true);
      if (isEditMode) {
        await categoryService.updateCategory(id, formData);
        alert("Cập nhật danh mục thành công!");
      } else {
        await categoryService.createCategory(formData);
        alert("Thêm danh mục thành công!");
      }
      navigate("/admin/categories");
    } catch (err) {
      alert(
        "Không thể lưu danh mục: " +
          (err.response?.data?.message || err.message || "Lỗi không xác định")
      );
    } finally {
      setSaving(false);
    }
  };

  // Subcategory handlers
  const handleAddSubcategory = async () => {
    if (!newSubcategory.name.trim()) {
      alert("Vui lòng nhập tên danh mục con!");
      return;
    }

    if (!isEditMode) {
      alert("Vui lòng lưu danh mục chính trước khi thêm danh mục con!");
      return;
    }

    try {
      const subcategoryData = {
        name: newSubcategory.name,
        slug: newSubcategory.slug || generateSlug(newSubcategory.name),
        categoryId: parseInt(id),
      };

      const createdSubcategory = await categoryService.createSubcategory(
        subcategoryData
      );
      setSubcategories([...subcategories, createdSubcategory]);
      setNewSubcategory({ name: "", slug: "" });
      alert("Thêm danh mục con thành công!");
    } catch (err) {
      alert(
        "Không thể thêm danh mục con: " +
          (err.response?.data?.message || err.message || "Lỗi không xác định")
      );
    }
  };

  const handleUpdateSubcategory = async (subcategoryId) => {
    if (!editingSubcategory.name.trim()) {
      alert("Vui lòng nhập tên danh mục con!");
      return;
    }

    try {
      const updatedSubcategory = await categoryService.updateSubcategory(
        subcategoryId,
        {
          name: editingSubcategory.name,
          slug: editingSubcategory.slug || generateSlug(editingSubcategory.name),
        }
      );

      setSubcategories(
        subcategories.map((sub) =>
          sub.id === subcategoryId ? updatedSubcategory : sub
        )
      );
      setEditingSubcategory(null);
      alert("Cập nhật danh mục con thành công!");
    } catch (err) {
      alert(
        "Không thể cập nhật danh mục con: " +
          (err.response?.data?.message || err.message || "Lỗi không xác định")
      );
    }
  };

  const handleDeleteSubcategory = async (subcategoryId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa danh mục con này?")) {
      return;
    }

    try {
      await categoryService.deleteSubcategory(subcategoryId);
      setSubcategories(subcategories.filter((sub) => sub.id !== subcategoryId));
      alert("Xóa danh mục con thành công!");
    } catch (err) {
      alert(
        "Không thể xóa danh mục con: " +
          (err.response?.data?.message || err.message || "Lỗi không xác định")
      );
    }
  };

  const handleSubcategoryNameChange = (name, isNew = false) => {
    const slug = generateSlug(name);
    if (isNew) {
      setNewSubcategory({ name, slug });
    } else {
      setEditingSubcategory((prev) => ({ ...prev, name, slug }));
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/categories")}
          className="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i>
          Quay lại danh sách
        </button>
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Chỉnh sửa Danh mục" : "Thêm Danh mục Mới"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode
            ? "Cập nhật thông tin danh mục và quản lý danh mục con"
            : "Điền thông tin để tạo danh mục mới"}
        </p>
      </div>

      {/* Category Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border">
        <h2 className="text-xl font-bold mb-4">Thông tin Danh mục</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Tên Danh mục <span className="text-red-500">*</span>
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
                Slug <span className="text-red-500">*</span>
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
            <label className="block text-sm font-semibold mb-2">Mô tả</label>
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
              URL Hình ảnh
            </label>
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleFormChange}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
              placeholder="https://example.com/image.jpg"
            />
            {formData.imageUrl && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Xem trước:</p>
                <div className="w-32 h-32 border rounded-md overflow-hidden">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150";
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 btn btn-primary disabled:opacity-50"
            >
              {saving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Đang lưu...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check mr-2"></i>
                  {isEditMode ? "Cập nhật Danh mục" : "Tạo Danh mục"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/categories")}
              className="flex-1 btn btn-outline"
            >
              <i className="fa-solid fa-xmark mr-2"></i>
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>

      {/* Subcategories Section (only in edit mode) */}
      {isEditMode && (
        <div className="bg-white rounded-lg shadow-lg p-6 border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">
              Danh mục Con ({subcategories.length})
            </h2>
          </div>

          {/* Add Subcategory Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold mb-3">Thêm Danh mục Con Mới</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={newSubcategory.name}
                  onChange={(e) =>
                    handleSubcategoryNameChange(e.target.value, true)
                  }
                  placeholder="Tên danh mục con (VD: Canon EOS)"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black text-sm"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubcategory.slug}
                  onChange={(e) =>
                    setNewSubcategory((prev) => ({
                      ...prev,
                      slug: e.target.value,
                    }))
                  }
                  placeholder="Slug (tự động tạo)"
                  className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:border-black text-sm"
                />
                <button
                  type="button"
                  onClick={handleAddSubcategory}
                  className="btn btn-primary text-sm whitespace-nowrap"
                >
                  <i className="fa-solid fa-plus mr-1"></i>
                  Thêm
                </button>
              </div>
            </div>
          </div>

          {/* Subcategories List */}
          {subcategories.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <i className="fa-solid fa-layer-group text-3xl mb-2 block text-gray-300"></i>
              <p>Chưa có danh mục con nào</p>
            </div>
          ) : (
            <div className="space-y-2">
              {subcategories.map((subcategory) => (
                <div
                  key={subcategory.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  {editingSubcategory?.id === subcategory.id ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          value={editingSubcategory.name}
                          onChange={(e) =>
                            handleSubcategoryNameChange(e.target.value, false)
                          }
                          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editingSubcategory.slug}
                          onChange={(e) =>
                            setEditingSubcategory((prev) => ({
                              ...prev,
                              slug: e.target.value,
                            }))
                          }
                          className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:border-black text-sm"
                        />
                        <button
                          onClick={() =>
                            handleUpdateSubcategory(subcategory.id)
                          }
                          className="px-3 py-2 text-sm font-medium text-green-600 hover:bg-green-50 rounded transition"
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                        <button
                          onClick={() => setEditingSubcategory(null)}
                          className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded transition"
                        >
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-semibold">{subcategory.name}</p>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                          {subcategory.slug}
                        </code>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setEditingSubcategory({
                              id: subcategory.id,
                              name: subcategory.name,
                              slug: subcategory.slug,
                            })
                          }
                          className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Chỉnh sửa"
                        >
                          <i className="fa-solid fa-pen-to-square mr-1"></i>
                          Sửa
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteSubcategory(subcategory.id)
                          }
                          className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition"
                          title="Xóa"
                        >
                          <i className="fa-solid fa-trash mr-1"></i>
                          Xóa
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CategoryFormPage;
