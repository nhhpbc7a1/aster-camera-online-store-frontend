import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import productService from "@/domains/product/services/productService";
import categoryService from "@/domains/category/services/categoryService";
import ProductCard from "@/apps/customer/features/home/components/ProductCard";
import { mockCategories } from "@/domains/category/mockData/categories";
import { formatCurrency } from "@/utils/currencyHelpers";

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
  const [sortBy, setSortBy] = useState('default');
  const [itemsPerPage, setItemsPerPage] = useState(12);

  useEffect(() => {
    loadCategories();
  }, []);

  // Calculate itemsPerPage based on screen size
  useEffect(() => {
    const calculateItemsPerPage = () => {
      const width = window.innerWidth;
      let items = 5; // default for 5 columns
      
      if (width <= 640) {
        // Mobile: 2 columns, show 4 products per page (2 rows)
        items = 4;
      } else if (width <= 1024) {
        // Tablet: 3 columns, show 6 products per page (2 rows)
        items = 6;
      } else if (width <= 1280) {
        // Small desktop: 4 columns, show 4 products per page (1 row)
        items = 4;
      } else {
        // Large desktop: 5 columns, show 5 products per page (1 row)
        items = 5;
      }
      
      setItemsPerPage(items);
    };

    calculateItemsPerPage();
    
    const handleResize = () => {
      calculateItemsPerPage();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      loadProducts();
    }
  }, [categorySlug, searchParams, categories]);

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
      const searchTerm = searchParams.get("q");

      console.log('🔍 Loading products:', { categorySlug, searchTerm });

      if (categorySlug) {
        // Try to find as category first
        let categoryData = categories.find(c => c.slug === categorySlug);

        // If not found as category, try to find as subcategory
        let subcategoryData = null;
        if (!categoryData) {
          for (const cat of categories) {
            if (cat.subcategories) {
              subcategoryData = cat.subcategories.find(sc => sc.slug === categorySlug);
              if (subcategoryData) {
                categoryData = cat; // Set parent category
                break;
              }
            }
          }
        }

        if (!categoryData && !subcategoryData) {
          // Try API if not found in local categories
          try {
            categoryData = await categoryService.getCategoryBySlug(categorySlug);
          } catch (err) {
            console.warn('Category not found in API:', err);
          }
        }

        // Load products based on category or subcategory
        if (subcategoryData) {
          // Filter by subcategoryId
          setCategory({ ...categoryData, name: subcategoryData.name });
          const allCategoryProducts = await productService.getProducts();
          productsData = allCategoryProducts.filter(p => p.subcategoryId === subcategoryData.id);
        } else if (categoryData) {
          // Filter by categoryId
          setCategory(categoryData);
          productsData = await productService.getProductsByCategory(categoryData.id);
        } else {
          // Fallback to all products
          productsData = await productService.getProducts();
          setCategory(null);
        }

        // Apply search filter on category/subcategory products if search term exists
        if (searchTerm && productsData) {
          productsData = productsData.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
          );
        }
      } else if (searchTerm) {
        // Search all products
        productsData = await productService.searchProducts(searchTerm);
        setCategory(null);
      } else {
        // Load all products
        productsData = await productService.getProducts();
        setCategory(null);
      }

      console.log('📦 Loaded products count:', productsData?.length || 0);

      // Use the data from API (even if empty)
      setAllProducts(productsData || []);

      // Initialize price range from actual products
      if (productsData && productsData.length > 0) {
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
      } else {
        // Reset to default range when no products
        setPriceRange({ min: 0, max: 168000000 });
        setTempMinPrice(0);
        setTempMaxPrice(168000000);
        setMinPrice(0);
        setMaxPrice(168000000);
      }

      applyFilters(productsData || []);
    } catch (err) {
      console.error("Error loading products:", err);

      // On error, show empty state instead of mock data
      setAllProducts([]);
      setError("Không thể tải sản phẩm. Vui lòng thử lại sau.");

      // Reset price range
      setPriceRange({ min: 0, max: 168000000 });
      setTempMinPrice(0);
      setTempMaxPrice(168000000);
      setMinPrice(0);
      setMaxPrice(168000000);

      applyFilters([]);
    } finally {
      setLoading(false);
    }
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

    // Apply sorting
    filtered = applySorting(filtered);

    setFilteredProducts(filtered);
    setCurrentPage(1);
    setProducts(filtered.slice(0, itemsPerPage));
  };

  // Apply sorting
  const applySorting = (productsToSort) => {
    const sorted = [...productsToSort];

    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      case 'price-desc':
        return sorted.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      case 'name-asc':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return sorted.sort((a, b) => b.name.localeCompare(a.name));
      case 'rating':
        return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      case 'newest':
        return sorted.sort((a, b) => (b.id || 0) - (a.id || 0));
      default:
        return sorted;
    }
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
  }, [minPrice, maxPrice, minRating, sortBy]);

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
      {/* Breadcrumb */}
      {/* <div className="mb-6">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <button
            onClick={() => navigate('/')}
            className="hover:text-blue-600 transition"
          >
            <i className="fa-solid fa-home mr-1"></i>
            Trang chủ
          </button>
          <i className="fa-solid fa-chevron-right text-xs"></i>
          <button
            onClick={() => navigate('/products')}
            className={`hover:text-blue-600 transition ${!category && !searchParams.get("q") ? "text-blue-600 font-medium" : ""
              }`}
          >
            Sản phẩm
          </button>
          {category && (
            <>
              <i className="fa-solid fa-chevron-right text-xs"></i>
              <span className="text-blue-600 font-medium">{category.name}</span>
            </>
          )}
          {searchParams.get("q") && (
            <>
              <i className="fa-solid fa-chevron-right text-xs"></i>
              <span className="text-blue-600 font-medium">
                Tìm kiếm: "{searchParams.get("q")}"
              </span>
            </>
          )}
        </nav>
      </div> */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar Categories */}
        <div className="md:col-span-1">
          <div>
            <h3 className="text-lg font-semibold mb-4">Danh Mục</h3>

            {/* Categories List */}
            <div className="space-y-1">
              {/* All Products Link */}
              <button
                onClick={() => navigate('/products')}
                className={`flex items-center justify-between w-full text-left px-3 py-2 rounded transition text-sm ${!categorySlug
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                <span>
                  <i className="fa-solid fa-list mr-2"></i>
                  Tất cả Sản phẩm
                </span>
              </button>

              {/* Main Categories */}
              {categories.map((cat) => (
                <div key={cat.id}>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => navigate(`/products/category/${cat.slug}`)}
                      className={`flex-1 flex items-center text-left px-3 py-2 rounded transition text-sm ${categorySlug === cat.slug
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      <span>{cat.name}</span>
                    </button>
                    {cat.subcategories && cat.subcategories.length > 0 && (
                      <button
                        onClick={() => {
                          setExpandedCategory(
                            expandedCategory === cat.id ? null : cat.id,
                          );
                        }}
                        className="px-2 py-2 text-gray-600 hover:bg-gray-100 rounded transition"
                      >
                        <i
                          className={`fa-solid fa-chevron-down text-xs transition-transform ${expandedCategory === cat.id ? "rotate-180" : ""
                            }`}
                        ></i>
                      </button>
                    )}
                  </div>

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
                <div className="space-y-2">
                  <div className="text-sm text-gray-700">
                    Giá: {formatCurrency(tempMinPrice, false)}₫ — {formatCurrency(tempMaxPrice, false)}₫
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleFilterClick}
                      className="flex-1 bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 transition"
                    >
                      <i className="fa-solid fa-filter mr-2"></i>
                      Áp dụng
                    </button>
                    {(minPrice !== priceRange.min || maxPrice !== priceRange.max) && (
                      <button
                        onClick={() => {
                          setTempMinPrice(priceRange.min);
                          setTempMaxPrice(priceRange.max);
                          setMinPrice(priceRange.min);
                          setMaxPrice(priceRange.max);
                        }}
                        className="px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-100 transition"
                        title="Xóa bộ lọc giá"
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">ĐÁNH GIÁ TRUNG BÌNH</h3>
                {minRating > 0 && (
                  <button
                    onClick={() => setMinRating(0)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Xóa lọc
                  </button>
                )}
              </div>
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
          {/* Search Results Header */}
          {searchParams.get("q") && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold">
                Kết quả tìm kiếm: "{searchParams.get("q")}"
              </h1>
              <p className="text-sm text-gray-500 mt-2">
                Tìm thấy {filteredProducts.length} sản phẩm
              </p>
            </div>
          )}

          {/* Category Header */}
          {category && !searchParams.get("q") && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{category.name}</h1>
              {category.description && (
                <p className="text-gray-600">{category.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {filteredProducts.length} sản phẩm
              </p>
            </div>
          )}

          {/* All Products Header */}
          {!category && !searchParams.get("q") && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold">Tất cả Sản phẩm</h1>
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

          {/* Sort and Filter Bar */}
          {filteredProducts.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="text-sm text-gray-600">
                  Hiển thị {((currentPage - 1) * itemsPerPage) + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredProducts.length)} của {filteredProducts.length} sản phẩm
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sắp xếp:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="default">Mặc định</option>
                    <option value="newest">Mới nhất</option>
                    <option value="price-asc">Giá: Thấp đến Cao</option>
                    <option value="price-desc">Giá: Cao đến Thấp</option>
                    <option value="name-asc">Tên: A-Z</option>
                    <option value="name-desc">Tên: Z-A</option>
                    <option value="rating">Đánh giá cao nhất</option>
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(minPrice !== priceRange.min || maxPrice !== priceRange.max || minRating > 0) && (
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <span className="text-sm text-gray-600">Bộ lọc:</span>
                  {(minPrice !== priceRange.min || maxPrice !== priceRange.max) && (
                    <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      <i className="fa-solid fa-tag text-xs"></i>
                      {formatCurrency(minPrice, false)}₫ - {formatCurrency(maxPrice, false)}₫
                      <button
                        onClick={() => {
                          setTempMinPrice(priceRange.min);
                          setTempMaxPrice(priceRange.max);
                          setMinPrice(priceRange.min);
                          setMaxPrice(priceRange.max);
                        }}
                        className="hover:text-blue-900"
                      >
                        <i className="fa-solid fa-times text-xs"></i>
                      </button>
                    </span>
                  )}
                  {minRating > 0 && (
                    <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                      <i className="fa-solid fa-star text-xs"></i>
                      {minRating}+ sao
                      <button
                        onClick={() => setMinRating(0)}
                        className="hover:text-blue-900"
                      >
                        <i className="fa-solid fa-times text-xs"></i>
                      </button>
                    </span>
                  )}
                  <button
                    onClick={() => {
                      setTempMinPrice(priceRange.min);
                      setTempMaxPrice(priceRange.max);
                      setMinPrice(priceRange.min);
                      setMaxPrice(priceRange.max);
                      setMinRating(0);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 font-medium"
                  >
                    <i className="fa-solid fa-times-circle mr-1"></i>
                    Xóa tất cả
                  </button>
                </div>
              )}
            </div>
          )}

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Không có sản phẩm</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
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
                  {/* Previous Button */}
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 text-gray-700 hover:border-black hover:bg-black hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-700"
                    title="Trang trước"
                  >
                    <i className="fa-solid fa-chevron-left text-sm"></i>
                  </button>

                  {/* Page Numbers */}
                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`flex items-center justify-center w-10 h-10 rounded-full font-medium transition ${currentPage === page
                            ? "bg-black text-white border-2 border-black shadow-md"
                            : "border-2 border-gray-300 text-gray-700 hover:border-black hover:bg-gray-50"
                            }`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gray-300 text-gray-700 hover:border-black hover:bg-black hover:text-white transition disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-300 disabled:hover:bg-transparent disabled:hover:text-gray-700"
                    title="Trang sau"
                  >
                    <i className="fa-solid fa-chevron-right text-sm"></i>
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
