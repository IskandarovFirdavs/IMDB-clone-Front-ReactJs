"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film, AlertCircle } from "react-feather";
import { watchlistService } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

const WatchlistPage = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeStatus, setActiveStatus] = useState("all");

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const statusOptions = [
    { value: "all", label: "All" },
    { value: "PLAN_TO_WATCH", label: "Plan to Watch" },
    { value: "WATCHING", label: "Watching" },
    { value: "COMPLETED", label: "Completed" },
    { value: "DROPPED", label: "Dropped" },
  ];

  useEffect(() => {
    if (!currentUser) {
      navigate("/login", { state: { from: "/watchlist" } });
      return;
    }

    fetchWatchlist();
  }, [currentUser, navigate]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await watchlistService.getAll();
      setWatchlist(
        Array.isArray(response.data)
          ? response.data
          : response.data.results || []
      );
    } catch (err) {
      console.error("Error fetching watchlist:", err);
      setError("Failed to load watchlist. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const updateWatchlistStatus = async (id, status) => {
    try {
      await watchlistService.updateStatus(id, status);
      // Update local state
      setWatchlist((prevWatchlist) =>
        prevWatchlist.map((item) =>
          item.id === id ? { ...item, status } : item
        )
      );
    } catch (err) {
      console.error("Error updating watchlist status:", err);
    }
  };

  const removeFromWatchlist = async (id) => {
    try {
      await watchlistService.removeTitle(id);
      // Update local state
      setWatchlist((prevWatchlist) =>
        prevWatchlist.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error("Error removing from watchlist:", err);
    }
  };

  const filteredWatchlist =
    activeStatus === "all"
      ? watchlist
      : watchlist.filter((item) => item.status === activeStatus);

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
              <AlertCircle className="w-5 h-5 text-red-400" />
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
      <h1 className="mb-6 text-3xl font-bold">My Watchlist</h1>

      {/* Status Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setActiveStatus(option.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeStatus === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`}
            >
              {option.label}
              {option.value === "all" ? (
                <span className="ml-2 bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full">
                  {watchlist.length}
                </span>
              ) : (
                <span className="ml-2 bg-gray-700 text-white text-xs px-2 py-0.5 rounded-full">
                  {
                    watchlist.filter((item) => item.status === option.value)
                      .length
                  }
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {filteredWatchlist.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredWatchlist.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden bg-white rounded-lg shadow-md"
            >
              <div className="relative">
                <Link to={`/title/${item.title.id}`}>
                  <div className="aspect-[2/3] bg-gray-200">
                    {item.title.poster ? (
                      <img
                        src={item.title.poster || "/placeholder.svg"}
                        alt={item.title.primary_title}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-300">
                        <Film size={32} />
                      </div>
                    )}
                  </div>
                </Link>
                <div className="absolute top-2 right-2">
                  <div
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : item.status === "WATCHING"
                        ? "bg-blue-100 text-blue-800"
                        : item.status === "PLAN_TO_WATCH"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {
                      statusOptions.find(
                        (option) => option.value === item.status
                      )?.label
                    }
                  </div>
                </div>
              </div>
              <div className="p-4">
                <Link to={`/title/${item.title.id}`} className="block">
                  <h3 className="mb-1 font-medium text-gray-900 hover:text-blue-600">
                    {item.title.primary_title}
                  </h3>
                  <p className="mb-3 text-sm text-gray-500">
                    {item.title?.start_year || "N/A"} •{" "}
                    {(item.title?.title_type || "").replace("_", " ")}
                  </p>
                </Link>

                <div className="flex flex-col space-y-2">
                  <select
                    value={item.status}
                    onChange={(e) =>
                      updateWatchlistStatus(item.id, e.target.value)
                    }
                    className="block w-full text-sm border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    {statusOptions
                      .filter((option) => option.value !== "all")
                      .map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                  </select>

                  <button
                    onClick={() => removeFromWatchlist(item.id)}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    Remove from watchlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-lg shadow-md">
          <Film size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="mb-2 text-xl font-medium text-gray-900">
            Your watchlist is empty
          </h3>
          <p className="mb-6 text-gray-500">
            {activeStatus === "all"
              ? "You haven't added any titles to your watchlist yet."
              : `You don't have any titles with the "${
                  statusOptions.find((option) => option.value === activeStatus)
                    ?.label
                }" status.`}
          </p>
          {activeStatus !== "all" ? (
            <button
              onClick={() => setActiveStatus("all")}
              className="px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              View all titles
            </button>
          ) : (
            <Link
              to="/"
              className="inline-block px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Browse titles
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
