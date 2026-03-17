import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import categoryService from "@/domains/category/services/categoryService";

function CategoryNavbar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoryService.getCategories();
      setCategories(data);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 border-t border-gray-300 shadow-sm max-[850px]:hidden">
      <div className="container mx-auto px-4 flex items-center text-sl font-semibold text-black py-1">
        {loading ? (
          <div>Loading categories...</div>
        ) : categories.length === 0 ? (
          <div>No categories available</div>
        ) : (
          <>
            {categories.map((category, index) => (
              <div key={category.id} className="flex items-center">
                <Link
                  to={`/category/${category.slug}`}
                  className="uppercase px-3 py-2 flex items-center gap-1 hover:text-black whitespace-nowrap transition"
                >
                  {category.name}
                  <i className="fa-solid fa-chevron-down text-xs"></i>
                </Link>

                {index !== categories.length - 1 && (
                  <span className="text-gray-400">|</span>
                )}
              </div>
            ))}

            {/* News Link */}
            <span className="text-gray-400">|</span>
            {/* <Link
              to="/news"
              className="uppercase px-3 py-2 flex items-center gap-1 hover:text-black whitespace-nowrap transition"
            >
              TIN TỨC
            </Link> */}
          </>
        )}
      </div>
    </div>
  );
}

export default CategoryNavbar;
