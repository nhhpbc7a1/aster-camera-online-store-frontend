import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import storeService from "@/domains/store/services/storeService";

function AdminStorePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Reload stores when route changes (e.g., navigating back from form)
  useEffect(() => {
    loadStores();
  }, [location.pathname]);

  const loadStores = async () => {
    try {
      setLoading(true);
      const storesData = await storeService.getAllStores();
      setStores(storesData);
    } catch (err) {
      alert("Không thể tải danh sách cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStore = async (storeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cửa hàng này?")) {
      try {
        await storeService.deleteStore(storeId);
        alert("Cửa hàng đã được xóa!");
        await loadStores();
      } catch (err) {
        alert("Không thể xóa cửa hàng: " + (err.message || "Lỗi không xác định"));
      }
    }
  };

  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    store.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải cửa hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-[850px]:p-4 w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 max-[850px]:mb-4">
        <div>
          <h1 className="text-3xl max-[850px]:text-xl font-bold">Quản lý Cửa hàng</h1>
          <p className="text-gray-600 mt-1 max-[850px]:text-sm">
            Quản lý hệ thống cửa hàng ({stores.length})
          </p>
        </div>
        <button
          onClick={() => navigate("/admin/stores/add")}
          className="btn btn-primary max-[850px]:text-sm max-[850px]:px-3 max-[850px]:py-1"
        >
          <i className="fa-solid fa-plus mr-2 max-[850px]:mr-1"></i>
          <span className="max-[850px]:hidden">Thêm Cửa hàng Mới</span>
          <span className="min-[851px]:hidden">Thêm</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-[850px]:grid-cols-1 max-[850px]:gap-2 max-[850px]:mb-4 w-full">
        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng Cửa hàng</p>
              <p className="text-2xl font-bold mt-1">{stores.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-store text-blue-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cửa hàng Nổi bật</p>
              <p className="text-2xl font-bold mt-1 text-yellow-600">
                {stores.filter((s) => s.featured).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-star text-yellow-600 text-xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang mở cửa</p>
              <p className="text-2xl font-bold mt-1 text-green-600">
                {stores.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-door-open text-green-600 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 max-[850px]:p-3 mb-6 max-[850px]:mb-4 border w-full overflow-x-hidden">
        <label className="block text-sm font-semibold mb-2">
          <i className="fa-solid fa-search mr-2"></i>
          Tìm kiếm cửa hàng
        </label>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập tên hoặc địa chỉ cửa hàng..."
          className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
        />
      </div>

      {/* Stores Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-[850px]:gap-4 w-full">
        {filteredStores.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-12 text-center border">
            <i className="fa-solid fa-store-slash text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">
              {searchTerm ? "Không tìm thấy cửa hàng" : "Chưa có cửa hàng nào"}
            </p>
          </div>
        ) : (
          filteredStores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-lg shadow overflow-hidden border hover:shadow-lg transition"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={store.image || "https://via.placeholder.com/400x300"}
                  alt={store.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/400x300";
                  }}
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-lg">{store.name}</h3>
                  {store.featured && (
                    <i className="fa-solid fa-star text-yellow-500"></i>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  <i className="fa-solid fa-location-dot mr-1"></i>
                  {store.address}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <i className="fa-solid fa-clock mr-1"></i>
                  {store.hours}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <i className="fa-solid fa-phone mr-1"></i>
                  {store.phones?.join(", ") || "N/A"}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  <i className="fa-solid fa-envelope mr-1"></i>
                  {store.email}
                </p>
                {store.description && (
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {store.description}
                  </p>
                )}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/admin/stores/edit/${store.id}`)}
                    className="flex-1 btn btn-outline text-sm"
                  >
                    <i className="fa-solid fa-pen-to-square mr-1"></i>
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDeleteStore(store.id)}
                    className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-200 transition"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AdminStorePage;
