function StoreMap({ selectedStore }) {
  if (!selectedStore) return null;

  // Use simple Google Maps embed URL with coordinates
  const mapUrl = `https://www.google.com/maps?q=${selectedStore.latitude},${selectedStore.longitude}&output=embed`;

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-6">Bản đồ cửa hàng</h3>

        <div className="rounded-lg overflow-hidden h-96 bg-gray-100">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Store Map"
          />
        </div>

        {/* Store Details */}
        <div className="mt-6 space-y-3">
          <div>
            <p className="text-gray-600 text-sm font-semibold">
              {selectedStore.name}
            </p>
            <p className="text-gray-700">{selectedStore.address}</p>
          </div>

          <div>
            <p className="font-semibold text-black">
              {selectedStore.phones[0]}
            </p>
            {selectedStore.phones[1] && (
              <p className="text-gray-600">{selectedStore.phones[1]}</p>
            )}
          </div>

          <div>
            <p className="text-gray-600 text-sm">
              <strong>Giờ mở cửa:</strong> {selectedStore.hours}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoreMap;
