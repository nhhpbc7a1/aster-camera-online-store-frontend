import React, { useState, useEffect } from "react";
import orderService from "@/domains/order/services/order.service";
import { formatCurrency } from "@/utils/currencyHelpers";

function AdminOrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      alert("Không thể tải danh sách đơn hàng!");
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
      alert("Không thể cập nhật trạng thái đơn hàng");
    }
  };

  const handlePrintOrder = () => {
    if (!selectedOrder) return;
    
    // Create print window
    const printWindow = window.open('', '_blank');
    const order = selectedOrder;
    
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Đơn hàng ${order.orderNumber}</title>
          <style>
            @media print {
              @page { margin: 1cm; }
              body { font-family: Arial, sans-serif; }
            }
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .order-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
            }
            .section {
              margin-bottom: 20px;
            }
            .section h3 {
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            table th, table td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            table th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
            .total {
              text-align: right;
              font-size: 18px;
              font-weight: bold;
              margin-top: 20px;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>HÓA ĐƠN BÁN HÀNG</h1>
            <p>Mã đơn: <strong>${order.orderNumber}</strong></p>
            <p>Ngày: ${new Date(order.createdAt).toLocaleString("vi-VN")}</p>
          </div>
          
          <div class="order-info">
            <div class="section">
              <h3>Thông tin khách hàng</h3>
              <p><strong>${order.shippingAddress.fullName}</strong></p>
              <p>Email: ${order.email || order.shippingAddress.email || 'N/A'}</p>
              <p>Điện thoại: ${order.shippingAddress.phone}</p>
            </div>
            <div class="section">
              <h3>Địa chỉ giao hàng</h3>
              <p>${order.shippingAddress.address}</p>
              <p>${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
              <p>${order.shippingAddress.zipCode}, ${order.shippingAddress.country}</p>
            </div>
          </div>
          
          <div class="section">
            <h3>Chi tiết sản phẩm</h3>
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map((item, idx) => `
                  <tr>
                    <td>${idx + 1}</td>
                    <td>${item.productName}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${formatCurrency(item.subtotal)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <table>
              <tr>
                <td><strong>Tạm tính:</strong></td>
                <td style="text-align: right;">${formatCurrency(order.subtotal)}</td>
              </tr>
              <tr>
                <td><strong>Phí vận chuyển:</strong></td>
                <td style="text-align: right;">${formatCurrency(order.shippingFee)}</td>
              </tr>
              <tr>
                <td><strong>Thuế:</strong></td>
                <td style="text-align: right;">${formatCurrency(order.tax)}</td>
              </tr>
              <tr style="background-color: #f5f5f5;">
                <td><strong>Tổng cộng:</strong></td>
                <td style="text-align: right; font-size: 18px;"><strong>${formatCurrency(order.total)}</strong></td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <h3>Thông tin thanh toán</h3>
            <p>Phương thức: <strong>${getPaymentMethodLabel(order.paymentMethod)}</strong></p>
            <p>Trạng thái: <strong>${getStatusLabel(order.status)}</strong></p>
          </div>
          
          <div class="footer">
            <p>Cảm ơn quý khách đã mua hàng!</p>
            <p>Mọi thắc mắc vui lòng liên hệ: support@example.com</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      cash_on_delivery: "Thanh toán khi nhận hàng",
      credit_card: "Thẻ tín dụng",
      debit_card: "Thẻ ghi nợ",
      bank_transfer: "Chuyển khoản ngân hàng",
    };
    return labels[method] || method;
  };

  const handleSendEmail = async () => {
    if (!selectedOrder) return;
    
    const email = selectedOrder.email || selectedOrder.shippingAddress?.email;
    if (!email) {
      alert("Không tìm thấy email của khách hàng!");
      return;
    }

    if (!window.confirm(`Gửi email xác nhận đơn hàng đến ${email}?`)) {
      return;
    }

    try {
      setEmailSending(true);
      
      // Create email content
      const emailSubject = `Xác nhận đơn hàng ${selectedOrder.orderNumber}`;
      const emailBody = `
Xin chào ${selectedOrder.shippingAddress.fullName},

Cảm ơn bạn đã đặt hàng tại cửa hàng của chúng tôi!

Thông tin đơn hàng:
- Mã đơn: ${selectedOrder.orderNumber}
- Ngày đặt: ${new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
- Trạng thái: ${getStatusLabel(selectedOrder.status)}
- Tổng tiền: ${formatCurrency(selectedOrder.total)}

Sản phẩm đã đặt:
${selectedOrder.items.map((item, idx) => `${idx + 1}. ${item.productName} - SL: ${item.quantity} - ${formatCurrency(item.subtotal)}`).join('\n')}

Địa chỉ giao hàng:
${selectedOrder.shippingAddress.address}
${selectedOrder.shippingAddress.city}, ${selectedOrder.shippingAddress.state}
${selectedOrder.shippingAddress.zipCode}, ${selectedOrder.shippingAddress.country}

Chúng tôi sẽ liên hệ với bạn sớm nhất có thể để xác nhận đơn hàng.

Trân trọng,
Đội ngũ Camera Online Store
      `.trim();

      // Use mailto link as fallback (or you can implement API call here)
      const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      
      // For now, we'll use mailto. In production, you'd call an API endpoint
      window.location.href = mailtoLink;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`Email đã được mở trong ứng dụng email mặc định của bạn!\n\nTrong môi trường production, email sẽ được gửi tự động đến ${email}`);
      
      setShowEmailModal(false);
    } catch (err) {
      alert("Không thể gửi email. Vui lòng thử lại.");
    } finally {
      setEmailSending(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filter === "all" || order.status === filter;
    const email = order.email || order.shippingAddress?.email || "";
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase());
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
    <div className="p-6 max-[850px]:p-4 w-full overflow-x-hidden">
      <div className="flex justify-between items-center mb-6 max-[850px]:mb-4">
        <div>
          <h1 className="text-3xl max-[850px]:text-xl font-bold">Quản lý Đơn hàng</h1>
          <p className="text-gray-600 mt-1 max-[850px]:text-sm">
            Quản lý tất cả đơn hàng ({orders.length})
          </p>
        </div>
        <button
          onClick={loadOrders}
          className="btn btn-outline max-[850px]:text-sm max-[850px]:px-3 max-[850px]:py-1"
        >
          <i className="fa-solid fa-rotate mr-2 max-[850px]:mr-1"></i>
          <span className="max-[850px]:hidden">Làm mới</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4 mb-6 max-[850px]:grid-cols-2 max-[850px]:gap-2 max-[850px]:mb-4 w-full">
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

        <div className="bg-purple-50 rounded-lg shadow p-4 max-[850px]:p-2 border border-purple-200 hidden lg:block">
          <div className="text-center">
            <p className="text-sm text-purple-700 max-[850px]:text-xs">Đã gửi</p>
            <p className="text-2xl max-[850px]:text-lg font-bold mt-1 text-purple-800">{stats.shipped}</p>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow p-4 max-[850px]:p-2 border border-green-200 hidden lg:block">
          <div className="text-center">
            <p className="text-sm text-green-700 max-[850px]:text-xs">Đã giao</p>
            <p className="text-2xl max-[850px]:text-lg font-bold mt-1 text-green-800">{stats.delivered}</p>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg shadow p-4 max-[850px]:p-2 border border-red-200 hidden lg:block">
          <div className="text-center">
            <p className="text-sm text-red-700 max-[850px]:text-xs">Đã hủy</p>
            <p className="text-2xl max-[850px]:text-lg font-bold mt-1 text-red-800">{stats.cancelled}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg shadow p-4 max-[850px]:p-2 text-white hidden lg:block">
          <div className="text-center">
            <p className="text-sm max-[850px]:text-xs opacity-90">Doanh thu</p>
            <p className="text-xl max-[850px]:text-lg font-bold mt-1">
              {formatCurrency(stats.revenue)}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 max-[850px]:p-3 mb-6 max-[850px]:mb-4 border w-full overflow-x-hidden">
        <label className="block text-sm max-[850px]:text-xs font-semibold mb-2">
          <i className="fa-solid fa-search mr-2"></i>
          Tìm kiếm đơn hàng
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập mã đơn, tên khách hàng, email..."
          className="w-full border rounded-md px-3 py-2 max-[850px]:text-sm focus:outline-none focus:border-black"
        />
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 max-[850px]:mb-4 bg-white rounded-lg shadow border p-2 max-[850px]:p-1">
        <div className="flex flex-wrap gap-2 max-[850px]:gap-1">
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
              className={`px-4 max-[850px]:px-2 py-2 max-[850px]:py-1 rounded-md font-medium max-[850px]:text-xs transition ${
                filter === tab.value
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border"
              }`}
            >
              <span className="max-[850px]:hidden">{tab.label} ({tab.count})</span>
              <span className="min-[851px]:hidden">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-[850px]:gap-4">
        {/* Orders List */}
        <div className="lg:col-span-2">
          {/* Desktop Table - Full (XL screens) */}
          <div className="bg-white rounded-lg shadow overflow-hidden border hidden xl:block w-full">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
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
                            {order.email || order.shippingAddress?.email || "N/A"}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <p className="font-bold text-blue-600">
                            {formatCurrency(order.total)}
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

          {/* Medium Table - Compact (MD to XL screens) */}
          <div className="bg-white rounded-lg shadow overflow-hidden border hidden md:block xl:hidden w-full">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-sm">
                      Đơn hàng
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-sm">
                      Khách hàng
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-sm">
                      Tổng tiền
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-sm">
                      Trạng thái
                    </th>
                    <th className="text-center px-4 py-3 font-semibold text-sm">
                      Ngày
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-4 py-12 text-center text-gray-500"
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
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-semibold text-sm text-blue-600">
                              {order.orderNumber}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.items.length} SP
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-sm line-clamp-1">
                            {order.shippingAddress.fullName}
                          </p>
                          <p className="text-xs text-gray-600 line-clamp-1">
                            {order.email || order.shippingAddress?.email || "N/A"}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <p className="font-bold text-sm text-blue-600">
                            {formatCurrency(order.total)}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                              order.status
                            )}`}
                          >
                            <i className={`fa-solid ${getStatusIcon(order.status)} text-xs`}></i>
                            <span className="hidden lg:inline">{getStatusLabel(order.status)}</span>
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="md:hidden space-y-3">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-6 border text-center text-gray-500">
                <i className="fa-solid fa-receipt text-4xl mb-2 block text-gray-300"></i>
                {searchTerm || filter !== "all"
                  ? "Không tìm thấy đơn hàng"
                  : "Chưa có đơn hàng nào"}
              </div>
            ) : (
              filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-lg shadow p-4 border cursor-pointer transition ${
                    selectedOrder?.id === order.id ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => setSelectedOrder(order)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-blue-600 text-sm">{order.orderNumber}</p>
                      <p className="text-xs text-gray-500">{order.items.length} sản phẩm</p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      <i className={`fa-solid ${getStatusIcon(order.status)}`}></i>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div>
                      <p className="font-semibold text-sm">{order.shippingAddress.fullName}</p>
                      <p className="text-xs text-gray-600">
                        {order.email || order.shippingAddress?.email || "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-blue-600">{formatCurrency(order.total)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Order Details */}
        {selectedOrder ? (
          <div className="lg:col-span-1 max-[850px]:fixed max-[850px]:inset-0 max-[850px]:z-50 max-[850px]:bg-white max-[850px]:overflow-y-auto">
            <div className="bg-white rounded-lg shadow p-6 max-[850px]:p-4 max-[850px]:rounded-none max-[850px]:shadow-none sticky top-4 max-[850px]:sticky max-[850px]:top-0 border max-[850px]:border-0">
              <div className="flex justify-between items-start mb-4 pb-4 border-b">
                <div>
                  <h2 className="text-lg max-[850px]:text-base font-bold">
                    {selectedOrder.orderNumber}
                  </h2>
                  <p className="text-sm max-[850px]:text-xs text-gray-600">
                    {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 transition max-[850px]:text-2xl"
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
                  <i className="fa-solid fa-envelope mr-1"></i>
                  {selectedOrder.email || selectedOrder.shippingAddress?.email || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <i className="fa-solid fa-phone mr-1"></i>
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
                  {(() => {
                    // Remove duplicates by productId or productName, combine quantities
                    const uniqueItems = selectedOrder.items.reduce((acc, item) => {
                      const identifier = item.productId || item.productName;
                      const existing = acc.find(i => (i.productId || i.productName) === identifier);
                      
                      if (existing) {
                        // If duplicate found, combine quantities
                        existing.quantity += item.quantity || 1;
                        existing.subtotal = (existing.subtotal || 0) + (item.subtotal || item.price * item.quantity || 0);
                      } else {
                        // Add new item
                        acc.push({ ...item });
                      }
                      return acc;
                    }, []);
                    
                    return uniqueItems.map((item, idx) => {
                      const uniqueKey = item.id || item.productId || `${item.productName}-${idx}`;
                      const subtotal = item.subtotal || (item.price * item.quantity);
                      
                      return (
                        <div key={uniqueKey} className="text-sm bg-gray-50 p-2 rounded">
                          <p className="font-semibold">{item.productName}</p>
                          <p className="text-gray-600">
                            SL: {item.quantity} × {formatCurrency(item.price)} = {formatCurrency(subtotal)}
                          </p>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-medium">
                    {formatCurrency(selectedOrder.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-medium">
                    {formatCurrency(selectedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thuế:</span>
                  <span className="font-medium">{formatCurrency(selectedOrder.tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">
                    {formatCurrency(selectedOrder.total)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t space-y-2">
                <button
                  onClick={handlePrintOrder}
                  className="w-full btn btn-primary text-sm"
                  disabled={!selectedOrder}
                >
                  <i className="fa-solid fa-print mr-2"></i>
                  In đơn hàng
                </button>
                <button
                  onClick={handleSendEmail}
                  className="w-full btn btn-outline text-sm"
                  disabled={!selectedOrder || emailSending}
                >
                  {emailSending ? (
                    <>
                      <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                      Đang gửi...
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-envelope mr-2"></i>
                      Gửi email cho khách
                    </>
                  )}
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
