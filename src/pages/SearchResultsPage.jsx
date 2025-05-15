"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Search, Filter, X } from "react-feather"
import { searchService } from "../services/api"
import TitleList from "../components/titles/TitleList"
import PersonList from "../components/people/PersonList"

const SearchResultsPage = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialQuery = queryParams.get("q") || ""
  const initialType = queryParams.get("type") || "all"
  const initialSort = queryParams.get("sort") || "relevance"

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [searchType, setSearchType] = useState(initialType)
  const [sortBy, setSortBy] = useState(initialSort)
  const [results, setResults] = useState({ titles: [], people: [] })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  const typeOptions = [
    { value: "all", label: "All" },
    { value: "title", label: "Titles" },
    { value: "person", label: "People" },
    { value: "MOVIE", label: "Movies" },
    { value: "TV_SERIES", label: "TV Series" },
    { value: "TV_EPISODE", label: "TV Episodes" },
    { value: "VIDEO_GAME", label: "Video Games" },
  ]

  const sortOptions = [
    { value: "relevance", label: "Relevance" },
    { value: "year_desc", label: "Year (Newest)" },
    { value: "year_asc", label: "Year (Oldest)" },
    { value: "rating_desc", label: "Rating (Highest)" },
    { value: "title_asc", label: "Title (A-Z)" },
  ]

  useEffect(() => {
    if (initialQuery) {
      performSearch()
    }
  }, [initialQuery, initialType, initialSort])

  const performSearch = async () => {
    if (!searchQuery.trim()) {
      return
    }

    try {
      setLoading(true)
      setError(null)

      const params = {
        query: searchQuery,
        type: searchType !== "all" ? searchType : undefined,
        sort: sortBy !== "relevance" ? sortBy : undefined,
      }

      const response = await searchService.search(params.query, params.type)
      setResults(response.data)
    } catch (err) {
      console.error("Search error:", err)
      setError("Failed to perform search. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    performSearch()
  }

  const clearSearch = () => {
    setSearchQuery("")
    setResults({ titles: [], people: [] })
  }

  const updateQueryParams = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set("q", searchQuery)
    if (searchType !== "all") params.set("type", searchType)
    if (sortBy !== "relevance") params.set("sort", sortBy)

    window.history.replaceState({}, "", `${window.location.pathname}?${params.toString()}`)
  }

  const handleFilterChange = () => {
    updateQueryParams()
    performSearch()
  }

  const totalResults = results.titles.length + results.people.length

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <form onSubmit={handleSearch}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for movies, TV shows, people..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium md:w-auto w-full"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-3 rounded-md"
            >
              <Filter size={18} className="mr-2" />
              Filters
            </button>
          </div>

          <div className={`mt-4 ${showFilters ? "block" : "hidden md:block"}`}>
            <div className="flex flex-col md:flex-row gap-4 bg-gray-50 p-4 rounded-md">
              <div className="md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value)
                    handleFilterChange()
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="md:w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    handleFilterChange()
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {sortOptions.map((option) => (
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
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
      ) : searchQuery && totalResults === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-2">No results found</h2>
          <p className="text-gray-500 mb-6">
            We couldn't find any matches for "{searchQuery}". Please try another search.
          </p>
          <div className="bg-gray-50 inline-block p-4 rounded-md">
            <p className="text-sm text-gray-600 mb-2">Suggestions:</p>
            <ul className="text-sm text-gray-600 list-disc list-inside">
              <li>Check your spelling</li>
              <li>Try more general keywords</li>
              <li>Try different keywords</li>
              <li>Try fewer keywords</li>
            </ul>
          </div>
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

          {results.titles.length > 0 && (
            <div className="mb-10">
              <TitleList titles={results.titles} title="Titles" />
            </div>
          )}

          {results.people.length > 0 && (
            <div className="mb-10">
              <PersonList people={results.people} title="People" />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchResultsPage
