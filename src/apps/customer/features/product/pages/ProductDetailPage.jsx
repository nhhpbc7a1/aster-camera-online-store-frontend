import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import productService from "@/domains/product/services/productService";
import { useCart } from "@/domains/cart/context/CartContext";

function ProductDetailPage() {
  const { productId } = useParams();
  const { addToCart, loading: cartLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showSpecModal, setShowSpecModal] = useState(false);
  const [thumbnailIndex, setThumbnailIndex] = useState(0);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isZooming, setIsZooming] = useState(false);
  const [expandedImage, setExpandedImage] = useState(null);

  // State for description table of contents
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      const productData = await productService.getProductById(
        parseInt(productId),
      );
      setProduct(productData);

      const related = await productService.getRelatedProducts(
        parseInt(productId),
        4,
      );
      setRelatedProducts(related);
    } catch (err) {
      setError(err.message);
      console.error("Error loading product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const handleImageMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  if (loading) {
    return <div className="py-20 text-center">Loading...</div>;
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-black-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Product not found"}
        </div>
      </div>
    );
  }

  // Breadcrumb items
  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    product.category && {
      label: product.category,
      href: `/category/${product.categoryId}`,
    },
    product.subcategory && {
      label: product.subcategory,
      href: `/category/${product.categoryId}/${product.subcategoryId}`,
    },
    { label: product.name, href: null },
  ].filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center text-sm text-gray-600">
        {breadcrumbs.map((breadcrumb, idx) => (
          <div key={idx} className="flex items-center">
            {breadcrumb.href ? (
              <a
                href={breadcrumb.href}
                className="text-blue-600 hover:text-blue-800"
              >
                {breadcrumb.label}
              </a>
            ) : (
              <span className="text-gray-900 font-medium">
                {breadcrumb.label}
              </span>
            )}
            {idx < breadcrumbs.length - 1 && <span className="mx-2">/</span>}
          </div>
        ))}
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          {/* Main Image with Zoom */}
          <div
            className="bg-gray-100 rounded-lg mb-4 h-96 flex items-center justify-center relative overflow-hidden group cursor-zoom-in"
            onMouseMove={handleImageMouseMove}
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
          >
            <img
              src={product.images?.[selectedImage] || product.image}
              alt={product.name}
              className={`w-full h-full object-contain transition-transform duration-300 ${
                isZooming ? "scale-200" : "scale-100"
              }`}
              style={
                isZooming
                  ? {
                      transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }
                  : {}
              }
            />

            {/* Discount Badge */}
            {product.salePrice &&
              product.salePrice < product.price &&
              product.discount && (
                <div className="absolute top-4 left-4 bg-red-600 text-white font-bold rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                  <div className="text-center">
                    <div className="text-lg">-{product.discount}%</div>
                  </div>
                </div>
              )}

            {/* Expand Button */}
            <button
              onClick={() =>
                setExpandedImage(
                  product.images?.[selectedImage] || product.image,
                )
              }
              className="absolute bottom-4 left-4 bg-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              title="Mở rộng hình ảnh"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6v12h12v-4m4-7h-6m0 0V4m0 2l6-6"
                />
              </svg>
            </button>
          </div>

          {/* Thumbnail Carousel */}
          <div className="flex items-center gap-2 relative group">
            <div className="flex gap-2 flex-1 overflow-hidden rounded">
              {product.images
                ?.slice(thumbnailIndex, thumbnailIndex + 4)
                .map((img, idx) => (
                  <button
                    key={thumbnailIndex + idx}
                    onClick={() => setSelectedImage(thumbnailIndex + idx)}
                    className={`flex-1 border-2 rounded overflow-hidden relative group/thumb transition-all ${
                      selectedImage === thumbnailIndex + idx
                        ? "border-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${thumbnailIndex + idx}`}
                      className="w-full h-20 object-cover transition-transform group-hover/thumb:scale-110"
                    />
                    {/* Overlay */}
                    {selectedImage !== thumbnailIndex + idx && (
                      <div className="absolute inset-0 bg-black opacity-40 group-hover/thumb:opacity-0 transition-opacity" />
                    )}
                  </button>
                ))}
            </div>

            {/* Left Arrow */}
            <button
              onClick={() => setThumbnailIndex(Math.max(0, thumbnailIndex - 1))}
              disabled={thumbnailIndex === 0}
              className="absolute left-0 top-1/2 -translate-y-1/2 p-4 text-3xl font-bold text-white bg-black hover:bg-red-600 transition disabled:opacity-30 disabled:cursor-not-allowed rounded z-10 hidden group-hover:block"
            >
              ‹
            </button>

            {/* Right Arrow */}
            <button
              onClick={() =>
                setThumbnailIndex(
                  Math.min(
                    (product.images?.length || 1) - 4,
                    thumbnailIndex + 1,
                  ),
                )
              }
              disabled={thumbnailIndex >= (product.images?.length || 1) - 4}
              className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-3xl font-bold text-white bg-black hover:bg-red-600 transition disabled:opacity-30 disabled:cursor-not-allowed rounded z-10 hidden group-hover:block"
            >
              ›
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i}>
                  {i < Math.round(product.rating) ? "★" : "☆"}
                </span>
              ))}
            </div>
            <span className="ml-2 text-gray-600">
              ({product.reviews} đánh giá)
            </span>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 text-lg">{product.description}</p>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl font-bold text-black">
                {product.salePrice
                  ?.toLocaleString("vi-VN")
                  .replace(/,/g, ".") ??
                  product.price.toLocaleString("vi-VN").replace(/,/g, ".")}{" "}
                ₫
              </span>
              {product.salePrice && product.salePrice < product.price && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    {product.price.toLocaleString("vi-VN").replace(/,/g, ".")} ₫
                  </span>
                  <span className="bg-black-500 text-white px-3 py-1 rounded">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Stock */}
          <div className="mb-6">
            {product.inStock ? (
              <p className="text-green-600 font-semibold">
                Còn ({product.quantity} sản phẩm)
              </p>
            ) : (
              <p className="text-black font-semibold">Hết hàng</p>
            )}
          </div>

          {/* Add to Cart */}
          <div className="flex gap-4">
            <div className="flex items-center border rounded">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 hover:bg-gray-100"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 text-center border-0"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 hover:bg-gray-100"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || cartLoading}
              className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cartLoading ? "Adding..." : "Thêm vào giỏ hàng"}
            </button>
          </div>

          {addedToCart && (
            <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              Product added to cart successfully!
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {/* {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <a
                key={p.id}
                href={`/product/${p.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {p.name}
                </h3>
                <p className="text-blue-600 font-bold">
                  {(p.salePrice || p.price)
                    .toLocaleString("vi-VN")
                    .replace(/,/g, ".")}{" "}
                  ₫
                </p>
              </a>
            ))}
          </div>
        </div>
      )} */}

      {/* Specifications */}
      {product.specifications && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Thông số kỹ thuật</h3>
          <div className="border rounded overflow-hidden">
            {Object.entries(product.specifications)
              .slice(0, 4)
              .map(([key, value], idx) => (
                <div
                  key={key}
                  className={`grid grid-cols-2 gap-4 p-4 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b last:border-0`}
                >
                  <span className="font-medium text-gray-700">{key}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
          </div>
          {Object.entries(product.specifications).length > 4 && (
            <button
              onClick={() => setShowSpecModal(true)}
              className="w-full mt-4 border-2 border-gray-300 py-3 px-4 rounded hover:bg-gray-50 font-semibold text-gray-800"
            >
              Xem thêm
            </button>
          )}
        </div>
      )}

      {/* Product Description Section */}
      {product.description && (
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Description - 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-6">
              <span className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-semibold">
                MỚI TẢ
              </span>
            </div>

            {/* Short Description */}
            <div className="mb-8 text-gray-700 leading-relaxed">
              <p>{product.description}</p>
            </div>

            {/* Table of Contents */}
            {product.descriptionSections &&
              product.descriptionSections.length > 0 && (
                <div className="mb-8 border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <svg
                      className="w-5 h-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" />
                    </svg>
                    <span className="font-semibold text-gray-800">Mục lục</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-2">
                    {product.descriptionSections.map((section, idx) => (
                      <li key={idx} className="text-gray-700">
                        <a
                          href={`#section-${idx}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {section.title}
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

            {/* Description Sections Content */}
            {product.descriptionSections &&
              product.descriptionSections.map((section, idx) => (
                <div key={idx} id={`section-${idx}`} className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-gray-900">
                    {section.title}
                  </h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {section.content}
                  </div>
                </div>
              ))}
          </div>

          {/* Sidebar - Package Contents & Related Products */}
          <div className="lg:col-span-1">
            {/* Package Contents */}
            {product.packageContents && product.packageContents.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Hộp sản phẩm bao gồm
                </h3>
                <ul className="space-y-3">
                  {product.packageContents.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg
                        className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Products Sidebar */}
            {relatedProducts.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  Sản phẩm liên quan
                </h3>
                <div className="space-y-4">
                  {relatedProducts.slice(0, 3).map((p) => (
                    <a
                      key={p.id}
                      href={`/product/${p.id}`}
                      className="flex gap-4 bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition group"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-20 h-20 object-cover flex-shrink-0 group-hover:scale-110 transition"
                      />
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <h4 className="text-sm font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600">
                          {p.name}
                        </h4>
                        <p className="text-blue-600 font-bold text-sm">
                          {(p.salePrice || p.price)
                            .toLocaleString("vi-VN")
                            .replace(/,/g, ".")}{" "}
                          ₫
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Width Related Products */}
      {relatedProducts.length > 3 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan khác</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.slice(3).map((p) => (
              <a
                key={p.id}
                href={`/product/${p.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition p-4"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover rounded mb-2"
                />
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {p.name}
                </h3>
                <p className="text-blue-600 font-bold">
                  {(p.salePrice || p.price)
                    .toLocaleString("vi-VN")
                    .replace(/,/g, ".")}{" "}
                  ₫
                </p>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Specifications Modal */}
      {showSpecModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Thông số kỹ thuật</h2>
              <button
                onClick={() => setShowSpecModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="overflow-y-auto flex-1">
              <div className="p-6">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex justify-between py-3 border-b last:border-0"
                  >
                    <span className="text-gray-600 capitalize font-medium">
                      {key}:
                    </span>
                    <span className="font-medium text-gray-900">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Expanded Modal */}
      {expandedImage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setExpandedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={expandedImage}
              alt="Expanded product view"
              className="h-auto rounded-lg p-10"
            />
            <button
              onClick={() => setExpandedImage(null)}
              className="absolute top-10 right-4 bg-white rounded-full p-2 hover:bg-gray-200 shadow-lg"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
