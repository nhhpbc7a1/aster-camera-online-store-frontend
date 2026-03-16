import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import productService from "@/domains/product/services/productService";
import categoryService from "@/domains/category/services/categoryService";
import ProductCard from "@/apps/customer/features/home/components/ProductCard";
import { mockProducts } from "@/domains/product/mockData/products";
import { mockCategories } from "@/domains/category/mockData/categories";

function ProductListingPage() {
  const { categorySlug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 168000000 });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(168000000);
  const [tempMinPrice, setTempMinPrice] = useState(0);
  const [tempMaxPrice, setTempMaxPrice] = useState(168000000);
  const [minRating, setMinRating] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const itemsPerPage = 12;

  useEffect(() => {
    loadCategories();
    loadProducts();
  }, [categorySlug, searchParams]);

  const loadCategories = async () => {
    try {
      const categoriesData = await categoryService.getCategories();
      setCategories(categoriesData || mockCategories);
    } catch (err) {
      console.error("Error loading categories:", err);
      setCategories(mockCategories);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      setCurrentPage(1);

      let productsData;

      if (categorySlug) {
        // Load category data
        const categoryData =
          await categoryService.getCategoryBySlug(categorySlug);
        setCategory(categoryData);

        // Load products for this category
        productsData = await productService.getProductsByCategory(
          categoryData.id,
        );
      } else {
        // Load all products or search results
        const searchTerm = searchParams.get("q");
        if (searchTerm) {
          productsData = await productService.searchProducts(searchTerm);
        } else {
          productsData = await productService.getProducts();
        }
      }

      // Fallback to mock data if empty
      if (!productsData || productsData.length === 0) {
        productsData = mockProducts;
      }

      setAllProducts(productsData);

      // Initialize price range from actual products
      if (productsData.length > 0) {
        const prices = productsData.map(
          (p) => p.salePrice || p.price || 0
        );
        const actualMinPrice = Math.min(...prices);
        const actualMaxPrice = Math.max(...prices);
        setPriceRange({ min: actualMinPrice, max: actualMaxPrice });
        setTempMinPrice(actualMinPrice);
        setTempMaxPrice(actualMaxPrice);
        setMinPrice(actualMinPrice);
        setMaxPrice(actualMaxPrice);
      }

      applyFilters(productsData);
    } catch (err) {
      console.error("Error loading products:", err);
      // Fallback to mock data on error
      setAllProducts(mockProducts);

      // Initialize price range from mock products
      if (mockProducts.length > 0) {
        const prices = mockProducts.map((p) => p.salePrice || p.price || 0);
        const actualMinPrice = Math.min(...prices);
        const actualMaxPrice = Math.max(...prices);
        setPriceRange({ min: actualMinPrice, max: actualMaxPrice });
        setTempMinPrice(actualMinPrice);
        setTempMaxPrice(actualMaxPrice);
        setMinPrice(actualMinPrice);
        setMaxPrice(actualMaxPrice);
      }

      applyFilters(mockProducts);
      // setError("Lỗi tải sản phẩm. Đang hiển thị dữ liệu tạm thời...");
    } finally {
      setLoading(false);
    }
  };

  // Format price to VND
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + " ₫";
  };

  // Calculate rating distribution
  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allProducts.forEach((product) => {
      if (product.rating) {
        const rating = Math.round(product.rating);
        if (rating >= 5) distribution[5]++;
        else if (rating >= 4) distribution[4]++;
        else if (rating >= 3) distribution[3]++;
        else if (rating >= 2) distribution[2]++;
        else if (rating >= 1) distribution[1]++;
      }
    });
    return distribution;
  };

  // Apply filters
  const applyFilters = (productsToFilter = allProducts) => {
    let filtered = productsToFilter.filter((product) => {
      // Price filter - use salePrice if available, otherwise price
      const productPrice = product.salePrice || product.price || 0;
      const priceMatch =
        productPrice >= minPrice && productPrice <= maxPrice;

      // Rating filter
      const ratingMatch = product.rating >= minRating;

      return priceMatch && ratingMatch;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
    setProducts(filtered.slice(0, itemsPerPage));
  };

  // Handle filter button click
  const handleFilterClick = () => {
    setMinPrice(tempMinPrice);
    setMaxPrice(tempMaxPrice);
    applyFilters();
  };

  // Handle rating filter click
  const handleRatingClick = (rating) => {
    const newRating = minRating === rating ? 0 : rating;
    setMinRating(newRating);
  };

  // Update products when filters change
  useEffect(() => {
    if (allProducts.length > 0) {
      applyFilters();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPrice, maxPrice, minRating]);

  // Update pagination when filtered products change
  useEffect(() => {
    if (filteredProducts.length > 0) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setProducts(filteredProducts.slice(startIndex, endIndex));
    } else {
      setProducts([]);
    }
  }, [currentPage, filteredProducts]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (loading) {
    return <div className="py-20 text-center text-lg">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Categories */}
        <div className="md:col-span-1">
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh Mục</h3>

            {/* Categories List */}
            <div className="space-y-1">
              {/* Main Categories */}
              {categories.map((cat) => (
                <div key={cat.id}>
                  <button
                    onClick={() => {
                      setExpandedCategory(
                        expandedCategory === cat.id ? null : cat.id,
                      );
                    }}
                    className={`flex items-center justify-between w-full text-left px-3 py-2 rounded transition text-sm ${categorySlug === cat.slug
                      ? "text-blue-600 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                      }`}
                  >
                    <span>{cat.name}</span>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <i
                        className={`fa-solid fa-chevron-down text-xs transition-transform ${expandedCategory === cat.id ? "rotate-180" : ""
                          }`}
                      ></i>
                    )}
                  </button>

                  {/* Subcategories */}
                  {expandedCategory === cat.id &&
                    cat.subcategories &&
                    cat.subcategories.length > 0 && (
                      <div className="pl-4 space-y-1">
                        {cat.subcategories.map((subcat) => (
                          <button
                            key={subcat.id}
                            onClick={() =>
                              navigate(`/products/category/${subcat.slug}`)
                            }
                            className="block w-full text-left px-3 py-2 rounded transition text-xs text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                          >
                            {subcat.name}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>

            {/* Price Filter */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">LỌC THEO GIÁ</h3>
              <div className="space-y-3">
                {/* Slider */}
                <div className="relative" style={{ height: "20px", paddingTop: "8px", paddingBottom: "8px" }}>
                  <div className="absolute inset-0 flex items-center">
                    <div
                      className="h-2 bg-gray-300 rounded-lg"
                      style={{ width: "100%" }}
                    />
                    <div
                      className="absolute h-2 bg-gray-600 rounded-lg"
                      style={{
                        left: `${((tempMinPrice - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`,
                        width: `${((tempMaxPrice - tempMinPrice) / (priceRange.max - priceRange.min)) * 100}%`,
                      }}
                    />
                  </div>
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    step={Math.max(100000, Math.floor((priceRange.max - priceRange.min) / 100))}
                    value={tempMinPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val <= tempMaxPrice) {
                        setTempMinPrice(val);
                      }
                    }}
                    className="absolute inset-0 w-full h-2 bg-transparent appearance-none cursor-pointer"
                    style={{
                      zIndex: tempMinPrice > tempMaxPrice - (priceRange.max - priceRange.min) * 0.01 ? 2 : 1,
                    }}
                  />
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    step={Math.max(100000, Math.floor((priceRange.max - priceRange.min) / 100))}
                    value={tempMaxPrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (val >= tempMinPrice) {
                        setTempMaxPrice(val);
                      }
                    }}
                    className="absolute inset-0 w-full h-2 bg-transparent appearance-none cursor-pointer"
                    style={{ zIndex: 2 }}
                  />
                  <style>{`
                    input[type="range"]::-webkit-slider-thumb {
                      appearance: none;
                      width: 18px;
                      height: 18px;
                      border-radius: 50%;
                      background: #4B5563;
                      cursor: pointer;
                      border: 2px solid #fff;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    input[type="range"]::-moz-range-thumb {
                      width: 18px;
                      height: 18px;
                      border-radius: 50%;
                      background: #4B5563;
                      cursor: pointer;
                      border: 2px solid #fff;
                      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    }
                    input[type="range"]::-webkit-slider-runnable-track {
                      height: 2px;
                    }
                    input[type="range"]::-moz-range-track {
                      height: 2px;
                    }
                  `}</style>
                </div>

                {/* Filter button and price display */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleFilterClick}
                    className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition whitespace-nowrap"
                  >
                    LỌC
                  </button>
                  <div className="text-sm text-gray-700 whitespace-nowrap">
                    Giá: {formatPrice(tempMinPrice)} — {formatPrice(tempMaxPrice)}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">ĐÁNH GIÁ TRUNG BÌNH</h3>
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const distribution = getRatingDistribution();
                  const count = distribution[rating];
                  return (
                    <button
                      key={rating}
                      onClick={() => handleRatingClick(rating)}
                      className={`flex items-center gap-2 w-full text-left px-2 py-1 rounded transition ${minRating === rating
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-100"
                        }`}
                    >
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`text-sm ${i < rating ? "text-red-500" : "text-gray-300"
                              }`}
                          >
                            <i className="fa-solid fa-star"></i>
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-3">
          {category && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-gray-600">{category.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                {filteredProducts.length} sản phẩm
              </p>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không có sản phẩm</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 mb-8">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showAddButton={true}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Trước
                  </button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 rounded transition ${currentPage === page
                            ? "bg-blue-600 text-white font-medium"
                            : "border hover:bg-gray-100"
                            }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductListingPage;
