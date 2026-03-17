import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import categoryService from "@/domains/category/services/categoryService";
import productService from "@/domains/product/services/productService";

function AdminCategoryPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Reload categories when route changes (e.g., navigating back from form)
  useEffect(() => {
    loadData();
  }, [location.pathname]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [categoriesData, productsData] = await Promise.all([
        categoryService.getCategories(),
        productService.getProducts(),
      ]);
      setCategories(categoriesData);
      setProducts(productsData);
    } catch (err) {
      // no-op
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      try {
        await categoryService.deleteCategory(categoryId);
        alert("Danh mục đã được xóa thành công!");
        await loadData();
      } catch (err) {
        alert(
          "Không thể xóa danh mục: " +
            (err.response?.data?.message || err.message || "Lỗi không xác định")
        );
      }
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate real product count per category
  const getCategoryProductCount = (categoryId) => {
    return products.filter((p) => p.categoryId === categoryId).length;
  };

  const stats = {
    total: categories.length,
    totalProducts: products.length,
    totalSubcategories: categories.reduce(
      (sum, cat) => sum + (cat.subcategories?.length || 0),
      0
    ),
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Danh mục</h1>
          <p className="text-gray-600 mt-1">
            Quản lý tất cả danh mục sản phẩm ({categories.length})
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/categories/add")}
          className="btn btn-primary"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Thêm Danh mục Mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng Danh mục</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
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
              <p className="text-2xl font-bold mt-1">{stats.totalProducts}</p>
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
              <p className="text-2xl font-bold mt-1">{stats.totalSubcategories}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-layer-group text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border">
        <label className="block text-sm font-semibold mb-2">
          <i className="fa-solid fa-search mr-2"></i>
          Tìm kiếm danh mục
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập tên danh mục..."
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
        />
      </div>

      {/* Categories Table */}
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
                  Danh mục Con
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
              {filteredCategories.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <i className="fa-solid fa-folder-open text-4xl mb-2 block text-gray-300"></i>
                    {searchTerm
                      ? "Không tìm thấy danh mục"
                      : "Chưa có danh mục nào"}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden border flex-shrink-0">
                        <img
                          src={
                            category.imageUrl ||
                            "https://via.placeholder.com/100"
                          }
                          alt={category.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/100";
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold">{category.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        ID: {category.id}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-xs">
                      <p className="line-clamp-2 text-sm">
                        {category.description || "Chưa có mô tả"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {category.subcategories &&
                      category.subcategories.length > 0 ? (
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            {category.subcategories.length}
                          </span>
                          <div className="mt-2 text-xs text-left">
                            {category.subcategories.slice(0, 3).map((sub) => (
                              <div
                                key={sub.id}
                                className="text-gray-600 truncate"
                              >
                                • {sub.name}
                              </div>
                            ))}
                            {category.subcategories.length > 3 && (
                              <div className="text-gray-400 italic">
                                +{category.subcategories.length - 3} khác...
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Không có
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {getCategoryProductCount(category.id)}
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
                          onClick={() =>
                            navigate(`/admin/categories/edit/${category.id}`)
                          }
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
    </div>
  );
}

export default AdminCategoryPage;
