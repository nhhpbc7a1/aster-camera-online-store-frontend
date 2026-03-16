import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import productService from "@/domains/product/services/productService";
import categoryService from "@/domains/category/services/categoryService";

function AdminProductPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      const updatedProducts = products.filter((prod) => prod.id !== productId);
      setProducts(updatedProducts);
      alert("Sản phẩm đã được xóa!");
    }
  };

  const handleDuplicateProduct = (product) => {
    const duplicated = {
      ...product,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
      name: `${product.name} (Copy)`,
    };
    setProducts([...products, duplicated]);
    alert("Sản phẩm đã được sao chép!");
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      filterCategory === "all" ||
      product.categoryId === parseInt(filterCategory);
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    outOfStock: products.filter((p) => !p.inStock).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    featured: products.filter((p) => p.isFeatured).length,
    flashSale: products.filter((p) => p.isFlashSale).length,
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Sản phẩm</h1>
          <p className="text-gray-600 mt-1">
            Quản lý tất cả sản phẩm trong cửa hàng ({products.length})
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="btn btn-primary"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Thêm Sản phẩm Mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng SP</p>
              <p className="text-2xl font-bold mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-box text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Còn hàng</p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {stats.inStock}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-check-circle text-green-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hết hàng</p>
              <p className="text-2xl font-bold mt-1 text-red-600">
                {stats.outOfStock}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-times-circle text-red-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Nổi bật</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">
                {stats.featured}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-star text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Flash Sale</p>
              <p className="text-2xl font-bold mt-1 text-orange-600">
                {stats.flashSale}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-bolt text-orange-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng GT</p>
              <p className="text-2xl font-bold mt-1">
                {(stats.totalValue / 1000000).toFixed(0)}M
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-dollar-sign text-purple-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              <i className="fa-solid fa-search mr-2"></i>
              Tìm kiếm sản phẩm
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên sản phẩm..."
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              <i className="fa-solid fa-filter mr-2"></i>
              Lọc theo danh mục
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
            >
              <option value="all">Tất cả danh mục</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} (
                  {products.filter((p) => p.categoryId === cat.id).length})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-sm">
                  Sản phẩm
                </th>
                <th className="text-left px-6 py-3 font-semibold text-sm">
                  Danh mục
                </th>
                <th className="text-center px-6 py-3 font-semibold text-sm">
                  Giá
                </th>
                <th className="text-center px-6 py-3 font-semibold text-sm">
                  Tồn kho
                </th>
                <th className="text-center px-6 py-3 font-semibold text-sm">
                  Trạng thái
                </th>
                <th className="text-center px-6 py-3 font-semibold text-sm">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <i className="fa-solid fa-box-open text-4xl mb-2 block text-gray-300"></i>
                    {searchTerm || filterCategory !== "all"
                      ? "Không tìm thấy sản phẩm"
                      : "Chưa có sản phẩm nào"}
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden border flex-shrink-0">
                          <img
                            src={
                              product.image ||
                              "https://via.placeholder.com/100"
                            }
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            ID: {product.id}
                          </p>
                          <div className="flex gap-1 mt-1">
                            {product.isFeatured && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                <i className="fa-solid fa-star mr-1"></i>
                                Nổi bật
                              </span>
                            )}
                            {product.isFlashSale && (
                              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                <i className="fa-solid fa-bolt mr-1"></i>
                                Flash
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.category || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div>
                        <p className="font-semibold text-sm">
                          {(product.salePrice || product.price).toLocaleString("vi-VN")}đ
                        </p>
                        {product.salePrice &&
                          product.salePrice < product.price && (
                            <>
                              <p className="text-xs text-gray-400 line-through">
                                {product.price.toLocaleString("vi-VN")}đ
                              </p>
                              <span className="inline-block mt-1 px-1.5 py-0.5 bg-red-100 text-red-600 text-xs font-medium rounded">
                                -{product.discount}%
                              </span>
                            </>
                          )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.quantity > 10
                            ? "bg-green-100 text-green-800"
                            : product.quantity > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.inStock
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.inStock ? (
                          <>
                            <i className="fa-solid fa-check mr-1"></i>
                            Còn hàng
                          </>
                        ) : (
                          <>
                            <i className="fa-solid fa-times mr-1"></i>
                            Hết hàng
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                          className="px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Chỉnh sửa"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </button>
                        <button
                          onClick={() => handleDuplicateProduct(product)}
                          className="px-2 py-1 text-sm font-medium text-green-600 hover:bg-green-50 rounded transition"
                          title="Sao chép"
                        >
                          <i className="fa-solid fa-copy"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="px-2 py-1 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition"
                          title="Xóa"
                        >
                          <i className="fa-solid fa-trash"></i>
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

export default AdminProductPage;
