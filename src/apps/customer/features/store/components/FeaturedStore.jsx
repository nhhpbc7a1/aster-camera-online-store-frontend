import { useState } from "react";

function FeaturedStore({ store, onSelectStore }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const storeImages = [
    "https://bncamera.com/wp-content/uploads/2025/03/bncamera-saigon-scaled-scaled.jpg",
    "https://bncamera.com/wp-content/uploads/2025/03/banner-bncamera-dji-scaled-scaled-1112x800.jpg",
    "https://bncamera.com/wp-content/uploads/2025/11/5-1-scaled.jpg",
    "https://bncamera.com/wp-content/uploads/2025/11/2-3-scaled.jpg",
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % storeImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + storeImages.length) % storeImages.length,
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-12">
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-black mb-8">
          Cửa hàng chính - BNCamera Cầu Giấy
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Image Carousel - 8 columns */}
          <div className="relative lg:col-span-8">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={storeImages[currentImageIndex]}
                alt="Store"
                className="w-full h-80 object-cover"
              />

              {/* Navigation buttons */}
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>

              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 transition"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              {/* Dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                {storeImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition ${
                      idx === currentImageIndex ? "bg-white w-6" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Store Info - 4 columns */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-black mb-2">ĐỊA CHỈ</h3>
              <p className="text-gray-700 mb-4">Cơ sở nút Hà Nội</p>

              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-black">
                    54 Cầu Giấy, Hà Nội
                  </p>
                  <p className="text-gray-600 text-sm">Quận Cầu Giấy, Hà Nội</p>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-semibold">
                    Giờ mở cửa:
                  </span>
                  <span className="text-gray-700">
                    8:00 AM - 9:00 PM hàng ngày
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-semibold">
                    Điện thoại:
                  </span>
                  <span className="text-gray-700">0987888222</span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-semibold">Email:</span>
                  <span className="text-gray-700">
                    store.caugiay@bncamera.com
                  </span>
                </div>

                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-semibold">Mô tả:</span>
                  <span className="text-gray-700">
                    Cửa hàng chính, phục vụ toàn bộ khu Cầu Giấy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedStore;
