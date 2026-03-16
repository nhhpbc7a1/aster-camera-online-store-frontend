import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Package,
  Users,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Eye
} from 'lucide-react';

// Stat Card Component
const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => {
  const isPositive = changeType === 'positive';
  const bgColorClass = `bg-${color}-50`;
  const textColorClass = `text-${color}-600`;
  const iconBgClass = `bg-${color}-100`;

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{value}</h3>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 text-green-600" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {change}
            </span>
            <span className="text-sm text-gray-500">vs tháng trước</span>
          </div>
        </div>
        <div className={`p-3 rounded-lg ${color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : color === 'purple' ? 'bg-purple-100' : 'bg-orange-100'}`}>
          <Icon className={`w-6 h-6 ${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'purple' ? 'text-purple-600' : 'text-orange-600'}`} />
        </div>
      </div>
    </div>
  );
};

// Recent Order Item Component
const RecentOrderItem = ({ orderId, customer, product, amount, status, time }) => {
  const statusColors = {
    completed: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700'
  };

  const statusLabels = {
    completed: 'Hoàn thành',
    pending: 'Chờ xử lý',
    processing: 'Đang xử lý',
    cancelled: 'Đã hủy'
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">#{orderId}</p>
        <p className="text-sm text-gray-500 truncate">{customer} • {product}</p>
      </div>
      <div className="flex items-center gap-3 ml-4">
        <span className="text-sm font-semibold text-gray-900">{amount}</span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
        <span className="text-xs text-gray-400 whitespace-nowrap">{time}</span>
      </div>
    </div>
  );
};

// Top Product Item Component
const TopProductItem = ({ rank, name, category, sales, revenue, trend }) => {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
        <span className="text-sm font-bold text-primary-600">#{rank}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        <p className="text-xs text-gray-500">{category}</p>
      </div>
      <div className="text-right">
        <p className="text-sm font-semibold text-gray-900">{revenue}</p>
        <p className="text-xs text-gray-500">{sales} đã bán</p>
      </div>
      <div className="flex items-center gap-1">
        <TrendingUp className="w-4 h-4 text-green-600" />
        <span className="text-sm font-medium text-green-600">{trend}</span>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  // Mock data - thay thế bằng API calls thực tế
  const stats = [
    {
      title: 'Tổng doanh thu',
      value: '₫324.5M',
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Đơn hàng',
      value: '1,429',
      change: '+8.2%',
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'blue'
    },
    {
      title: 'Sản phẩm',
      value: '2,847',
      change: '+23',
      changeType: 'positive',
      icon: Package,
      color: 'purple'
    },
    {
      title: 'Khách hàng',
      value: '8,492',
      change: '+15.3%',
      changeType: 'positive',
      icon: Users,
      color: 'orange'
    }
  ];

  const recentOrders = [
    { orderId: 'ORD-001234', customer: 'Nguyễn Văn A', product: 'Canon EOS R5', amount: '₫89.5M', status: 'completed', time: '2 phút trước' },
    { orderId: 'ORD-001233', customer: 'Trần Thị B', product: 'Sony A7 IV', amount: '₫62.3M', status: 'processing', time: '15 phút trước' },
    { orderId: 'ORD-001232', customer: 'Lê Văn C', product: 'Nikon Z9', amount: '₫125.8M', status: 'pending', time: '1 giờ trước' },
    { orderId: 'ORD-001231', customer: 'Phạm Thị D', product: 'Fujifilm X-T5', amount: '₫42.5M', status: 'completed', time: '2 giờ trước' },
    { orderId: 'ORD-001230', customer: 'Hoàng Văn E', product: 'Canon R6 Mark II', amount: '₫68.9M', status: 'cancelled', time: '3 giờ trước' }
  ];

  const topProducts = [
    { rank: 1, name: 'Canon EOS R5', category: 'Máy ảnh Mirrorless', sales: '243', revenue: '₫21.7M', trend: '+18%' },
    { rank: 2, name: 'Sony A7 IV', category: 'Máy ảnh Mirrorless', sales: '198', revenue: '₫12.3M', trend: '+15%' },
    { rank: 3, name: 'Nikon Z9', category: 'Máy ảnh Mirrorless', sales: '156', revenue: '₫19.6M', trend: '+22%' },
    { rank: 4, name: 'Canon RF 24-70mm f/2.8', category: 'Ống kính', sales: '134', revenue: '₫8.4M', trend: '+12%' },
    { rank: 5, name: 'DJI Mavic 3 Pro', category: 'Flycam', sales: '98', revenue: '₫14.5M', trend: '+25%' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h2>
              <p className="text-sm text-gray-500 mt-1">Các đơn hàng mới nhất trong hệ thống</p>
            </div>
            <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
              Xem tất cả
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-1">
            {recentOrders.map((order, index) => (
              <RecentOrderItem key={index} {...order} />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Revenue Chart Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Doanh thu tuần này</h3>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-end gap-2 h-32">
                {[65, 45, 75, 55, 85, 70, 90].map((height, index) => (
                  <div key={index} className="flex-1 bg-primary-100 rounded-t-lg hover:bg-primary-200 transition-colors" style={{ height: `${height}%` }} />
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>T2</span>
                <span>T3</span>
                <span>T4</span>
                <span>T5</span>
                <span>T6</span>
                <span>T7</span>
                <span>CN</span>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tổng cộng</span>
                  <span className="text-lg font-bold text-gray-900">₫45.8M</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">+24.5% so với tuần trước</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-sm">
            <h3 className="text-base font-semibold mb-2">Khách hàng mới</h3>
            <p className="text-3xl font-bold mb-4">+342</p>
            <p className="text-primary-100 text-sm mb-4">Tăng 23% so với tháng trước</p>
            <button className="w-full bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors">
              Xem chi tiết
            </button>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Top sản phẩm bán chạy</h2>
            <p className="text-sm text-gray-500 mt-1">Các sản phẩm có doanh số cao nhất tháng này</p>
          </div>
          <button className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1">
            Xem báo cáo
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-1">
          {topProducts.map((product, index) => (
            <TopProductItem key={index} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
