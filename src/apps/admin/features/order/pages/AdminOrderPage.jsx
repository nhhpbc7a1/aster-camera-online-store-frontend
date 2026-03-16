import React, { useState, useEffect } from "react";
import orderService from "@/domains/order/services/order.service";

function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

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
      loadOrders();
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-black-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <div className="p-6">Loading orders...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Orders Management</h1>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2 border-b">
        {[
          "all",
          "pending",
          "processing",
          "shipped",
          "delivered",
          "cancelled",
        ].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-semibold capitalize border-b-2 transition ${filter === status
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-600 hover:text-blue-600"
              }`}
          >
            {status} ({orders.filter((o) => o.status === status).length})
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold">Order #</th>
                  <th className="text-left px-6 py-3 font-semibold">
                    Customer
                  </th>
                  <th className="text-center px-6 py-3 font-semibold">Total</th>
                  <th className="text-center px-6 py-3 font-semibold">
                    Status
                  </th>
                  <th className="text-center px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-t hover:bg-gray-50 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <td className="px-6 py-4 font-semibold text-blue-600">
                        {order.orderNumber}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold">
                          {order.shippingAddress.fullName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-blue-600">
                        ${order.total.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Order Details */}
        {selectedOrder && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-lg font-bold">
                    {selectedOrder.orderNumber}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Status Update */}
              <div className="mb-4 pb-4 border-b">
                <label className="block text-sm font-semibold mb-2">
                  Update Status
                </label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    handleStatusChange(selectedOrder.id, e.target.value)
                  }
                  className="w-full border rounded px-3 py-2 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Customer Info */}
              <div className="mb-4 pb-4 border-b">
                <h3 className="font-semibold mb-2">Customer</h3>
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
                <h3 className="font-semibold mb-2">Shipping Address</h3>
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
                <h3 className="font-semibold mb-2">
                  Items ({selectedOrder.items.length})
                </h3>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="text-sm">
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-gray-600">
                        Qty: {item.quantity} × ${item.price.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>${selectedOrder.shippingFee}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${selectedOrder.tax}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>${selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrderPage;
