import React, { useState, useEffect } from "react";
import orderService from "@/domains/order/services/order.service";

function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // In a real app, would get all orders, not just from one user
      const data = await orderService.getUserOrders("all");
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
      alert(`Đơn hàng đã được cập nhật sang trạng thái: ${getStatusLabel(newStatus)}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      alert("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filter === "all" || order.status === filter;
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "processing":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "shipped":
        return "bg-purple-100 text-purple-800 border-purple-300";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: "Chờ xử lý",
      processing: "Đang xử lý",
      shipped: "Đã gửi",
      delivered: "Đã giao",
      cancelled: "Đã hủy",
    };
    return labels[status] || status;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return "fa-clock";
      case "processing":
        return "fa-spinner";
      case "shipped":
        return "fa-truck";
      case "delivered":
        return "fa-check-circle";
      case "cancelled":
        return "fa-times-circle";
      default:
        return "fa-question-circle";
    }
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    revenue: orders
      .filter(o => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0),
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Đơn hàng</h1>
          <p className="text-gray-600 mt-1">
            Quản lý tất cả đơn hàng ({orders.length})
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="btn btn-outline"
        >
          <i className="fa-solid fa-rotate mr-2"></i>
          Làm mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="text-center">
            <p className="text-sm text-gray-600">Tổng đơn</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
          <div className="text-center">
            <p className="text-sm text-yellow-700">Chờ xử lý</p>
            <p className="text-2xl font-bold mt-1 text-yellow-800">{stats.pending}</p>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
          <div className="text-center">
            <p className="text-sm text-blue-700">Đang xử lý</p>
            <p className="text-2xl font-bold mt-1 text-blue-800">{stats.processing}</p>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg shadow p-4 border border-purple-200">
          <div className="text-center">
            <p className="text-sm text-purple-700">Đã gửi</p>
            <p className="text-2xl font-bold mt-1 text-purple-800">{stats.shipped}</p>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
          <div className="text-center">
            <p className="text-sm text-green-700">Đã giao</p>
            <p className="text-2xl font-bold mt-1 text-green-800">{stats.delivered}</p>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
          <div className="text-center">
            <p className="text-sm text-red-700">Đã hủy</p>
            <p className="text-2xl font-bold mt-1 text-red-800">{stats.cancelled}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow p-4 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Doanh thu</p>
            <p className="text-xl font-bold mt-1">
              ${stats.revenue.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border">
        <label className="block text-sm font-semibold mb-2">
          <i className="fa-solid fa-search mr-2"></i>
          Tìm kiếm đơn hàng
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập mã đơn, tên khách hàng, email..."
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
        />
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 bg-white rounded-lg shadow border p-2">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "Tất cả", count: stats.total },
            { value: "pending", label: "Chờ xử lý", count: stats.pending },
            { value: "processing", label: "Đang xử lý", count: stats.processing },
            { value: "shipped", label: "Đã gửi", count: stats.shipped },
            { value: "delivered", label: "Đã giao", count: stats.delivered },
            { value: "cancelled", label: "Đã hủy", count: stats.cancelled },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-md font-medium transition ${
                filter === tab.value
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden border">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold text-sm">
                      Đơn hàng
                    </th>
                    <th className="text-left px-6 py-3 font-semibold text-sm">
                      Khách hàng
                    </th>
                    <th className="text-center px-6 py-3 font-semibold text-sm">
                      Tổng tiền
                    </th>
                    <th className="text-center px-6 py-3 font-semibold text-sm">
                      Trạng thái
                    </th>
                    <th className="text-center px-6 py-3 font-semibold text-sm">
                      Ngày
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <i className="fa-solid fa-receipt text-4xl mb-2 block text-gray-300"></i>
                        {searchTerm || filter !== "all"
                          ? "Không tìm thấy đơn hàng"
                          : "Chưa có đơn hàng nào"}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className={`hover:bg-gray-50 cursor-pointer transition ${
                          selectedOrder?.id === order.id ? "bg-blue-50" : ""
                        }`}
                        onClick={() => setSelectedOrder(order)}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-blue-600">
                              {order.orderNumber}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.items.length} sản phẩm
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-sm">
                            {order.shippingAddress.fullName}
                          </p>
                          <p className="text-xs text-gray-600">
                            {order.shippingAddress.email}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="font-bold text-blue-600">
                            ${order.total.toLocaleString()}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            <i className={`fa-solid ${getStatusIcon(order.status)}`}></i>
                            {getStatusLabel(order.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Order Details */}
        {selectedOrder ? (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4 border">
              <div className="flex justify-between items-start mb-4 pb-4 border-b">
                <div>
                  <h2 className="text-lg font-bold">
                    {selectedOrder.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>

              {/* Status Update */}
              <div className="mb-4 pb-4 border-b">
                <label className="block text-sm font-semibold mb-2">
                  <i className="fa-solid fa-edit mr-2"></i>
                  Cập nhật Trạng thái
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value)
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipped">Đã gửi</option>
                  <option value="delivered">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>

              {/* Customer Info */}
              <div className="mb-4 pb-4 border-b">
                <h3 className="font-semibold mb-2 flex items-center">
                  <i className="fa-solid fa-user mr-2"></i>
                  Khách hàng
                </h3>
                <p className="text-sm font-semibold">
                  {selectedOrder.shippingAddress.fullName}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress.email}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress.phone}
                </p>
              </div>

              {/* Shipping Address */}
              <div className="mb-4 pb-4 border-b">
                <h3 className="font-semibold mb-2 flex items-center">
                  <i className="fa-solid fa-location-dot mr-2"></i>
                  Địa chỉ Giao hàng
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress.address}
                </p>
                <p className="text-sm text-gray-600">
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.state}{" "}
                  {selectedOrder.shippingAddress.zipCode}
                </p>
              </div>

              {/* Items */}
              <div className="mb-4 pb-4 border-b">
                <h3 className="font-semibold mb-2 flex items-center">
                  <i className="fa-solid fa-box mr-2"></i>
                  Sản phẩm ({selectedOrder.items.length})
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="text-sm bg-gray-50 p-2 rounded">
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-gray-600">
                        SL: {item.quantity} × ${item.price.toLocaleString()} = ${(item.quantity * item.price).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">
                    ${selectedOrder.subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">
                    ${selectedOrder.shippingFee}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thuế:</span>
                  <span className="font-medium">${selectedOrder.tax}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">
                    ${selectedOrder.total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <button className="w-full btn btn-primary text-sm">
                  <i className="fa-solid fa-print mr-2"></i>
                  In đơn hàng
                </button>
                <button className="w-full btn btn-outline text-sm">
                  <i className="fa-solid fa-envelope mr-2"></i>
                  Gửi email cho khách
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 border h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <i className="fa-solid fa-hand-pointer text-4xl mb-2"></i>
                <p>Chọn đơn hàng để xem chi tiết</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrderPage;
