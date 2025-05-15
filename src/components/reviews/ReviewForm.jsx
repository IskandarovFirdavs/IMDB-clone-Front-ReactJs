"use client"

import { useState } from "react"
import { Star } from "react-feather"
import { titleService } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const ReviewForm = ({ titleId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [content, setContent] = useState("")
  const [containsSpoilers, setContainsSpoilers] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!currentUser) {
      navigate("/login", { state: { from: `/title/${titleId}` } })
      return
    }

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    if (content.trim().length < 10) {
      setError("Review must be at least 10 characters long")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      await titleService.addReview(titleId, {
        rating,
        content,
        contains_spoilers: containsSpoilers,
      })

      setRating(0)
      setContent("")
      setContainsSpoilers(false)

      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit review. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h3 className="text-xl font-semibold mb-4">Write a Review</h3>

      {!currentUser && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
          Please{" "}
          <button
            onClick={() => navigate("/login", { state: { from: `/title/${titleId}` } })}
            className="font-medium underline"
          >
            sign in
          </button>{" "}
          to write a review.
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Your Rating</label>
          <div className="flex items-center">
            {[...Array(10)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHoverRating(i + 1)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none"
                disabled={!currentUser}
              >
                <Star
                  size={24}
                  className={`${
                    (hoverRating || rating) > i ? "text-yellow-400 fill-current" : "text-gray-300"
                  } transition-colors duration-150`}
                />
              </button>
            ))}
            {(rating > 0 || hoverRating > 0) && (
              <span className="ml-2 text-lg font-medium">{hoverRating || rating}/10</span>
            )}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="review-content" className="block text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            id="review-content"
            rows="5"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Write your thoughts about this title..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!currentUser}
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              checked={containsSpoilers}
              onChange={(e) => setContainsSpoilers(e.target.checked)}
              disabled={!currentUser}
            />
            <span className="ml-2 text-gray-700">This review contains spoilers</span>
          </label>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          disabled={isSubmitting || !currentUser}
        >
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
