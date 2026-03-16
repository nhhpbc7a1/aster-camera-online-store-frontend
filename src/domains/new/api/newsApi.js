// Mock API layer - returns mock data initially
// Later: replace with actual API calls
import { mockNews } from "@/domains/new/mockData/news";

// Simulates API delay
const apiDelay = () => new Promise((resolve) => setTimeout(resolve, 300));

const newsApi = {
  // Get all news
  getAllNews: async (filters = {}) => {
    await apiDelay();

    let news = [...mockNews];

    // Sort by published date (newest first)
    news.sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate));

    if (filters.category) {
      news = news.filter((n) => n.category === filters.category);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      news = news.filter(
        (n) =>
          n.title.toLowerCase().includes(searchLower) ||
          n.shortContent.toLowerCase().includes(searchLower) ||
          n.content.toLowerCase().includes(searchLower),
      );
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNews = news.slice(startIndex, endIndex);

    return {
      data: paginatedNews,
      total: news.length,
      page: page,
      limit: limit,
    };
  },

  // Get news by ID
  getNewsById: async (newsId) => {
    await apiDelay();

    const news = mockNews.find((n) => n.id === newsId);
    if (!news) {
      throw new Error(`News with ID ${newsId} not found`);
    }

    return { data: news };
  },

  // Get news by slug
  getNewsBySlug: async (slug) => {
    await apiDelay();

    const news = mockNews.find((n) => n.slug === slug);
    if (!news) {
      throw new Error(`News with slug ${slug} not found`);
    }

    return { data: news };
  },

  // Get related news
  getRelatedNews: async (newsId, limit = 4) => {
    await apiDelay();

    const news = mockNews.find((n) => n.id === newsId);
    if (!news) {
      throw new Error(`News with ID ${newsId} not found`);
    }

    const related = mockNews
      .filter(
        (n) =>
          n.id !== newsId &&
          (n.category === news.category ||
            n.title.toLowerCase().includes(
              news.title.split(" ").slice(0, 2).join(" ").toLowerCase(),
            )),
      )
      .slice(0, limit);

    return { data: related };
  },

  // Get latest news
  getLatestNews: async (limit = 6) => {
    await apiDelay();

    const latest = [...mockNews]
      .sort((a, b) => new Date(b.publishedDate) - new Date(a.publishedDate))
      .slice(0, limit);

    return { data: latest };
  },
};

export default newsApi;
