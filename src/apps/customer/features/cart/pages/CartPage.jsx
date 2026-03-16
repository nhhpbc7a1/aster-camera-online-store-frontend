import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/domains/cart/context/CartContext";
import { getCategoryName } from "@/utils/categoryHelpers";
import { formatCurrency } from "@/utils/currencyHelpers";
import orderService from "@/domains/order/services/order.service";

function CartPage() {
  const navigate = useNavigate();
  const { cart, loading, removeFromCart, updateCartItem, clearCart } =
    useCart();
  const [step, setStep] = useState("cart"); // 'cart', 'checkout', 'success'
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);
  const [successOrder, setSuccessOrder] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Việt Nam",
    paymentMethod: "cash_on_delivery",
  });

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleUpdateQuantity = async (cartItemId, newQuantity) => {
    try {
      await updateCartItem(cartItemId, newQuantity);
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleContinueShopping = () => {
    navigate("/");
  };

  const handleClearCart = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa toàn bộ giỏ hàng?")) {
      await clearCart();
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const required = [
      "fullName",
      "email",
      "phone",
      "address",
      "city",
      "state",
      "zipCode",
    ];
    const fieldNames = {
      fullName: "Họ và tên",
      email: "Email",
      phone: "Số điện thoại",
      address: "Địa chỉ",
      city: "Thành phố",
      state: "Tỉnh/Thành phố",
      zipCode: "Mã bưu điện",
    };
    for (let field of required) {
      if (!formData[field].trim()) {
        setError(`Vui lòng điền ${fieldNames[field]}`);
        return false;
      }
    }

    if (!formData.email.includes("@")) {
      setError("Vui lòng nhập email hợp lệ");
      return false;
    }

    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    try {
      setPlacing(true);
      setError(null);

      const shippingFee = 50000; // 50,000 VND
      const tax = Math.round(cart.total * 0.1);
      const totalPrice = cart.total + shippingFee + tax;

      // Map payment method to match backend enum
      const paymentMethodMap = {
        cash_on_delivery: "cash_on_delivery",
        credit_card: "credit_card",
        bank_transfer: "bank_transfer",
        paypal: "credit_card", // PayPal maps to credit_card in backend
      };

      const orderData = {
        // userId is optional for guest orders
        email: formData.email, // Store customer email
        items: cart.items.map((item) => ({
          productId: item.productId,
          productName: item.product.name,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal,
        })),
        subtotal: cart.total,
        shippingFee: shippingFee,
        tax: tax,
        total: totalPrice,
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          email: formData.email, // Also include in shipping address
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: paymentMethodMap[formData.paymentMethod] || "cash_on_delivery",
      };

      const newOrder = await orderService.createOrder(orderData);
      await clearCart();
      setSuccessOrder(newOrder);
      setStep("success");
    } catch (err) {
      console.error("Error placing order:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Đặt hàng thất bại. Vui lòng thử lại.";
      setError(errorMessage);

      // Log full error for debugging
      if (err.response?.data) {
        console.error("Full error response:", err.response.data);
      }
    } finally {
      setPlacing(false);
    }
  };

  // Empty cart
  if (cart.items.length === 0 && step === "cart") {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Giỏ Hàng</h1>
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">Giỏ hàng của bạn đang trống</p>
          <button
            onClick={handleContinueShopping}
            className="btn btn-primary"
          >
            Tiếp Tục Mua Sắm
          </button>
        </div>
      </div>
    );
  }

  const shippingFee = 50000; // 50,000 VND
  const tax = Math.round(cart.total * 0.1);
  const totalPrice = cart.total + shippingFee + tax;

  // Success message
  if (step === "success") {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-6xl mb-4">
            <i className="fa-solid fa-check text-green-600"></i>
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Đặt Hàng Thành Công!
          </h1>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <p className="text-gray-600 mb-2">Mã Đơn Hàng</p>
            <p className="text-3xl font-bold text-blue-600">
              {successOrder?.orderNumber}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <p className="text-gray-700 mb-4">
              Cảm ơn bạn đã mua hàng! Email xác nhận đã được gửi đến{" "}
              <span className="font-semibold">{formData.email}</span>
            </p>
            <p className="text-gray-600 text-sm mb-10">
              Vui lòng kiểm tra email để xem chi tiết đơn hàng và thông tin theo dõi.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mt-10">
              <p className="text-sm text-yellow-800 mt-4">
                <i className="fa-solid fa-envelope text-yellow-800 mr-2"></i>
                Chi tiết đơn hàng đã được gửi đến email của bạn. Vui lòng kiểm tra thư mục spam nếu không thấy.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleContinueShopping}
              className="btn btn-primary flex-1"
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ Hàng</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {step === "cart" ? (
        // CART VIEW
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold">
                      Sản Phẩm
                    </th>
                    <th className="text-center px-6 py-3 font-semibold">
                      Giá
                    </th>
                    <th className="text-center px-6 py-3 font-semibold">
                      Số Lượng
                    </th>
                    <th className="text-right px-6 py-3 font-semibold">
                      Thành Tiền
                    </th>
                    <th className="text-center px-6 py-3 font-semibold">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item.id} className="border-t hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold">{item.product.name}</p>
                            <p className="text-sm text-gray-600">
                              {getCategoryName(item.product.categoryId)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center border rounded w-24">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity - 1)
                            }
                            className="px-2 py-1 hover:bg-gray-100"
                            disabled={loading}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              handleUpdateQuantity(
                                item.id,
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="w-12 text-center border-0"
                            min="1"
                            disabled={loading}
                          />
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item.id, item.quantity + 1)
                            }
                            className="px-2 py-1 hover:bg-gray-100"
                            disabled={loading}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold">
                        {formatCurrency(item.subtotal)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-800 font-semibold transition"
                          disabled={loading}
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex gap-4">
              <button
                onClick={handleContinueShopping}
                className="btn btn-outline flex-1"
              >
                Tiếp Tục Mua Sắm
              </button>
              <button
                onClick={handleClearCart}
                className="btn btn-outline flex-1 border-red-300 text-red-700 hover:bg-red-50"
                disabled={loading}
              >
                Xóa Giỏ Hàng
              </button>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-semibold mb-4">Tóm Tắt Đơn Hàng</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm Tính</span>
                  <span className="font-medium">{formatCurrency(cart.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí Vận Chuyển</span>
                  <span className="font-medium">{formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thuế (10%)</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 text-lg font-semibold">
                <span>Tổng Cộng</span>
                <span className="text-2xl text-black">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <button
                onClick={() => {
                  setError(null);
                  setStep("checkout");
                }}
                disabled={cart.items.length === 0 || loading}
                className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thanh Toán
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Số sản phẩm trong giỏ: {cart.itemCount}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // CHECKOUT FORM
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-6">Thông Tin Giao Hàng</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Họ và Tên *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:border-black"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:border-black"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Số Điện Thoại *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:border-black"
                    placeholder="0901234567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Quốc Gia *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2">
                    Địa Chỉ *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:border-black"
                    placeholder="123 Đường ABC, Phường XYZ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Thành Phố *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:border-black"
                    placeholder="Hà Nội"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Tỉnh/Thành Phố *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:border-black"
                    placeholder="Hà Nội"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Mã Bưu Điện *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleFormChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:border-black"
                    placeholder="100000"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6 pb-6 border-b">
                <h3 className="text-lg font-bold mb-4">Phương Thức Thanh Toán</h3>

                <div className="space-y-3">
                  {[
                    {
                      value: "cash_on_delivery",
                      label: "Thanh Toán Khi Nhận Hàng",
                      desc: "Thanh toán khi nhận được đơn hàng",
                    },
                    // {
                    //   value: "credit_card",
                    //   label: "Thẻ Tín Dụng",
                    //   desc: "Visa, Mastercard, American Express",
                    // },
                    // {
                    //   value: "bank_transfer",
                    //   label: "Chuyển Khoản Ngân Hàng",
                    //   desc: "Chuyển khoản trực tiếp qua ngân hàng",
                    // },
                    // {
                    //   value: "paypal",
                    //   label: "PayPal",
                    //   desc: "Thanh toán an toàn qua PayPal",
                    // },
                  ].map((method) => (
                    <label
                      key={method.value}
                      className="flex items-center p-3 border rounded cursor-pointer hover:bg-gray-50 transition"
                      style={{
                        borderColor:
                          formData.paymentMethod === method.value
                            ? "#000"
                            : "#d1d5db",
                      }}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.value}
                        checked={formData.paymentMethod === method.value}
                        onChange={handleFormChange}
                        className="w-4 h-4"
                      />
                      <span className="ml-3">
                        <span className="font-semibold block">
                          {method.label}
                        </span>
                        <span className="text-sm text-gray-600">
                          {method.desc}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => setStep("cart")}
                  className="btn btn-outline flex-1"
                >
                  Quay Lại Giỏ Hàng
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placing}
                  className="btn btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placing ? "Đang Xử Lý..." : "Đặt Hàng"}
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h2 className="text-lg font-bold mb-4">Tóm Tắt Đơn Hàng</h2>

              <div className="space-y-2 mb-4 pb-4 border-b max-h-72 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="font-semibold">
                      {formatCurrency(item.subtotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pb-4 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm Tính</span>
                  <span className="font-medium">{formatCurrency(cart.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí Vận Chuyển</span>
                  <span className="font-medium">{formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Thuế (10%)</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center my-4">
                <span className="font-bold">Tổng Cộng</span>
                <span className="text-2xl font-bold text-black">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Chúng tôi chấp nhận tất cả các phương thức thanh toán phổ biến
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
