"use client"

import { useState } from "react"
import { Star } from "react-feather"
import { titleService } from "../../services/api"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"

const RatingStars = ({ titleId, initialRating = 0, size = "md", onRatingSubmitted }) => {
  const [rating, setRating] = useState(initialRating)
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const { currentUser } = useAuth()
  const navigate = useNavigate()

  const starSizes = {
    sm: 16,
    md: 24,
    lg: 32,
  }

  const starSize = starSizes[size] || starSizes.md

  const handleRating = async (value) => {
    if (!currentUser) {
      navigate("/login", { state: { from: `/title/${titleId}` } })
      return
    }

    if (value === rating) {
      return
    }

    setRating(value)
    setIsSubmitting(true)
    setError("")
    setSuccess(false)

    try {
      await titleService.addRating(titleId, value)
      setSuccess(true)

      if (onRatingSubmitted) {
        onRatingSubmitted(value)
      }

      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit rating")
      setRating(initialRating)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <div className="flex items-center">
        {[...Array(10)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleRating(i + 1)}
            onMouseEnter={() => setHoverRating(i + 1)}
            onMouseLeave={() => setHoverRating(0)}
            className="focus:outline-none"
            disabled={isSubmitting}
          >
            <Star
              size={starSize}
              className={`${
                (hoverRating || rating) > i ? "text-yellow-400 fill-current" : "text-gray-300"
              } transition-colors duration-150`}
            />
          </button>
        ))}
        {(rating > 0 || hoverRating > 0) && <span className="ml-2 font-medium">{hoverRating || rating}/10</span>}
      </div>

      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}

      {success && <div className="mt-2 text-sm text-green-600">Rating submitted successfully!</div>}
    </div>
  )
}

export default RatingStars
