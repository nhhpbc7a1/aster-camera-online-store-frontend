import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import newsService from "@/domains/new/services/newsService";
import NewsCard from "@/apps/customer/features/new/components/NewsCard";

function NewsListingPage() {
  const [searchParams] = useSearchParams();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadNews();
  }, [currentPage, searchParams]);

  const loadNews = async () => {
    try {
      setLoading(true);
      setError(null);

      const searchTerm = searchParams.get("q");
      const category = searchParams.get("category");
      
      const filters = {
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(category && { category }),
      };

      const response = await newsService.getNewsWithPagination(filters);
      setNews(response.data);
      setTotal(response.total);
      setTotalPages(Math.ceil(response.total / response.limit));
    } catch (err) {
      setError(err.message);
      console.error("Error loading news:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && news.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black mb-2">TIN TỨC</h1>
        {searchParams.get("q") && (
          <p className="text-gray-600">
            Kết quả tìm kiếm cho: "{searchParams.get("q")}"
          </p>
        )}
        {searchParams.get("category") && (
          <p className="text-gray-600">
            Danh mục: {searchParams.get("category")}
          </p>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* News Grid */}
      {news.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy tin tức nào</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <span className="px-4 py-2">
                Trang {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default NewsListingPage;
