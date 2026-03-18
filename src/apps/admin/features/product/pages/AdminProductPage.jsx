import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import productService from "@/domains/product/services/productService";
import categoryService from "@/domains/category/services/categoryService";
import { getCategoryName } from "@/utils/categoryHelpers";
import { formatCurrency } from "@/utils/currencyHelpers";

function AdminProductPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Reload products when route changes (e.g., navigating back from form)
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [location.pathname]); // Re-run when pathname changes

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getProducts();
      setProducts(data);
    } catch (err) {
      // no-op
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      // no-op
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await productService.deleteProduct(productId);
        alert("Sản phẩm đã được xóa thành công!");
        // Reload products list
        await loadProducts();
      } catch (err) {
        alert("Không thể xóa sản phẩm: " + (err.message || "Lỗi không xác định"));
      }
    }
  };

  const handleDuplicateProduct = async (product) => {
    try {
      const duplicated = {
        ...product,
        id: undefined, // Remove id so backend creates new one
        name: `${product.name} (Copy)`,
      };
      await productService.createProduct(duplicated);
      alert("Sản phẩm đã được sao chép thành công!");
      await loadProducts();
    } catch (err) {
      alert("Không thể sao chép sản phẩm: " + (err.message || "Lỗi không xác định"));
    }
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

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterCategory, searchTerm]);

  const goToPage = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const stats = {
    total: products.length,
    inStock: products.filter((p) => p.inStock).length,
    outOfStock: products.filter((p) => !p.inStock).length,
    totalValue: products.reduce((sum, p) => sum + p.price * p.quantity, 0),
    featured: products.filter((p) => p.isFeatured).length,
    flashSale: products.filter((p) => p.isFlashSale).length,
  };

  // Helper function to get subcategory name
  const getSubcategoryName = (categoryId, subcategoryId) => {
    if (!subcategoryId) return null;
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category?.subcategories) return null;
    const subcategory = category.subcategories.find((sub) => sub.id === subcategoryId);
    return subcategory?.name || null;
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
    <div className="p-6 max-[850px]:p-4 w-full overflow-x-hidden">
      <div className="flex justify-between items-center mb-6 max-[850px]:mb-4">
        <div>
          <h1 className="text-3xl max-[850px]:text-xl font-bold">Quản lý Sản phẩm</h1>
          <p className="text-gray-600 mt-1 max-[850px]:text-sm">
            Quản lý tất cả sản phẩm trong cửa hàng ({products.length})
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/products/add")}
          className="btn btn-primary max-[850px]:text-sm max-[850px]:px-3 max-[850px]:py-2"
        >
          <i className="fa-solid fa-plus mr-2 max-[850px]:mr-1"></i>
          <span className="max-[850px]:hidden">Thêm Sản phẩm Mới</span>
          <span className="min-[851px]:hidden">Thêm</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6 max-[850px]:grid-cols-2 max-[850px]:gap-2 max-[850px]:mb-4 w-full">
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

        <div className="bg-white rounded-lg shadow p-4 max-[850px]:p-2 border hidden lg:block">
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

        <div className="bg-white rounded-lg shadow p-4 max-[850px]:p-2 border hidden lg:block">
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

        <div className="bg-white rounded-lg shadow p-4 max-[850px]:p-2 border hidden lg:block">
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

        <div className="bg-white rounded-lg shadow p-4 max-[850px]:p-2 border hidden lg:block">
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
      <div className="bg-white rounded-lg shadow p-4 max-[850px]:p-3 mb-6 max-[850px]:mb-4 border w-full overflow-x-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-[850px]:gap-3 w-full">
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

          <div className="max-[850px]:hidden">
            <label className="block text-sm font-semibold mb-2">
              <i className="fa-solid fa-list mr-2"></i>
              Hiển thị mỗi trang
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
            >
              <option value={5}>5 sản phẩm</option>
              <option value={10}>10 sản phẩm</option>
              <option value={20}>20 sản phẩm</option>
              <option value={50}>50 sản phẩm</option>
              <option value={100}>100 sản phẩm</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border w-full">
        {/* Results Info */}
        <div className="px-6 max-[850px]:px-4 py-3 bg-gray-50 border-b">
          <p className="text-sm max-[850px]:text-xs text-gray-600">
            Hiển thị <span className="font-semibold">{startIndex + 1}</span> -{" "}
            <span className="font-semibold">
              {Math.min(endIndex, filteredProducts.length)}
            </span>{" "}
            trong tổng số{" "}
            <span className="font-semibold">{filteredProducts.length}</span> sản
            phẩm
          </p>
        </div>

        {/* Desktop Table - Full (XL screens) */}
        <div className="overflow-x-auto hidden xl:block w-full">
          <table className="w-full min-w-[1000px]">
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
                currentProducts.map((product) => (
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
                      <div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getCategoryName(product.categoryId) || "N/A"}
                        </span>
                        {product.subcategoryId && getSubcategoryName(product.categoryId, product.subcategoryId) && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              <i className="fa-solid fa-arrow-right mr-1"></i>
                              {getSubcategoryName(product.categoryId, product.subcategoryId)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div>
                        <p className="font-semibold text-sm">
                          {formatCurrency(product.salePrice || product.price)}
                        </p>
                        {product.salePrice &&
                          product.salePrice < product.price && (
                            <>
                              <p className="text-xs text-gray-400 line-through">
                                {formatCurrency(product.price)}
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
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.quantity > 10
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
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.inStock
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

        {/* Medium Table - Compact (MD to XL screens) */}
        <div className="overflow-x-auto hidden md:block xl:hidden w-full">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-sm">
                  Sản phẩm
                </th>
                <th className="text-left px-4 py-3 font-semibold text-sm">
                  Danh mục
                </th>
                <th className="text-center px-4 py-3 font-semibold text-sm">
                  Giá
                </th>
                <th className="text-center px-4 py-3 font-semibold text-sm">
                  Tồn kho
                </th>
                <th className="text-center px-4 py-3 font-semibold text-sm">
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
                currentProducts.map((product) => (
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
                      <div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {getCategoryName(product.categoryId) || "N/A"}
                        </span>
                        {product.subcategoryId && getSubcategoryName(product.categoryId, product.subcategoryId) && (
                          <div className="mt-1">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                              <i className="fa-solid fa-arrow-right mr-1"></i>
                              {getSubcategoryName(product.categoryId, product.subcategoryId)}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div>
                        <p className="font-semibold text-sm">
                          {formatCurrency(product.salePrice || product.price)}
                        </p>
                        {product.salePrice &&
                          product.salePrice < product.price && (
                            <>
                              <p className="text-xs text-gray-400 line-through">
                                {formatCurrency(product.price)}
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
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.quantity > 10
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
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${product.inStock
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

        {/* Mobile Card Layout */}
        <div className="md:hidden p-4 space-y-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <i className="fa-solid fa-box-open text-4xl mb-2 block text-gray-300"></i>
              {searchTerm || filterCategory !== "all"
                ? "Không tìm thấy sản phẩm"
                : "Chưa có sản phẩm nào"}
            </div>
          ) : (
            currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200"
              >
                <div className="flex gap-3 mb-3">
                  <div className="w-20 h-20 rounded-md overflow-hidden border flex-shrink-0">
                    <img
                      src={product.image || "https://via.placeholder.com/100"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm line-clamp-2 mb-1">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">ID: {product.id}</p>
                    <div className="flex gap-1 flex-wrap">
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

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <p className="text-xs text-gray-600">Danh mục</p>
                    <p className="font-medium text-xs">
                      {getCategoryName(product.categoryId) || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Giá</p>
                    <p className="font-semibold text-sm">
                      {formatCurrency(product.salePrice || product.price)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Tồn kho</p>
                    <p className="font-medium text-sm">{product.quantity} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Trạng thái</p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${product.inStock
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                        }`}
                    >
                      {product.inStock ? "Còn hàng" : "Hết hàng"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <button
                    onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                    className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded transition flex items-center gap-1"
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                    <span>Sửa</span>
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDuplicateProduct(product)}
                      className="px-3 py-1.5 text-sm font-medium text-green-600 hover:bg-green-50 rounded transition"
                      title="Sao chép"
                    >
                      <i className="fa-solid fa-copy"></i>
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition"
                      title="Xóa"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredProducts.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Trang <span className="font-semibold">{currentPage}</span> /{" "}
                <span className="font-semibold">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                {/* First Page */}
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition"
                  title="Trang đầu"
                >
                  <i className="fa-solid fa-angles-left"></i>
                </button>

                {/* Previous Page */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition"
                  title="Trang trước"
                >
                  <i className="fa-solid fa-angle-left"></i>
                </button>

                {/* Page Numbers */}
                <div className="hidden sm:flex items-center gap-2">
                  {getPageNumbers().map((page, index) => (
                    <React.Fragment key={index}>
                      {page === "..." ? (
                        <span className="px-3 py-2 text-sm text-gray-500">
                          ...
                        </span>
                      ) : (
                        <button
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 text-sm font-medium border rounded-md transition ${currentPage === page
                            ? "bg-black text-white border-black"
                            : "hover:bg-gray-100"
                            }`}
                        >
                          {page}
                        </button>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Next Page */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition"
                  title="Trang sau"
                >
                  <i className="fa-solid fa-angle-right"></i>
                </button>

                {/* Last Page */}
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm font-medium border rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition"
                  title="Trang cuối"
                >
                  <i className="fa-solid fa-angles-right"></i>
                </button>
              </div>

              {/* Page Jump (Mobile) */}
              <div className="sm:hidden flex items-center gap-2">
                <span className="text-sm text-gray-600">Đến trang:</span>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const page = parseInt(e.target.value);
                    if (page >= 1 && page <= totalPages) {
                      goToPage(page);
                    }
                  }}
                  className="w-16 border rounded-md px-2 py-1 text-sm text-center focus:outline-none focus:border-black"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProductPage;
