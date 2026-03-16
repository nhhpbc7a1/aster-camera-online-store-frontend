import { useState } from "react";
import StoreHeader from "../components/StoreHeader";
import FeaturedStore from "../components/FeaturedStore";
import StoreBranches from "../components/StoreBranches";
import StoreMap from "../components/StoreMap";
import { mockStores } from "@/domains/store/mockData/stores";

function StorePage() {
  const [selectedStore, setSelectedStore] = useState(mockStores[0]);

  return (
    <div className="bg-white max-w-[1024px] mx-auto">
      <StoreHeader />
      <div className="container mx-auto px-4">
        <FeaturedStore store={mockStores[0]} />

        {/* Main Grid: Branches and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <StoreBranches
            stores={mockStores}
            selectedStore={selectedStore}
            onSelectStore={setSelectedStore}
          />
          <StoreMap selectedStore={selectedStore} />
        </div>

      </div>
    </div>
  );
}

export default StorePage;
