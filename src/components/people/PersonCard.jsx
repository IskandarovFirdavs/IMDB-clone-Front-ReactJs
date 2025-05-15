"use client"

import { Link } from "react-router-dom"
import { useState } from "react"

const PersonCard = ({ person }) => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <Link to={`/person/${person.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 title-card-hover">
        <div className="relative aspect-[2/3] bg-gray-200">
          {!imageError && person.photo ? (
            <img
              src={person.photo || "/placeholder.svg"}
              alt={person.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
              <span className="text-sm">No Image</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 truncate">{person.name}</h3>
          {person.birth_year && (
            <p className="text-sm text-gray-500">
              {person.birth_year}
              {person.death_year ? ` - ${person.death_year}` : ""}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export default PersonCard
