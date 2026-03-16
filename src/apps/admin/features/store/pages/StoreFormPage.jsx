import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import storeService from "@/domains/store/services/storeService";

function StoreFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
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
    if (isEditMode) {
      loadStore();
    }
  }, [id]);

  const loadStore = async () => {
    try {
      setLoading(true);
      const data = await storeService.getStoreById(id);
      setFormData({
        name: data.name || "",
        address: data.address || "",
        phones: data.phones && data.phones.length > 0 ? data.phones : [""],
        email: data.email || "",
        hours: data.hours || "",
        latitude: data.latitude || 0,
        longitude: data.longitude || 0,
        featured: data.featured || false,
        description: data.description || "",
        image: data.image || "",
      });
    } catch (err) {
      console.error("Error loading store:", err);
      alert("Không thể tải thông tin cửa hàng!");
      navigate("/admin/stores");
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? parseFloat(value) || 0
            : value,
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên cửa hàng!");
      return;
    }

    if (!formData.email.trim()) {
      alert("Vui lòng nhập email!");
      return;
    }

    if (!formData.address.trim()) {
      alert("Vui lòng nhập địa chỉ!");
      return;
    }

    try {
      setSaving(true);
      // Filter out empty phones
      const phonesToSave = formData.phones.filter((phone) => phone.trim() !== "");
      
      const storeData = {
        ...formData,
        phones: phonesToSave.length > 0 ? phonesToSave : [""],
      };

      if (isEditMode) {
        await storeService.updateStore(id, storeData);
        alert("Cửa hàng đã được cập nhật thành công!");
      } else {
        await storeService.createStore(storeData);
        alert("Thêm cửa hàng thành công!");
      }
      navigate("/admin/stores");
    } catch (err) {
      console.error("Error saving store:", err);
      alert(
        "Không thể lưu cửa hàng: " +
          (err.response?.data?.message || err.message || "Lỗi không xác định")
      );
    } finally {
      setSaving(false);
    }
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

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/admin/stores")}
          className="text-gray-600 hover:text-gray-900 mb-4 inline-flex items-center"
        >
          <i className="fa-solid fa-arrow-left mr-2"></i>
          Quay lại danh sách
        </button>
        <h1 className="text-3xl font-bold">
          {isEditMode ? "Chỉnh sửa Cửa hàng" : "Thêm Cửa hàng Mới"}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode
            ? "Cập nhật thông tin cửa hàng"
            : "Điền thông tin để tạo cửa hàng mới"}
        </p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-lg p-6 border">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Tên Cửa hàng <span className="text-red-500">*</span>
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
                Email <span className="text-red-500">*</span>
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
                Địa chỉ <span className="text-red-500">*</span>
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
                Giờ mở cửa <span className="text-red-500">*</span>
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
                      className="px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
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
              <label className="block text-sm font-semibold mb-2">Mô tả</label>
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
                URL Hình ảnh
              </label>
              <input
                type="url"
                name="image"
                value={formData.image}
                onChange={handleFormChange}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
                placeholder="https://example.com/image.jpg"
              />
              {formData.image && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">Xem trước:</p>
                  <div className="w-64 h-48 border rounded-md overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300";
                      }}
                    />
                  </div>
                </div>
              )}
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
            <button
              type="submit"
              disabled={saving}
              className="flex-1 btn btn-primary disabled:opacity-50"
            >
              {saving ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                  Đang lưu...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check mr-2"></i>
                  {isEditMode ? "Cập nhật Cửa hàng" : "Tạo Cửa hàng"}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/stores")}
              className="flex-1 btn btn-outline"
            >
              <i className="fa-solid fa-xmark mr-2"></i>
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StoreFormPage;
