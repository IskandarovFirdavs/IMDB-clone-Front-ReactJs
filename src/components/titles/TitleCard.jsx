"use client"

import { Link } from "react-router-dom"
import { Star } from "react-feather"
import { useState } from "react"

const TitleCard = ({ title }) => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Link to={`/title/${title.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 title-card-hover">
        <div className="relative aspect-[2/3] bg-gray-200">
          {!imageError && title.poster ? (
            <img
              src={title.poster || "/placeholder.svg"}
              alt={title.primary_title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
              <span className="text-sm">No Image</span>
            </div>
          )}
          {title.average_rating && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-md flex items-center text-sm">
              <Star size={14} className="text-yellow-400 mr-1" />
              <span>{title.average_rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 truncate">{title.primary_title}</h3>
          <p className="text-sm text-gray-500">{title.start_year}</p>
        </div>
      </div>
    </Link>
  )
}

export default TitleCard
