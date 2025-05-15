"use client"

import { useState, useEffect } from "react"
import { Bookmark, Check, AlertCircle } from "react-feather"
import { watchlistService } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const WatchlistButton = ({ titleId }) => {
  const [inWatchlist, setInWatchlist] = useState(false)
  const [watchlistId, setWatchlistId] = useState(null)
  const [status, setStatus] = useState("PLAN_TO_WATCH")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)

  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const statusOptions = [
    { value: "PLAN_TO_WATCH", label: "Plan to Watch" },
    { value: "WATCHING", label: "Watching" },
    { value: "COMPLETED", label: "Completed" },
    { value: "DROPPED", label: "Dropped" },
  ]

  useEffect(() => {
    if (currentUser) {
      checkWatchlistStatus()
    } else {
      setIsLoading(false)
    }
  }, [currentUser, titleId])

  const checkWatchlistStatus = async () => {
    try {
      setIsLoading(true)
      const response = await watchlistService.getAll()
      const watchlistItem = response.data.find((item) => item.title.id === titleId)

      if (watchlistItem) {
        setInWatchlist(true)
        setWatchlistId(watchlistItem.id)
        setStatus(watchlistItem.status)
      } else {
        setInWatchlist(false)
        setWatchlistId(null)
      }
    } catch (err) {
      console.error("Failed to check watchlist status:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const addToWatchlist = async () => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/title/${titleId}` } })
      return
    }

    try {
      setIsLoading(true)
      setError("")
      const response = await watchlistService.addTitle(titleId, status)
      setInWatchlist(true)
      setWatchlistId(response.data.id)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to add to watchlist")
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromWatchlist = async () => {
    try {
      setIsLoading(true)
      setError("")
      await watchlistService.removeTitle(watchlistId)
      setInWatchlist(false)
      setWatchlistId(null)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to remove from watchlist")
    } finally {
      setIsLoading(false)
    }
  }

  const updateWatchlistStatus = async (newStatus) => {
    try {
      setIsLoading(true)
      setError("")
      await watchlistService.updateStatus(watchlistId, newStatus)
      setStatus(newStatus)
      setShowDropdown(false)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to update status")
    } finally {
      setIsLoading(false)
    }
  }

  const toggleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist()
    } else {
      addToWatchlist()
    }
  }

  const handleStatusClick = (e) => {
    e.stopPropagation()
    if (currentUser) {
      setShowDropdown(!showDropdown)
    } else {
      navigate("/login", { state: { from: `/title/${titleId}` } })
    }
  }

  const currentStatusLabel = statusOptions.find((option) => option.value === status)?.label

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleWatchlist}
          disabled={isLoading}
          className={`flex items-center px-4 py-2 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            inWatchlist
              ? "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500"
              : "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
          } disabled:opacity-50`}
        >
          {isLoading ? (
            <span>Loading...</span>
          ) : inWatchlist ? (
            <>
              <Check size={18} className="mr-1" />
              <span>In Watchlist</span>
            </>
          ) : (
            <>
              <Bookmark size={18} className="mr-1" />
              <span>Add to Watchlist</span>
            </>
          )}
        </button>

        {inWatchlist && (
          <button
            onClick={handleStatusClick}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {currentStatusLabel}
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => updateWatchlistStatus(option.value)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  status === option.value ? "bg-gray-100 text-gray-900 font-medium" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center text-sm text-red-600">
          <AlertCircle size={16} className="mr-1" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}

export default WatchlistButton
