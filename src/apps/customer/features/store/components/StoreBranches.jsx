function StoreBranches({ stores, selectedStore, onSelectStore }) {
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6">
        <h3 className="text-xl font-bold text-black mb-6">Địa chỉ chi nhánh</h3>

        <div className="space-y-4">
          {stores.map((store, index) => (
            <button
              key={store.id}
              onClick={() => onSelectStore(store)}
              className={`w-full text-left rounded-lg p-4 transition ${index === 0
                ? "bg-gray-600 text-white hover:bg-gray-700"
                : selectedStore.id === store.id
                  ? "bg-blue-50 border-2 border-blue-400"
                  : "bg-gray-50 hover:bg-gray-100"
                }`}
            >
              <h4 className="font-semibold mb-2 text-sm">{store.address}</h4>

              <div className="space-y-1">
                {store.phones.map((phone, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <span className="text-lg"><i className="fa-solid fa-phone"></i></span>
                    <span
                      className={index === 0 ? "text-white" : "text-gray-700"}
                    >
                      {phone}
                    </span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StoreBranches;
