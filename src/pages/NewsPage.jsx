"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Calendar, User, ArrowLeft } from "react-feather";
import { newsService } from "../services/api";
import NewsCard from "../components/news/NewsCard";

const NewsPage = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);

        if (id) {
          // Fetch single news article
          const newsResponse = await newsService.getById(id);
          setNews(newsResponse.data);

          // Fetch latest news for related articles
          const latestResponse = await newsService.getLatest();
          setLatestNews(
            latestResponse.data.filter(
              (item) => item.id !== Number.parseInt(id)
            )
          );
        } else {
          // Fetch all news
          const newsResponse = await newsService.getAll();
          setLatestNews(newsResponse.data);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [id]);

  if (loading) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-4 rounded-md bg-red-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Single news article view
  if (id && news) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <Link
          to="/news"
          className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to all news
        </Link>

        <article className="overflow-hidden bg-white rounded-lg shadow-md">
          {news.image && (
            <div className="bg-gray-200 h-96">
              <img
                src={news.image || "/placeholder.svg"}
                alt={news.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              {news.title}
            </h1>

            <div className="flex flex-wrap items-center mb-6 text-gray-500">
              <div className="flex items-center mb-2 mr-6">
                <Calendar size={16} className="mr-1" />
                <time dateTime={news.published_at}>
                  {new Date(news.published_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </time>
              </div>

              {news.author && (
                <div className="flex items-center mb-2">
                  <User size={16} className="mr-1" />
                  <span>By {news.author.username}</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mb-2 ml-auto">
                {news.related_title && (
                  <Link
                    to={`/title/${news.related_title.id}`}
                    className="px-3 py-1 text-sm text-blue-800 bg-blue-100 rounded-full"
                  >
                    {news.related_title.primary_title}
                  </Link>
                )}

                {news.related_person && (
                  <Link
                    to={`/person/${news.related_person.id}`}
                    className="px-3 py-1 text-sm text-purple-800 bg-purple-100 rounded-full"
                  >
                    {news.related_person.name}
                  </Link>
                )}
              </div>
            </div>

            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{news.content}</p>
            </div>
          </div>
        </article>

        {/* Related News */}
        {latestNews.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">Related News</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {latestNews.slice(0, 3).map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // News listing view
  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Latest News</h1>

      {latestNews.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {latestNews.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <h3 className="mb-2 text-xl font-medium text-gray-900">
            No news articles available
          </h3>
          <p className="text-gray-500">Check back later for updates.</p>
        </div>
      )}
    </div>
  );
};

export default NewsPage;
