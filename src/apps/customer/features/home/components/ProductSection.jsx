import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import productService from "@/domains/product/services/productService";

function ProductSection({ title }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayProducts, setDisplayProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    // Calculate number of products to display based on screen size
    const calculateProductsCount = () => {
      const width = window.innerWidth;
      let count = 5; // default for 5 columns (desktop)
      
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
        // Large desktop: 5 columns = 5 products
        count = 5;
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

  const loadProducts = async () => {
    try {
      setLoading(true);
      // Load more products to have enough for all breakpoints
      const data = await productService.getFeaturedProducts(6);
      setProducts(data);
    } catch (err) {
      // no-op
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

      <div className="container mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10">
          {loading ? (
            Array(10)
              .fill(0)
              .map((_, i) => <ProductCard key={i} product={null} />)
          ) : displayProducts.length === 0 ? (
            <div className="col-span-2 sm:col-span-3 lg:col-span-4 xl:col-span-5 text-center py-8 text-gray-500">
              No products available
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
    </div>
  );
}

export default ProductSection;
