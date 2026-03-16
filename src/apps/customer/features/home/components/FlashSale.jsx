import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import productService from "@/domains/product/services/productService";

function FlashSale() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
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

  const loadFlashSaleProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getFlashSaleProducts();
      setProducts(data.slice(0, 6));
    } catch (err) {
      console.error("Error loading flash sale products:", err);
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

      <div className="grid grid-cols-6 gap-4">
        {loading ? (
          Array(6)
            .fill(0)
            .map((_, i) => <ProductCard key={i} product={null} />)
        ) : products.length === 0 ? (
          <div className="col-span-6 text-center py-12 text-gray-500">
            No flash sale products available
          </div>
        ) : (
          products.map((product) => (
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
