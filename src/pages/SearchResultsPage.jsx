"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Search, Filter, X } from "react-feather";
import { searchService } from "../services/api";
import TitleList from "../components/titles/TitleList";

const SearchResultsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get("q") || "";
  const initialType = queryParams.get("type") || "all";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState(initialType);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const typeOptions = [
    { value: "all", label: "All" },
    { value: "MOVIE", label: "Movies" },
    { value: "TV_SERIES", label: "TV Series" },
    { value: "TV_EPISODE", label: "TV Episodes" },
    { value: "VIDEO_GAME", label: "Video Games" },
  ];

  useEffect(() => {
    if (initialQuery) {
      performSearch();
    }
  }, [initialQuery, initialType]);

  const performSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);

      const params = {
        query: searchQuery,
        type: searchType !== "all" ? searchType : undefined,
      };

      const response = await searchService.search(params.query, params.type);
      setResults(response.data.results || []);
    } catch (err) {
      console.error("Search error:", err);
      setError("Failed to perform search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateQueryParams();
    performSearch();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setResults([]);
  };

  const updateQueryParams = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (searchType !== "all") params.set("type", searchType);

    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );
  };

  const totalResults = results.length;

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="mb-8">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies, TV shows..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search
                className="absolute text-gray-400 transform -translate-y-1/2 left-3 top-1/2"
                size={18}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-6 py-3 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 md:w-auto"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-4 py-3 text-gray-800 bg-gray-200 rounded-md md:hidden hover:bg-gray-300"
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
          </div>

          <div className={`mt-4 ${showFilters ? "block" : "hidden md:block"}`}>
            <div className="flex flex-col gap-4 p-4 rounded-md md:flex-row bg-gray-50">
              <div className="md:w-1/2">
                <label className="block mb-1 text-sm font-medium text-gray-700">
                  Type
                </label>
                <select
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value);
                    updateQueryParams();
                    performSearch();
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="p-4 rounded-md bg-red-50">
          <p className="text-red-700">{error}</p>
        </div>
      ) : searchQuery && totalResults === 0 ? (
        <div className="py-12 text-center">
          <h2 className="mb-2 text-2xl font-bold text-gray-700">
            No results found
          </h2>
          <p className="text-gray-500">
            We couldn't find any matches for "{searchQuery}"
          </p>
        </div>
      ) : (
        <div>
          {searchQuery && (
            <div className="mb-6">
              <h1 className="text-2xl font-bold">
                Search results for "{searchQuery}" ({totalResults})
              </h1>
            </div>
          )}

          {results.length > 0 && (
            <div className="mb-10">
              <TitleList titles={results} title="Titles" />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
