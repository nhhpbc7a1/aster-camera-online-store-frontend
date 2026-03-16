import { useState, useEffect } from "react";
import { mockReviews } from "@/domains/review";

function ReviewSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setReviews(mockReviews);
  }, []);

  const goToSlide = (index) => {
    setCurrentIndex(index % reviews.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  if (reviews.length === 0) return null;

  const currentReview = reviews[currentIndex];

  return (
    <div className="bg-white rounded-xl shadow p-10 my-10">
      <h2 className="text-center text-red-600 font-semibold mb-12 text-2xl">
        Đánh giá của khách hàng
      </h2>

      <div className="max-w-5xl mx-auto my-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative">
          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 md:-translate-x-16 p-2 hover:bg-gray-200 rounded-full transition-all"
            aria-label="Previous review"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Avatar */}
          <div className="flex justify-center">
            <img
              src={currentReview.avatar}
              alt={currentReview.customerName}
              className="w-64 h-64 rounded-full object-cover shadow-lg"
            />
          </div>

          {/* Review Content */}
          <div>
            <div className="text-4xl text-gray-300 text-left">"</div>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              {currentReview.comment}
            </p>
            <div className="text-4xl text-gray-300 text-right">"</div>

            {/* Customer Info */}
            <div className="mb-8">
              <h4 className="font-semibold text-black text-lg">
                {currentReview.customerName}
              </h4>
              <p className="text-gray-500 text-sm">{currentReview.position}</p>
            </div>

            {/* Pagination Dots */}
            <div className="flex gap-2 justify-center md:justify-start">
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentIndex
                      ? "bg-gray-800 w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 md:translate-x-16 p-2 hover:bg-gray-200 rounded-full transition-all"
            aria-label="Next review"
          >
            <svg
              className="w-6 h-6 text-gray-800"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewSection;
