import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import productService from "@/domains/product/services/productService";

function ProductSection({ title }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getFeaturedProducts(5);
      setProducts(data);
    } catch (err) {
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-10">
      <h2 className="container mx-auto text-center font-bold text-black mb-10 text-xl">
        <i className="fa-solid fa-bars mr-2"></i>
        {title}
      </h2>

      <div className="grid grid-cols-5 gap-6 mt-10">
        {loading ? (
          Array(10)
            .fill(0)
            .map((_, i) => <ProductCard key={i} product={null} />)
        ) : products.length === 0 ? (
          <div className="col-span-5 text-center py-8 text-gray-500">
            No products available
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

export default ProductSection;
