import { Link } from "react-router-dom";
import { mockStores } from "@/domains/store/mockData/stores";

function StoreSection() {
  // Get first 3 stores for display
  const stores = mockStores.slice(0, 3);

  return (
    <div>
      <h2 className="text-center text-red-600 font-semibold mb-6 text-2xl">
        Hệ thống cửa hàng
      </h2>

      {/* Desktop: Grid layout */}
      <div className="hidden md:grid grid-cols-3 gap-6">
        {stores.map((store) => (
          <Link
            key={store.id}
            to="/store"
            className="group relative overflow-hidden rounded-xl h-[300px] hover:shadow-lg transition"
          >
            {/* Store Image */}
            <img
              src={store.image}
              alt={store.name}
              className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

            {/* Store Name */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h3 className="text-white text-xl font-bold text-center px-4 border-2 border-white py-2">
                {store.name.toUpperCase()}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden overflow-x-auto -mx-4 px-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <div className="flex gap-6" style={{ width: 'max-content' }}>
          {stores.map((store) => (
            <Link
              key={store.id}
              to="/store"
              className="group relative overflow-hidden rounded-xl h-[300px] w-[280px] flex-shrink-0 hover:shadow-lg transition"
            >
              {/* Store Image */}
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-full object-contain group-hover:scale-105 transition duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition" />

              {/* Store Name */}
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-white text-lg font-bold text-center px-4 border-2 border-white py-2">
                  {store.name.toUpperCase()}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StoreSection;
