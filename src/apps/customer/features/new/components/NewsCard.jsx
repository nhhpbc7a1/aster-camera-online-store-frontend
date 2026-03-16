import { Link } from "react-router-dom";

function NewsCard({ news }) {
  if (!news) {
    return (
      <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition">
        <div className="bg-gray-200 h-48 mb-3 rounded animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
      </div>
    );
  }

  // Format date to Vietnamese format (e.g., "15 Th3")
  const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const monthNames = [
      "Th1",
      "Th2",
      "Th3",
      "Th4",
      "Th5",
      "Th6",
      "Th7",
      "Th8",
      "Th9",
      "Th10",
      "Th11",
      "Th12",
    ];
    const month = monthNames[d.getMonth()];
    return `${day} ${month}`;
  };

  return (
    <Link to={`/news/${news.slug || news.id}`}>
      <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition cursor-pointer relative">
        {/* Date Tag - Top Left Corner with pointer */}
        <div className="absolute top-0 left-0 bg-red-500 text-white px-3 py-1.5 z-10">
          <div className="text-sm font-semibold">{formatDate(news.publishedDate)}</div>
          {/* Small triangular pointer */}
          <div className="absolute top-full left-0 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-red-500"></div>
        </div>

        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={news.image}
            alt={news.title}
            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-base font-semibold mb-2 line-clamp-2 text-gray-900">
            {news.title}
          </h3>

          {/* Short Content */}
          <p className="text-sm text-gray-600 line-clamp-3 mb-2">
            {news.shortContent}
          </p>

          {/* More indicator */}
          <div className="text-sm text-blue-600 font-medium">
            Xem thêm...
          </div>
        </div>
      </div>
    </Link>
  );
}

export default NewsCard;
