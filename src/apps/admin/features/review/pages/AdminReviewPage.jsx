import React, { useState, useEffect } from "react";
import reviewService from "@/domains/review/services/reviewService";

function AdminReviewPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockReviews = [
        {
          id: 1,
          customerName: "Nguyễn Trung Khánh",
          position: "Nhân viên thiết kế, Hà Nội",
          avatar:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
          rating: 5,
          comment:
            "Nhân viên bán hàng rất nhiệt tình, năm nắm kiến thức về sản phẩm và tư vấn hỏi rất tốt. Sản phẩm mình mua có giá trị cao nên mình cảm thấy rất hài lòng với cách phục vụ như vậy. Chúc shop làm ăn ngày càng phát đạt",
          productId: 1,
          productName: "Canon EOS R5",
          status: "approved",
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          customerName: "Trần Thị Hương",
          position: "Kỹ sư, TP.HCM",
          avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
          rating: 5,
          comment:
            "Dịch vụ tuyệt vời! Camera chất lượng cao, giá cả hợp lý. Nhân viên hỗ trợ nhanh chóng và chuyên nghiệp. Rất hài lòng với việc mua hàng tại đây.",
          productId: 2,
          productName: "Sony A7R V",
          status: "pending",
          createdAt: "2024-02-10T14:20:00Z",
        },
      ];
      setReviews(mockReviews);
    } catch (err) {
      console.error("Error loading reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (reviewId, newStatus) => {
    const updatedReviews = reviews.map((review) =>
      review.id === reviewId ? { ...review, status: newStatus } : review
    );
    setReviews(updatedReviews);
    alert(`Đánh giá đã được ${newStatus === "approved" ? "phê duyệt" : "từ chối"}!`);
  };

  const handleDeleteReview = (reviewId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) {
      const updatedReviews = reviews.filter((review) => review.id !== reviewId);
      setReviews(updatedReviews);
      if (selectedReview?.id === reviewId) {
        setSelectedReview(null);
      }
      alert("Đánh giá đã được xóa!");
    }
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesRating =
      filterRating === "all" || review.rating === parseInt(filterRating);
    const matchesSearch =
      review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesSearch;
  });

  const stats = {
    total: reviews.length,
    approved: reviews.filter((r) => r.status === "approved").length,
    pending: reviews.filter((r) => r.status === "pending").length,
    rejected: reviews.filter((r) => r.status === "rejected").length,
    avgRating: (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1),
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <i
            key={star}
            className={`fa-solid fa-star text-sm ${
              star <= rating ? "text-yellow-400" : "text-gray-300"
            }`}
          ></i>
        ))}
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      approved: "Đã duyệt",
      pending: "Chờ duyệt",
      rejected: "Đã từ chối",
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải đánh giá...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Đánh giá</h1>
          <p className="text-gray-600 mt-1">
            Quản lý tất cả đánh giá từ khách hàng ({reviews.length})
          </p>
        </div>
        <button onClick={loadReviews} className="btn btn-outline">
          <i className="fa-solid fa-rotate mr-2"></i>
          Làm mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-4 border">
          <div className="text-center">
            <p className="text-sm text-gray-600">Tổng đánh giá</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
          <div className="text-center">
            <p className="text-sm text-green-700">Đã duyệt</p>
            <p className="text-2xl font-bold mt-1 text-green-800">
              {stats.approved}
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg shadow p-4 border border-yellow-200">
          <div className="text-center">
            <p className="text-sm text-yellow-700">Chờ duyệt</p>
            <p className="text-2xl font-bold mt-1 text-yellow-800">
              {stats.pending}
            </p>
          </div>
        </div>

        <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
          <div className="text-center">
            <p className="text-sm text-red-700">Đã từ chối</p>
            <p className="text-2xl font-bold mt-1 text-red-800">
              {stats.rejected}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow p-4 text-white">
          <div className="text-center">
            <p className="text-sm opacity-90">Điểm TB</p>
            <p className="text-2xl font-bold mt-1">
              {stats.avgRating} <i className="fa-solid fa-star text-lg"></i>
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              <i className="fa-solid fa-search mr-2"></i>
              Tìm kiếm đánh giá
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên khách hàng, sản phẩm..."
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              <i className="fa-solid fa-star mr-2"></i>
              Lọc theo đánh giá
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="w-full border rounded-md px-3 py-2 focus:outline-none focus:border-black"
            >
              <option value="all">Tất cả đánh giá</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reviews List */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {filteredReviews.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center border">
                <i className="fa-solid fa-comment-slash text-6xl text-gray-300 mb-4"></i>
                <p className="text-gray-500">
                  {searchTerm || filterRating !== "all"
                    ? "Không tìm thấy đánh giá"
                    : "Chưa có đánh giá nào"}
                </p>
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div
                  key={review.id}
                  className={`bg-white rounded-lg shadow p-4 border cursor-pointer hover:shadow-lg transition ${
                    selectedReview?.id === review.id ? "ring-2 ring-blue-500" : ""
                  }`}
                  onClick={() => setSelectedReview(review)}
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={review.avatar}
                      alt={review.customerName}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{review.customerName}</p>
                          <p className="text-xs text-gray-500">
                            {review.position}
                          </p>
                        </div>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            review.status
                          )}`}
                        >
                          {getStatusLabel(review.status)}
                        </span>
                      </div>

                      {renderStars(review.rating)}

                      <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                        {review.comment}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <i className="fa-solid fa-box"></i>
                          <span>{review.productName}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Review Details */}
        {selectedReview ? (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4 border">
              <div className="flex justify-between items-start mb-4 pb-4 border-b">
                <h2 className="text-lg font-bold">Chi tiết Đánh giá</h2>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  <i className="fa-solid fa-xmark text-xl"></i>
                </button>
              </div>

              <div className="text-center mb-4 pb-4 border-b">
                <img
                  src={selectedReview.avatar}
                  alt={selectedReview.customerName}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-3"
                />
                <p className="font-semibold">{selectedReview.customerName}</p>
                <p className="text-sm text-gray-600">{selectedReview.position}</p>
              </div>

              <div className="mb-4 pb-4 border-b">
                <label className="block text-sm font-semibold mb-2">
                  Đánh giá
                </label>
                <div className="flex items-center gap-2">
                  {renderStars(selectedReview.rating)}
                  <span className="text-sm font-medium">
                    {selectedReview.rating}/5
                  </span>
                </div>
              </div>

              <div className="mb-4 pb-4 border-b">
                <label className="block text-sm font-semibold mb-2">
                  Sản phẩm
                </label>
                <p className="text-sm">{selectedReview.productName}</p>
                <p className="text-xs text-gray-500">ID: {selectedReview.productId}</p>
              </div>

              <div className="mb-4 pb-4 border-b">
                <label className="block text-sm font-semibold mb-2">
                  Nội dung
                </label>
                <p className="text-sm text-gray-700">{selectedReview.comment}</p>
              </div>

              <div className="mb-4 pb-4 border-b">
                <label className="block text-sm font-semibold mb-2">
                  Ngày đánh giá
                </label>
                <p className="text-sm">
                  {new Date(selectedReview.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>

              <div className="mb-4 pb-4 border-b">
                <label className="block text-sm font-semibold mb-2">
                  Trạng thái
                </label>
                <select
                  value={selectedReview.status}
                  onChange={(e) =>
                    handleStatusChange(selectedReview.id, e.target.value)
                  }
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-black"
                >
                  <option value="pending">Chờ duyệt</option>
                  <option value="approved">Đã duyệt</option>
                  <option value="rejected">Đã từ chối</option>
                </select>
              </div>

              <div className="space-y-2">
                {selectedReview.status === "pending" && (
                  <>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedReview.id, "approved")
                      }
                      className="w-full btn btn-primary text-sm"
                    >
                      <i className="fa-solid fa-check mr-2"></i>
                      Phê duyệt
                    </button>
                    <button
                      onClick={() =>
                        handleStatusChange(selectedReview.id, "rejected")
                      }
                      className="w-full btn btn-outline text-sm"
                    >
                      <i className="fa-solid fa-times mr-2"></i>
                      Từ chối
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleDeleteReview(selectedReview.id)}
                  className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md border border-red-200 transition"
                >
                  <i className="fa-solid fa-trash mr-2"></i>
                  Xóa đánh giá
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 border h-full flex items-center justify-center">
              <div className="text-center text-gray-400">
                <i className="fa-solid fa-hand-pointer text-4xl mb-2"></i>
                <p>Chọn đánh giá để xem chi tiết</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReviewPage;
