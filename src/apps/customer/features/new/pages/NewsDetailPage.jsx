import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import newsService from "@/domains/new/services/newsService";
import NewsCard from "@/apps/customer/features/new/components/NewsCard";

function NewsDetailPage() {
    const { slug } = useParams();
    const [news, setNews] = useState(null);
    const [relatedNews, setRelatedNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState("");

    useEffect(() => {
        loadNews();
    }, [slug]);

    // Extract table of contents from content
    const tableOfContents = useMemo(() => {
        if (!news?.content) return [];

        const lines = news.content.split('\n');
        const toc = [];

        lines.forEach((line, index) => {
            // Match lines that start with **number. Text**
            const match = line.match(/^\*\*(\d+)\.\s*(.+?)\*\*$/);
            if (match) {
                const [, number, title] = match;
                const id = `section-${number}`;
                toc.push({ id, number, title: title.trim() });
            }
        });

        return toc;
    }, [news?.content]);

    // Scroll to section handler
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Header offset
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
            setActiveSection(id);
        }
    };

    // Track scroll position for active section
    useEffect(() => {
        const handleScroll = () => {
            const sections = tableOfContents.map(item => ({
                id: item.id,
                element: document.getElementById(item.id)
            }));

            const scrollPosition = window.scrollY + 100;

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section.element && section.element.offsetTop <= scrollPosition) {
                    setActiveSection(section.id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [tableOfContents]);

    const loadNews = async () => {
        try {
            setLoading(true);
            setError(null);

            const newsData = await newsService.getNewsBySlug(slug);
            setNews(newsData);

            const related = await newsService.getRelatedNews(newsData.id, 3);
            setRelatedNews(related);
        } catch (err) {
            setError(err.message);
            console.error("Error loading news:", err);
        } finally {
            setLoading(false);
        }
    };

    // Format date to Vietnamese format
    const formatDate = (date) => {
        const d = new Date(date);
        const day = d.getDate();
        const monthNames = [
            "Tháng 1",
            "Tháng 2",
            "Tháng 3",
            "Tháng 4",
            "Tháng 5",
            "Tháng 6",
            "Tháng 7",
            "Tháng 8",
            "Tháng 9",
            "Tháng 10",
            "Tháng 11",
            "Tháng 12",
        ];
        const month = monthNames[d.getMonth()];
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Render content with anchor IDs for sections
    const renderContent = (content) => {
        if (!content) return null;

        const lines = content.split('\n');
        const elements = [];
        let currentParagraph = [];

        lines.forEach((line, index) => {
            // Check if line is a heading
            const headingMatch = line.match(/^\*\*(\d+)\.\s*(.+?)\*\*$/);

            if (headingMatch) {
                // Flush current paragraph
                if (currentParagraph.length > 0) {
                    elements.push(
                        <p key={`p-${index}`} className="mb-4">
                            {currentParagraph.join('\n')}
                        </p>
                    );
                    currentParagraph = [];
                }

                // Add heading with anchor
                const [, number, title] = headingMatch;
                const id = `section-${number}`;
                elements.push(
                    <h2
                        key={id}
                        id={id}
                        className="text-xl font-bold mt-6 mb-3 text-gray-900 scroll-mt-20"
                    >
                        {number}. {title.trim()}
                    </h2>
                );
            } else if (line.trim() === '') {
                // Empty line - flush paragraph
                if (currentParagraph.length > 0) {
                    elements.push(
                        <p key={`p-${index}`} className="mb-4">
                            {currentParagraph.join('\n')}
                        </p>
                    );
                    currentParagraph = [];
                }
            } else {
                // Add to current paragraph
                currentParagraph.push(line);
            }
        });

        // Flush remaining paragraph
        if (currentParagraph.length > 0) {
            elements.push(
                <p key={`p-final`} className="mb-4">
                    {currentParagraph.join('\n')}
                </p>
            );
        }

        return elements;
    };

    if (loading) {
        return <div className="py-20 text-center">Loading...</div>;
    }

    if (error || !news) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error || "Tin tức không tìm thấy"}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-gray-600">
                <Link to="/" className="hover:text-blue-600">
                    Trang chủ
                </Link>
                <span className="mx-2">/</span>
                <Link to="/news" className="hover:text-blue-600">
                    Tin tức
                </Link>
                <span className="mx-2">/</span>
                <span className="text-gray-900">{news.title}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    {/* Date Tag */}
                    <div className="inline-block bg-red-500 text-white px-4 py-2 mb-4">
                        <div className="text-sm font-semibold">
                            {formatDate(news.publishedDate)}
                        </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl font-bold mb-4 text-gray-900">{news.title}</h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                        <span>Tác giả: {news.author}</span>
                        <span>•</span>
                        <span>Danh mục: {news.category}</span>
                        {news.views && (
                            <>
                                <span>•</span>
                                <span>{news.views} lượt xem</span>
                            </>
                        )}
                    </div>

                    {/* Featured Image */}
                    <div className="mb-6">
                        <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-auto rounded-lg"
                        />
                    </div>

                    {/* Table of Contents */}
                    {tableOfContents.length > 0 && (
                        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-8 rounded-r">
                            <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center">
                                <i className="fa-solid fa-list mr-2"></i>
                                Mục lục
                            </h3>
                            <ul className="space-y-2">
                                {tableOfContents.map((item) => (
                                    <li key={item.id}>
                                        <button
                                            onClick={() => scrollToSection(item.id)}
                                            className={`text-left hover:text-blue-600 transition ${activeSection === item.id
                                                ? 'text-blue-600 font-semibold'
                                                : 'text-gray-700'
                                                }`}
                                        >
                                            {item.number}. {item.title}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose max-w-none mb-8">
                        <div className="text-gray-700 leading-relaxed">
                            {renderContent(news.content)}
                        </div>
                    </div>

                    {/* Share Buttons */}
                    <div className="border-t pt-6 mb-8">
                        <p className="text-sm text-gray-600 mb-2">Chia sẻ bài viết:</p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Facebook
                            </button>
                            <button className="px-4 py-2 bg-blue-400 text-white rounded hover:bg-blue-500">
                                Twitter
                            </button>
                            <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                                Email
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    {/* Sticky Table of Contents for Desktop */}
                    {tableOfContents.length > 0 && (
                        <div className="hidden lg:block sticky top-20 mb-8">
                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                                <h3 className="text-lg font-bold mb-3 text-gray-900 flex items-center">
                                    <i className="fa-solid fa-list mr-2"></i>
                                    Mục lục
                                </h3>
                                <ul className="space-y-2">
                                    {tableOfContents.map((item) => (
                                        <li key={item.id}>
                                            <button
                                                onClick={() => scrollToSection(item.id)}
                                                className={`text-left text-sm hover:text-blue-600 transition w-full ${activeSection === item.id
                                                    ? 'text-blue-600 font-semibold'
                                                    : 'text-gray-700'
                                                    }`}
                                            >
                                                {item.number}. {item.title}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* Related News */}
                    {relatedNews.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-4">Tin tức liên quan</h2>
                            <div className="space-y-4">
                                {relatedNews.map((item) => (
                                    <NewsCard key={item.id} news={item} />
                                ))}
                            </div>
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}

export default NewsDetailPage;
