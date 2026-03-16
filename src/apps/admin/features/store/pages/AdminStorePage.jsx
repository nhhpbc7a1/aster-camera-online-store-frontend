import React, { useState, useEffect } from "react";

function AdminStorePage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phones: [""],
    email: "",
    hours: "",
    latitude: 0,
    longitude: 0,
    featured: false,
    description: "",
    image: "",
  });

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockStores = [
        {
          id: 1,
          name: "ASTER Production",
          address: "202, Đường Lê Văn Việt, Phường 1, Quận 10, TP.HCM",
          phones: ["0794352262"],
          email: "asterproduction333@gmail.com",
          hours: "8:00 AM - 9:00 PM",
          latitude: 21.0285,
          longitude: 105.7842,
          featured: true,
          description: "Cửa hàng chính, phục vụ toàn bộ TP.HCM",
          image: "https://via.placeholder.com/400x300",
        },
      ];
      setStores(mockStores);
    } catch (err) {
      console.error("Error loading stores:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...formData.phones];
    newPhones[index] = value;
    setFormData((prev) => ({ ...prev, phones: newPhones }));
  };

  const addPhoneField = () => {
    setFormData((prev) => ({ ...prev, phones: [...prev.phones, ""] }));
  };

  const removePhoneField = (index) => {
    const newPhones = formData.phones.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, phones: newPhones }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updatedStores = stores.map((store) =>
          store.id === editingId ? { ...formData, id: editingId } : store
        );
        setStores(updatedStores);
        alert("Cửa hàng đã được cập nhật!");
      } else {
        const newStore = {
          ...formData,
          id: Math.max(...stores.map((s) => s.id), 0) + 1,
        };
        setStores([...stores, newStore]);
        alert("Cửa hàng đã được thêm!");
      }
      handleResetForm();
    } catch (err) {
      console.error("Error saving store:", err);
      alert("Không thể lưu cửa hàng");
    }
  };

  const handleEditStore = (store) => {
    setFormData({
      name: store.name,
      address: store.address,
      phones: store.phones,
      email: store.email,
      hours: store.hours,
      latitude: store.latitude,
      longitude: store.longitude,
      featured: store.featured,
      description: store.description,
      image: store.image,
    });
    setImagePreview(store.image);
    setEditingId(store.id);
    setShowForm(true);
  };

  const handleDeleteStore = (storeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cửa hàng này?")) {
      const updatedStores = stores.filter((store) => store.id !== storeId);
      setStores(updatedStores);
      alert("Cửa hàng đã được xóa!");
    }
  };

  const handleResetForm = () => {
    setFormData({
      name: "",
      address: "",
      phones: [""],
      email: "",
      hours: "",
      latitude: 0,
      longitude: 0,
      featured: false,
      description: "",
      image: "",
    });
    setImagePreview(null);
    setEditingId(null);
    setShowForm(false);
  };

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Cửa hàng</h1>
          <p className="text-gray-600 mt-1">
            Quản lý hệ thống cửa hàng ({stores.length})
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <i className="fa-solid fa-plus mr-2"></i>
          Thêm Cửa hàng Mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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

      {showForm && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">
              {editingId ? "Chỉnh sửa Cửa hàng" : "Thêm Cửa hàng Mới"}
            </h2>
            <button
              onClick={handleResetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Tên Cửa hàng *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="VD: ASTER Production"
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
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="store@example.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Địa chỉ *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="202, Đường Lê Văn Việt, Phường 1, Quận 10, TP.HCM"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Giờ mở cửa *
                </label>
                <input
                  type="text"
                  name="hours"
                  value={formData.hours}
                  onChange={handleFormChange}
                  required
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="8:00 AM - 9:00 PM"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Số điện thoại
                </label>
                {formData.phones.map((phone, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => handlePhoneChange(index, e.target.value)}
                      className="flex-1 border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                      placeholder="0123456789"
                    />
                    {formData.phones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePhoneField(index)}
                        className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPhoneField}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  <i className="fa-solid fa-plus mr-1"></i>
                  Thêm số điện thoại
                </button>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Vĩ độ (Latitude)
                </label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude}
                  onChange={handleFormChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="21.0285"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Kinh độ (Longitude)
                </label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude}
                  onChange={handleFormChange}
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="105.7842"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Mô tả
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="3"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                  placeholder="Nhập mô tả về cửa hàng..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2">
                  Hình ảnh Cửa hàng
                </label>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full border rounded-md px-3 py-2 text-sm"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Hoặc nhập URL hình ảnh
                    </p>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleFormChange}
                      className="w-full border rounded-md px-3 py-2 mt-2 text-sm focus:outline-none focus:border-black"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  {(imagePreview || formData.image) && (
                    <div className="w-32 h-32 border rounded-md overflow-hidden">
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleFormChange}
                    className="w-5 h-5 mr-2 cursor-pointer"
                  />
                  <span className="text-sm font-semibold">
                    <i className="fa-solid fa-star text-yellow-500 mr-1"></i>
                    Đánh dấu là cửa hàng nổi bật
                  </span>
                </label>
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t">
              <button type="submit" className="flex-1 btn btn-primary">
                <i className="fa-solid fa-check mr-2"></i>
                {editingId ? "Cập nhật Cửa hàng" : "Thêm Cửa hàng"}
              </button>
              <button
                type="button"
                onClick={handleResetForm}
                className="flex-1 btn btn-outline"
              >
                <i className="fa-solid fa-xmark mr-2"></i>
                Hủy bỏ
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.length === 0 ? (
          <div className="col-span-full bg-white rounded-lg shadow p-12 text-center border">
            <i className="fa-solid fa-store-slash text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500">Chưa có cửa hàng nào</p>
          </div>
        ) : (
          stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-lg shadow overflow-hidden border hover:shadow-lg transition"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={store.image || "https://via.placeholder.com/400x300"}
                  alt={store.name}
                  className="w-full h-full object-cover"
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
                  {store.phones.join(", ")}
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
                    onClick={() => handleEditStore(store)}
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
