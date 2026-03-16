import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import newsService from "@/domains/new/services/newsService";
import NewsCard from "@/apps/customer/features/new/components/NewsCard";

function NewsSection() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNews();
    }, []);

    const loadNews = async () => {
        try {
            const latestNews = await newsService.getLatestNews(4);
            setNews(latestNews);
        } catch (error) {
            console.error("Error loading news:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-black">
                    TIN TỨC
                </h2>
                <Link 
                    to="/news" 
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                    Xem thêm
                    <i className="fa-solid fa-arrow-right"></i>
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow p-4">
                            <div className="bg-gray-200 h-48 rounded mb-3 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {news.map((item) => (
                        <NewsCard key={item.id} news={item} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default NewsSection;