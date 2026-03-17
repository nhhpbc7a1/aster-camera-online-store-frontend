import { useCart } from "@/domains/cart/context/CartContext";
import { formatCurrency } from "@/utils/currencyHelpers";

function ProductCard({ product, showAddButton = false, showSelectButton = false, marginBottom = 0 }) {
  const { addToCart, loading } = useCart();

  if (!product) {
    return (
      <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
        <div className="bg-gray-200 h-35 mb-3 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    );
  }

  const handleAddToCart = async (e) => {
    e.preventDefault();
    try {
      await addToCart(product, 1);
    } catch (err) {
      // no-op (UI state handled by CartContext)
    }
  };

  return (
    <a href={`/product/${product.id}`}>
      <div className={`bg-white rounded-xl shadow p-4 hover:shadow-lg transition cursor-pointer relative text-center group mb-${marginBottom}`}>
        {/* Flash Sale badge */}
        {product.isFlashSale && (
          <div className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold z-10">
            SALE
          </div>
        )}

        <div className="relative overflow-hidden rounded mb-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-35 object-contain hover:scale-105 transition"
          />

          {/* Discount badge - top left, red circle */}
          {product.discount > 0 && (
            <div className="absolute top-2 left-2 bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xm font-semibold">
              -{product.discount}%
            </div>
          )}



          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">HẾT HÀNG</span>
            </div>
          )}

          {/* Select Button */}
          {showSelectButton && product.inStock && (
            <button
              onClick={(e) => {
                e.preventDefault();
                handleAddToCart(e);
              }}
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-1 rounded text-xs font-medium hover:bg-gray-800"
            >
              Chọn
            </button>
          )}
        </div>

        <h3 className="text-sm font-medium mb-1 line-clamp-2">
          {product.name}
        </h3>

        {/* Rating with 5 red stars */}
        <div className="flex items-center mb-2 justify-center">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-red-500 text-xm">
                <i className="fa-solid fa-star"></i>
              </span>
            ))}
          </div>
        </div>

        {/* Price display: show salePrice (if any) and base price */}
        <div className="mt-1 ">

          {product.salePrice &&
            product.price &&
            product.salePrice < product.price && (
              <div className="text-sm text-gray-500 line-through">
                {formatCurrency(product.price)}
              </div>
            )}
          <div className="text-black font-semibold text-sm">
            {formatCurrency(product.salePrice || product.price)}
          </div>
        </div>

        {showAddButton && (
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || loading}
            className="btn btn-outline mt-3 w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 opacity-100 max-[850px]:opacity-100 min-[851px]:opacity-0 min-[851px]:group-hover:opacity-100 transition-opacity duration-200 mx-auto"
            aria-label="Add to cart"
          >
            <i className="fa-solid fa-cart-plus" />
          </button>
        )}
      </div>
    </a>
  );
}

export default ProductCard;
