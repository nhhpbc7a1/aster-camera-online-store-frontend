import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import productService from "@/domains/product/services/productService";

function FlashSale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayProducts, setDisplayProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    loadFlashSaleProducts();
  }, []);

  useEffect(() => {
    // Countdown timer
    const interval = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59);

      const diff = endOfDay - now;
      setTimeLeft({
        hours: String(Math.floor(diff / (1000 * 60 * 60)) % 24).padStart(
          2,
          "0",
        ),
        minutes: String(Math.floor(diff / (1000 * 60)) % 60).padStart(2, "0"),
        seconds: String(Math.floor(diff / 1000) % 60).padStart(2, "0"),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Calculate number of products to display based on screen size
    const calculateProductsCount = () => {
      const width = window.innerWidth;
      let count = 6; // default for 6 columns (desktop)
      
      if (width <= 640) {
        // Mobile: 2 columns = 4 products (2 rows)
        count = 4;
      } else if (width <= 1024) {
        // Tablet: 3 columns = 6 products (2 rows)
        count = 6;
      } else if (width <= 1280) {
        // Small desktop: 4 columns = 4 products
        count = 4;
      } else {
        // Large desktop: 6 columns = 6 products
        count = 6;
      }
      
      return count;
    };

    const updateDisplayProducts = () => {
      const count = calculateProductsCount();
      setDisplayProducts(products.slice(0, count));
    };

    updateDisplayProducts();
    
    const handleResize = () => {
      updateDisplayProducts();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [products]);

  const loadFlashSaleProducts = async () => {
    try {
      setLoading(true);
      // Load more products to have enough for all breakpoints
      const data = await productService.getFlashSaleProducts();
      setProducts(data);
    } catch (err) {
      // no-op
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto bg-[#f8f8f8] rounded-xl shadow p-6 mb-10 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-black font-bold text-xl">FLASH SALE</h2>

        <div className="text-sm font-semibold text-black">
          {timeLeft.hours} : {timeLeft.minutes} : {timeLeft.seconds}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, i) => <ProductCard key={i} product={null} />)
        ) : displayProducts.length === 0 ? (
          <div className="col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-6 text-center py-12 text-gray-500">
            No flash sale products available
          </div>
        ) : (
          displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showAddButton={true}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default FlashSale;
