import React, { useState, useEffect } from 'react';
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
import productService from '@/domains/product/services/productService';
import categoryService from '@/domains/category/services/categoryService';
import { formatCurrency } from '@/utils/currencyHelpers';

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
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        productService.getProducts(),
        categoryService.getCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate real stats from data
  const calculateStats = () => {
    const totalRevenue = products.reduce((sum, p) => {
      const price = p.salePrice || p.price;
      const quantity = p.quantity || 0;
      return sum + (price * quantity);
    }, 0);

    const inStockProducts = products.filter(p => p.inStock).length;
    const featuredProducts = products.filter(p => p.isFeatured).length;
    const flashSaleProducts = products.filter(p => p.isFlashSale).length;

    return {
      totalRevenue,
      totalProducts: products.length,
      inStockProducts,
      outOfStockProducts: products.length - inStockProducts,
      featuredProducts,
      flashSaleProducts,
      totalCategories: categories.length,
      totalSubcategories: categories.reduce(
        (sum, cat) => sum + (cat.subcategories?.length || 0),
        0
      ),
    };
  };

  const stats = calculateStats();

  // Get top products by price * quantity
  const getTopProducts = () => {
    return [...products]
      .map(p => ({
        ...p,
        revenue: (p.salePrice || p.price) * (p.quantity || 0),
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  };

  const topProducts = getTopProducts();

  // Get category name helper
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'N/A';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Mock data - thay thế bằng API calls thực tế
  const statsCards = [
    {
      title: 'Tổng giá trị kho',
      value: formatCurrency(stats.totalRevenue),
      change: '+12.5%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'green'
    },
    {
      title: 'Sản phẩm',
      value: stats.totalProducts.toString(),
      change: `${stats.inStockProducts} còn hàng`,
      changeType: 'positive',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Danh mục',
      value: stats.totalCategories.toString(),
      change: `${stats.totalSubcategories} danh mục con`,
      changeType: 'positive',
      icon: ShoppingBag,
      color: 'purple'
    },
    {
      title: 'Nổi bật',
      value: stats.featuredProducts.toString(),
      change: `${stats.flashSaleProducts} Flash Sale`,
      changeType: 'positive',
      icon: Star,
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

  const topProductsOld = [
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
        {statsCards.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Summary - Takes 2 columns */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Tổng quan Sản phẩm</h2>
              <p className="text-sm text-gray-500 mt-1">Thống kê sản phẩm trong hệ thống</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.totalProducts}</div>
              <div className="text-sm text-blue-600 mt-1">Tổng sản phẩm</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">{stats.inStockProducts}</div>
              <div className="text-sm text-green-600 mt-1">Còn hàng</div>
            </div>
            <div className="bg-red-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-600">{stats.outOfStockProducts}</div>
              <div className="text-sm text-red-600 mt-1">Hết hàng</div>
            </div>
            <div className="bg-yellow-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.featuredProducts}</div>
              <div className="text-sm text-yellow-600 mt-1">Nổi bật</div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Phân bố theo danh mục</h3>
            <div className="space-y-2">
              {categories.slice(0, 5).map((category) => {
                const productCount = products.filter(p => p.categoryId === category.id).length;
                const percentage = stats.totalProducts > 0 ? (productCount / stats.totalProducts * 100).toFixed(1) : 0;
                return (
                  <div key={category.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-700">{category.name}</span>
                        <span className="text-sm font-medium text-gray-900">{productCount} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Inventory Value Chart Card */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-gray-900">Giá trị tồn kho</h3>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              <div className="pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tổng giá trị</span>
                  <span className="text-lg font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Còn hàng</span>
                    <span className="font-medium text-green-600">{stats.inStockProducts}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Hết hàng</span>
                    <span className="font-medium text-red-600">{stats.outOfStockProducts}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Flash Sale</span>
                    <span className="font-medium text-orange-600">{stats.flashSaleProducts}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Summary */}
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-6 text-white shadow-sm">
            <h3 className="text-base font-semibold mb-2">Danh mục</h3>
            <p className="text-3xl font-bold mb-4">{stats.totalCategories}</p>
            <p className="text-primary-100 text-sm mb-4">
              {stats.totalSubcategories} danh mục con
            </p>
            <button 
              onClick={() => window.location.href = '/admin/categories'}
              className="w-full bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-primary-50 transition-colors"
            >
              Quản lý danh mục
            </button>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Top sản phẩm giá trị cao</h2>
            <p className="text-sm text-gray-500 mt-1">Sản phẩm có tổng giá trị (giá × số lượng) cao nhất</p>
          </div>
          <button 
            onClick={() => window.location.href = '/admin/products'}
            className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            Xem tất cả
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
        {topProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Chưa có sản phẩm nào</p>
          </div>
        ) : (
          <div className="space-y-1">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary-600">#{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500">{getCategoryName(product.categoryId)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{formatCurrency(product.revenue)}</p>
                  <p className="text-xs text-gray-500">{product.quantity} trong kho</p>
                </div>
                <div className="flex items-center gap-1">
                  {product.isFeatured && (
                    <span className="text-yellow-500" title="Nổi bật">
                      <Star className="w-4 h-4 fill-current" />
                    </span>
                  )}
                  {product.inStock ? (
                    <span className="text-green-600 text-xs">✓</span>
                  ) : (
                    <span className="text-red-600 text-xs">✗</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
