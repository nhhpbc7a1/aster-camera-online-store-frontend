import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productService from "@/domains/product/services/productService";
import categoryService from "@/domains/category/services/categoryService";
import SimpleEditor from "../components/SimpleEditor";
import { formatCurrency } from "@/utils/currencyHelpers";

function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams(); // If id exists, we're editing; otherwise, adding
  const isEditMode = !!id;

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  const [formData, setFormData] = useState({
    name: "",
    categoryId: 1,
    category: "",
    subcategory: "",
    subcategoryId: null,
    price: 0,
    salePrice: 0,
    discount: 0,
    description: "",
    image: "",
    images: [],
    inStock: true,
    quantity: 0,
    rating: 0,
    reviews: 0,
    isFeatured: false,
    isFlashSale: false,
    packageContents: [],
    descriptionSections: [],
    specifications: {},
  });

  // Temporary states for adding items
  const [newImage, setNewImage] = useState("");
  const [newPackageItem, setNewPackageItem] = useState("");
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionContent, setNewSectionContent] = useState("");

  useEffect(() => {
    loadCategories();
    if (isEditMode) {
      loadProduct();
    } else {
      setLoading(false);
    }
  }, [id]);

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.categoryId) {
      const selectedCategory = categories.find(
        (cat) => cat.id === formData.categoryId
      );
      setSubcategories(selectedCategory?.subcategories || []);

      // Reset subcategoryId if it doesn't belong to the new category
      if (
        selectedCategory &&
        formData.subcategoryId &&
        !selectedCategory.subcategories?.find(
          (sub) => sub.id === formData.subcategoryId
        )
      ) {
        setFormData((prev) => ({ ...prev, subcategoryId: null }));
      }
    }
  }, [formData.categoryId, categories]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getCategories();
      setCategories(data);

      // Set initial subcategories if editing
      if (isEditMode && formData.categoryId) {
        const selectedCategory = data.find(
          (cat) => cat.id === formData.categoryId
        );
        setSubcategories(selectedCategory?.subcategories || []);
      }
    } catch (err) {
      // no-op
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const products = await productService.getProducts();
      const product = products.find((p) => p.id === parseInt(id));

      if (!product) {
        alert("Không tìm thấy sản phẩm!");
        navigate("/admin/products");
        return;
      }

      setFormData({
        name: product.name || "",
        categoryId: product.categoryId || 1,
        subcategoryId: product.subcategoryId ? Number(product.subcategoryId) : null,
        price: product.price || 0,
        salePrice: product.salePrice || product.price || 0,
        discount: product.discount || 0,
        description: product.description || "",
        image: product.image || "",
        images: product.images || [],
        inStock: product.inStock !== undefined ? product.inStock : true,
        quantity: product.quantity || 0,
        rating: product.rating || 0,
        reviews: product.reviews || 0,
        isFeatured: product.isFeatured || false,
        isFlashSale: product.isFlashSale || false,
        packageContents: product.packageContents || [],
        descriptionSections: product.descriptionSections || [],
        specifications: product.specifications || {},
      });
      setImagePreview(product.image);
    } catch (err) {
      alert("Không thể tải sản phẩm!");
      navigate("/admin/products");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Update image preview when image URL changes
    if (name === 'image' && value) {
      setImagePreview(value);
    }

    setFormData((prev) => {
      let newValue;
      if (type === "checkbox") {
        newValue = checked;
      } else if (type === "number") {
        newValue = parseFloat(value) || 0;
      } else if (name === "categoryId") {
        // Parse categoryId and reset subcategoryId when category changes
        const categoryIdValue = value === "" ? null : parseInt(value);
        return {
          ...prev,
          categoryId: categoryIdValue || null,
          subcategoryId: null, // Reset subcategory when category changes
        };
      } else if (name === "subcategoryId") {
        // Parse subcategoryId, handle empty string as null
        if (value === "" || value === null || value === undefined) {
          newValue = null;
        } else {
          // Ensure we parse the actual ID value, not index
          const parsedValue = typeof value === 'number' ? value : parseInt(value, 10);
          newValue = isNaN(parsedValue) ? null : parsedValue;
        }
      } else {
        newValue = value;
      }

      return {
        ...prev,
        [name]: newValue,
      };
    });
  };

  const calculateDiscount = (price, salePrice) => {
    if (price > 0 && salePrice > 0 && salePrice < price) {
      return Math.round(((price - salePrice) / price) * 100);
    }
    return 0;
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    setFormData((prev) => {
      const updated = { ...prev, [name]: numValue };
      updated.discount = calculateDiscount(updated.price, updated.salePrice);
      return updated;
    });
  };

  // Images management
  const addImage = () => {
    if (newImage.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, newImage.trim()],
      }));
      setNewImage("");
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Package contents management
  const addPackageItem = () => {
    if (newPackageItem.trim()) {
      setFormData((prev) => ({
        ...prev,
        packageContents: [...prev.packageContents, newPackageItem.trim()],
      }));
      setNewPackageItem("");
    }
  };

  const removePackageItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      packageContents: prev.packageContents.filter((_, i) => i !== index),
    }));
  };

  // Specifications management
  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [newSpecKey.trim()]: newSpecValue.trim(),
        },
      }));
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const removeSpecification = (key) => {
    setFormData((prev) => {
      const newSpecs = { ...prev.specifications };
      delete newSpecs[key];
      return { ...prev, specifications: newSpecs };
    });
  };

  // Description sections management
  const addDescriptionSection = () => {
    if (newSectionTitle.trim() && newSectionContent.trim()) {
      setFormData((prev) => ({
        ...prev,
        descriptionSections: [
          ...prev.descriptionSections,
          {
            title: newSectionTitle.trim(),
            content: newSectionContent.trim(),
          },
        ],
      }));
      setNewSectionTitle("");
      setNewSectionContent("");
    }
  };

  const removeDescriptionSection = (index) => {
    setFormData((prev) => ({
      ...prev,
      descriptionSections: prev.descriptionSections.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate subcategoryId belongs to selected category
      let validSubcategoryId = null;
      if (formData.subcategoryId !== null && formData.subcategoryId !== undefined && formData.subcategoryId !== "") {
        // Parse subcategoryId - ensure we get the actual ID, not index
        const subcategoryIdValue = typeof formData.subcategoryId === 'number'
          ? formData.subcategoryId
          : parseInt(String(formData.subcategoryId), 10);

        // Check if subcategoryId is valid number and belongs to current category
        if (!isNaN(subcategoryIdValue) && subcategoryIdValue > 0) {
          const categoryIdValue = typeof formData.categoryId === 'number'
            ? formData.categoryId
            : parseInt(String(formData.categoryId), 10);

          const selectedCategory = categories.find(
            (cat) => cat.id === categoryIdValue
          );

          // Verify subcategory belongs to selected category by checking actual ID
          const isValidSubcategory = selectedCategory?.subcategories?.some(
            (sub) => sub.id === subcategoryIdValue
          );

          if (isValidSubcategory) {
            validSubcategoryId = subcategoryIdValue;
          } else {
            // no-op
          }
        } else {
          // no-op
        }
      }

      // Only send fields that backend accepts
      const productData = {
        name: formData.name,
        categoryId: typeof formData.categoryId === 'number' ? formData.categoryId : parseInt(formData.categoryId),
        subcategoryId: validSubcategoryId,
        price: parseFloat(formData.price),
        salePrice: parseFloat(formData.salePrice) || parseFloat(formData.price),
        discount: calculateDiscount(formData.price, formData.salePrice),
        image: formData.image,
        images: formData.images || [],
        description: formData.description,
        packageContents: formData.packageContents || [],
        descriptionSections: formData.descriptionSections || [],
        specifications: formData.specifications || {},
        inStock: formData.inStock,
        quantity: parseInt(formData.quantity) || 0,
        isFeatured: formData.isFeatured || false,
        isFlashSale: formData.isFlashSale || false,
      };

      if (isEditMode) {
        // Update existing product
        await productService.updateProduct(parseInt(id), productData);
        alert("Sản phẩm đã được cập nhật thành công!");
      } else {
        // Create new product
        await productService.createProduct(productData);
        alert("Sản phẩm đã được thêm thành công!");
      }

      navigate("/admin/products");
    } catch (err) {
      alert("Không thể lưu sản phẩm: " + (err.message || "Lỗi không xác định"));
    }
  };

  const handleCancel = () => {
    const message = isEditMode
      ? "Bạn có chắc muốn hủy? Những thay đổi chưa lưu sẽ bị mất."
      : "Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất.";

    if (window.confirm(message)) {
      navigate("/admin/products");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/admin/products")}
              className="text-gray-600 hover:text-gray-900"
            >
              <i className="fa-solid fa-arrow-left text-xl"></i>
            </button>
            <h1 className="text-3xl font-bold">
              {isEditMode ? "Chỉnh sửa Sản phẩm" : "Thêm Sản phẩm Mới"}
            </h1>
          </div>
          <p className="text-gray-600 mt-1">
            {isEditMode
              ? `ID: ${id} - ${formData.name}`
              : "Điền đầy đủ thông tin để thêm sản phẩm mới vào hệ thống"}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg border">
        {/* Tabs */}
        <div className="border-b">
          <div className="flex overflow-x-auto">
            {[
              { id: "basic", label: "Thông tin cơ bản", icon: "fa-info-circle" },
              { id: "pricing", label: "Giá & Kho", icon: "fa-dollar-sign" },
              { id: "media", label: "Hình ảnh", icon: "fa-images" },
              { id: "description", label: "Mô tả", icon: "fa-file-text" },
              { id: "specifications", label: "Thông số", icon: "fa-cog" },
              { id: "package", label: "Bao gồm", icon: "fa-box" },
              { id: "sections", label: "Chi tiết", icon: "fa-list" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition ${activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
              >
                <i className={`fa-solid ${tab.icon} mr-2`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Thông tin cơ bản</h3>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tên Sản phẩm *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                    placeholder="VD: Canon EOS R5"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Danh mục *
                    </label>
                    <select
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleFormChange}
                      required
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Danh mục con
                    </label>
                    <select
                      name="subcategoryId"
                      value={formData.subcategoryId ? String(formData.subcategoryId) : ""}
                      onChange={handleFormChange}
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                      disabled={subcategories.length === 0}
                    >
                      <option value="">-- Chọn danh mục con --</option>
                      {subcategories.map((sub) => (
                        <option key={sub.id} value={String(sub.id)}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                    {subcategories.length === 0 && (
                      <p className="text-xs text-gray-500 mt-1">
                        <i className="fa-solid fa-info-circle mr-1"></i>
                        Danh mục này chưa có danh mục con
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="inStock"
                        checked={formData.inStock}
                        onChange={handleFormChange}
                        className="w-5 h-5 mr-2 cursor-pointer"
                      />
                      <span className="text-sm font-semibold">
                        <i className="fa-solid fa-check-circle mr-1 text-green-600"></i>
                        Còn hàng
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleFormChange}
                        className="w-5 h-5 mr-2 cursor-pointer"
                      />
                      <span className="text-sm font-semibold">
                        <i className="fa-solid fa-star mr-1 text-yellow-500"></i>
                        Nổi bật
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name="isFlashSale"
                        checked={formData.isFlashSale}
                        onChange={handleFormChange}
                        className="w-5 h-5 mr-2 cursor-pointer"
                      />
                      <span className="text-sm font-semibold">
                        <i className="fa-solid fa-bolt mr-1 text-orange-500"></i>
                        Flash Sale
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Pricing Tab */}
            {activeTab === "pricing" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Giá & Kho hàng</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Giá gốc (VNĐ) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handlePriceChange}
                      required
                      min="0"
                      step="1000"
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                      placeholder="45000000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Giá khuyến mãi (VNĐ)
                    </label>
                    <input
                      type="number"
                      name="salePrice"
                      value={formData.salePrice}
                      onChange={handlePriceChange}
                      min="0"
                      step="1000"
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                      placeholder="39900000"
                    />
                    {formData.discount > 0 && (
                      <p className="text-xs text-green-600 " style={{ marginTop: '10px' }}>
                        <i className="fa-solid fa-tag mr-1"></i>
                        Giảm giá: {formData.discount}%
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Số lượng tồn kho
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleFormChange}
                      min="0"
                      className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                      placeholder="50"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Media Tab */}
            {activeTab === "media" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Hình ảnh Sản phẩm</h3>

                {/* Main Image */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Hình ảnh chính * (URL)
                  </label>
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleFormChange}
                        className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                        placeholder="https://example.com/image.jpg"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        <i className="fa-solid fa-info-circle mr-1"></i>
                        Nhập URL trực tiếp của hình ảnh
                      </p>
                    </div>
                    {(imagePreview || formData.image) && (
                      <div className="w-32 h-32 border rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={imagePreview || formData.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Additional Images */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Thư viện ảnh ({formData.images.length})
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="Nhập URL hình ảnh..."
                      className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addImage())
                      }
                    />
                    <button
                      type="button"
                      onClick={addImage}
                      className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm"
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      Thêm
                    </button>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {formData.images.map((img, idx) => (
                        <div
                          key={idx}
                          className="relative group border rounded-md overflow-hidden aspect-square"
                        >
                          <img
                            src={img}
                            alt={`Image ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center"
                          >
                            <i className="fa-solid fa-times text-xs"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Description Tab */}
            {activeTab === "description" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">Mô tả Sản phẩm</h3>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Mô tả ngắn
                  </label>
                  <SimpleEditor
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Nhập mô tả ngắn gọn về sản phẩm..."
                  />
                </div>
              </div>
            )}

            {/* Specifications Tab */}
            {activeTab === "specifications" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">
                  Thông số kỹ thuật ({Object.keys(formData.specifications).length})
                </h3>

                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <input
                      type="text"
                      value={newSpecKey}
                      onChange={(e) => setNewSpecKey(e.target.value)}
                      placeholder="Tên thông số (VD: sensor, iso, shutter...)"
                      className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSpecification())
                      }
                    />
                    <input
                      type="text"
                      value={newSpecValue}
                      onChange={(e) => setNewSpecValue(e.target.value)}
                      placeholder="Giá trị (VD: Full Frame CMOS 45MP)"
                      className="border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addSpecification())
                      }
                    />
                  </div>
                  <button
                    type="button"
                    onClick={addSpecification}
                    className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm"
                  >
                    <i className="fa-solid fa-plus mr-2"></i>
                    Thêm Thông số
                  </button>
                </div>

                {Object.keys(formData.specifications).length > 0 && (
                  <div className="border rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-2 text-sm font-semibold">
                            Thông số
                          </th>
                          <th className="text-left px-4 py-2 text-sm font-semibold">
                            Giá trị
                          </th>
                          <th className="text-center px-4 py-2 text-sm font-semibold w-20">
                            Xóa
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {Object.entries(formData.specifications).map(([key, value]) => (
                          <tr key={key} className="hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm font-medium">{key}</td>
                            <td className="px-4 py-2 text-sm">{value}</td>
                            <td className="px-4 py-2 text-center">
                              <button
                                type="button"
                                onClick={() => removeSpecification(key)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Package Contents Tab */}
            {activeTab === "package" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">
                  Bao gồm trong hộp ({formData.packageContents.length})
                </h3>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={newPackageItem}
                    onChange={(e) => setNewPackageItem(e.target.value)}
                    placeholder="VD: Canon EOS R5 Body, Pin LP-E6NH..."
                    className="flex-1 border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                    onKeyPress={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addPackageItem())
                    }
                  />
                  <button
                    type="button"
                    onClick={addPackageItem}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm"
                  >
                    <i className="fa-solid fa-plus mr-2"></i>
                    Thêm
                  </button>
                </div>

                {formData.packageContents.length > 0 && (
                  <ul className="space-y-2">
                    {formData.packageContents.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center justify-between bg-gray-50 border rounded-md px-4 py-3"
                      >
                        <span className="text-sm">
                          <i className="fa-solid fa-check text-green-600 mr-2"></i>
                          {item}
                        </span>
                        <button
                          type="button"
                          onClick={() => removePackageItem(idx)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Description Sections Tab */}
            {activeTab === "sections" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">
                  Mô tả chi tiết ({formData.descriptionSections.length})
                </h3>

                <div className="bg-gray-50 border rounded-lg p-4">
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={newSectionTitle}
                      onChange={(e) => setNewSectionTitle(e.target.value)}
                      placeholder="Tiêu đề mục..."
                      className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                    />
                    <SimpleEditor
                      value={newSectionContent}
                      onChange={(e) => setNewSectionContent(e.target.value)}
                      placeholder="Nội dung mục mô tả..."
                    />
                    <button
                      type="button"
                      onClick={addDescriptionSection}
                      className="w-full bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition text-sm"
                    >
                      <i className="fa-solid fa-plus mr-2"></i>
                      Thêm Mục Mô tả
                    </button>
                  </div>
                </div>

                {formData.descriptionSections.length > 0 && (
                  <div className="space-y-3">
                    {formData.descriptionSections.map((section, idx) => (
                      <div key={idx} className="border rounded-lg p-4 bg-white">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{section.title}</h4>
                          <button
                            type="button"
                            onClick={() => removeDescriptionSection(idx)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                        <div
                          className="text-sm text-gray-600 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="border-t p-6">
            <div className="flex gap-3">
              <button type="submit" className="flex-1 btn btn-primary">
                <i className="fa-solid fa-check mr-2"></i>
                {isEditMode ? "Cập nhật Sản phẩm" : "Thêm Sản phẩm"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 btn btn-outline"
              >
                <i className="fa-solid fa-xmark mr-2"></i>
                Hủy bỏ
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormPage;
