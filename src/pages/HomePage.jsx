"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { ChevronRight, Film, Star, TrendingUp, BookOpen, Coffee } from "react-feather"
import TitleList from "../components/titles/TitleList"
import NewsCard from "../components/news/NewsCard"
import ReviewCard from "../components/reviews/ReviewCard"
import { titleService, newsService } from "../services/api"

const HomePage = () => {
  const [trendingTitles, setTrendingTitles] = useState([])
  const [latestNews, setLatestNews] = useState([])
  const [recentReviews, setRecentReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true)

        // Fetch trending titles
        const trendingResponse = await titleService.getTrending()
        setTrendingTitles(trendingResponse.data)

        // Fetch latest news
        const newsResponse = await newsService.getLatest()
        setLatestNews(newsResponse.data)

        // Fetch recent reviews (assuming this endpoint exists)
        const reviewsResponse = await titleService.getAll({ recent_reviews: true })
        setRecentReviews(reviewsResponse.data.slice(0, 3))
      } catch (err) {
        console.error("Error fetching home data:", err)
        setError("Failed to load content. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
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
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="relative rounded-xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>
        <img src="/placeholder.svg?height=500&width=1200" alt="Hero" className="w-full h-[500px] object-cover" />
        <div className="absolute inset-0 flex flex-col justify-center z-20 p-8 md:p-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover and Track Your Favorite Movies & TV Shows
          </h1>
          <p className="text-xl text-white mb-6 max-w-2xl">
            Your personal movie and TV database. Rate, review, and build your watchlist.
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
              className="bg-white hover:bg-gray-100 text-gray-900 font-bold py-3 px-6 rounded-md inline-flex items-center"
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
          <Link to="/search?sort=trending" className="text-blue-600 hover:text-blue-800 flex items-center">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        <TitleList titles={trendingTitles} />
      </div>

      {/* Latest News and Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Latest News</h2>
            <Link to="/news" className="text-blue-600 hover:text-blue-800 flex items-center">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            <Link to="/search?filter=reviews" className="text-blue-600 hover:text-blue-800 flex items-center">
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
        <h2 className="text-2xl font-bold mb-6">Explore by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/search?type=MOVIE"
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300"
          >
            <Film size={32} className="text-blue-600 mb-3" />
            <span className="text-lg font-medium">Movies</span>
          </Link>
          <Link
            to="/search?type=TV_SERIES"
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300"
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
              className="text-purple-600 mb-3"
            >
              <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
              <polyline points="17 2 12 7 7 2"></polyline>
            </svg>
            <span className="text-lg font-medium">TV Series</span>
          </Link>
          <Link
            to="/search?sort=top_rated"
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300"
          >
            <Star size={32} className="text-yellow-500 mb-3" />
            <span className="text-lg font-medium">Top Rated</span>
          </Link>
          <Link
            to="/search?filter=upcoming"
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center justify-center hover:shadow-lg transition-all duration-300"
          >
            <Coffee size={32} className="text-green-600 mb-3" />
            <span className="text-lg font-medium">Coming Soon</span>
          </Link>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community Today</h2>
          <p className="text-lg mb-6">
            Create an account to rate movies, build your watchlist, and join discussions with other movie enthusiasts.
          </p>
          <Link
            to="/register"
            className="bg-white text-blue-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-md inline-block"
          >
            Sign Up Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default HomePage
