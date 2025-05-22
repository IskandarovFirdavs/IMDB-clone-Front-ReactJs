"use client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Film,
  Star,
  TrendingUp,
  BookOpen,
  Coffee,
} from "react-feather";
import TitleList from "../components/titles/TitleList";
import NewsCard from "../components/news/NewsCard";
import ReviewCard from "../components/reviews/ReviewCard";
import { titleService, newsService } from "../services/api";
import { reviewService } from "../services/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const HomePage = () => {
  const [trendingTitles, setTrendingTitles] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sliderSettings = {
    centerMode: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerPadding: "60px",
    dots: true,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
        },
      },
    ],
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // Fetch trending titles
        const trendingResponse = await titleService.getTrending();
        setTrendingTitles(trendingResponse.data.results || []);

        // Fetch latest news
        const newsResponse = await newsService.getLatest();
        setLatestNews(newsResponse.data.results || []);

        // Fetch recent reviews (assuming this endpoint exists)
        const reviewsResponse = await reviewService.getRecent();
        setRecentReviews(reviewsResponse.data.results.slice(0, 3));
      } catch (err) {
        console.error("Error fetching home data:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

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

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="relative mb-8 overflow-hidden rounded-xl h-[500px]">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-blue-900 to-transparent"></div>
        <div className="absolute inset-0 z-0 bg-black opacity-40"></div>

        {/* Slider Kinolar */}
        <div className="relative z-0 h-full px-8 pt-8">
          <Slider
            centerMode={true}
            centerPadding="60px"
            slidesToShow={3}
            infinite={true}
            speed={500}
            arrows={false}
            responsive={[
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 1,
                  centerPadding: "40px",
                },
              },
            ]}
          >
            {trendingTitles.slice(0, 5).map((title) => (
              <div key={title.id} className="px-2">
                <img
                  src={title.poster || title.image_url || "/placeholder.svg"}
                  alt={title.name || title.title}
                  className="object-cover w-64 h-[400px] rounded-lg shadow-lg mx-auto"
                />
              </div>
            ))}
          </Slider>
        </div>

        {/* Hero Matn */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center max-w-xl p-8 md:p-16">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Discover and Track Your Favorite Movies & TV Shows
          </h1>
          <p className="max-w-2xl mb-6 text-xl text-white">
            Your personal movie and TV database. Rate, review, and build your
            watchlist.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/search"
              className="bg-[#f5c518] hover:bg-yellow-500 text-gray-900 font-bold py-3 px-6 rounded-md inline-flex items-center"
            >
              <Film className="mr-2" />
              Browse Titles
            </Link>
            <Link
              to="/watchlist"
              className="inline-flex items-center px-6 py-3 font-bold text-gray-900 bg-white rounded-md hover:bg-gray-100"
            >
              <BookOpen className="mr-2" />
              Start Your Watchlist
            </Link>
          </div>
        </div>
      </div>
      {/* Trending Titles */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <TrendingUp className="text-[#f5c518] mr-2" />
            <h2 className="text-2xl font-bold">Trending Titles</h2>
          </div>
          <Link
            to="/search?sort=trending"
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <TitleList titles={trendingTitles} />
      </div>
      {/* Latest News and Reviews */}
      <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest News</h2>
            <Link
              to="/news"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {latestNews.map((news) => (
              <NewsCard key={news.id} news={news} />
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Star className="text-[#f5c518] mr-2" />
              <h2 className="text-2xl font-bold">Recent Reviews</h2>
            </div>
            <Link
              to="/search?filter=reviews"
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              More <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-4">
            {recentReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Explore by Category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Link
            to="/search?type=MOVIE"
            className="flex flex-col items-center justify-center p-6 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
          >
            <Film size={32} className="mb-3 text-blue-600" />
            <span className="text-lg font-medium">Movies</span>
          </Link>
          <Link
            to="/search?type=TV_SERIES"
            className="flex flex-col items-center justify-center p-6 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mb-3 text-purple-600"
            >
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
              <polyline points="17 2 12 7 7 2"></polyline>
            </svg>
            <span className="text-lg font-medium">TV Series</span>
          </Link>
          <Link
            to="/search?sort=top_rated"
            className="flex flex-col items-center justify-center p-6 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
          >
            <Star size={32} className="mb-3 text-yellow-500" />
            <span className="text-lg font-medium">Top Rated</span>
          </Link>
          <Link
            to="/search?filter=upcoming"
            className="flex flex-col items-center justify-center p-6 transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
          >
            <Coffee size={32} className="mb-3 text-green-600" />
            <span className="text-lg font-medium">Coming Soon</span>
          </Link>
        </div>
      </div>
      {/* Call to Action */}
      <div className="p-8 text-white bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold">Join Our Community Today</h2>
          <p className="mb-6 text-lg">
            Create an account to rate movies, build your watchlist, and join
            discussions with other movie enthusiasts.
          </p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 font-bold text-blue-700 bg-white rounded-md hover:bg-gray-100"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
