"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { ThumbsUp, Flag } from "react-feather"

const TriviaCard = ({ trivia }) => {
  const [expanded, setExpanded] = useState(false)
  const [reported, setReported] = useState(false)
  const [liked, setLiked] = useState(false)

  const toggleExpanded = () => {
    setExpanded(!expanded)
  }

  const reportTrivia = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setReported(true)
  }

  const likeTrivia = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setLiked(!liked)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <div className={expanded ? "" : "line-clamp-3"}>
        <p className="text-gray-700">{trivia.content}</p>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div>
          {trivia.content.length > 150 && (
            <button onClick={toggleExpanded} className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        <div className="flex space-x-4">
          {trivia.title && (
            <Link
              to={`/title/${trivia.title.id}`}
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              {trivia.title.primary_title}
            </Link>
          )}

          {trivia.person && (
            <Link
              to={`/person/${trivia.person.id}`}
              className="text-sm text-gray-600 hover:text-gray-900"
              onClick={(e) => e.stopPropagation()}
            >
              {trivia.person.name}
            </Link>
          )}

          <button
            onClick={likeTrivia}
            className={`text-sm flex items-center ${liked ? "text-blue-500" : "text-gray-500"} hover:text-blue-500`}
          >
            <ThumbsUp size={14} className="mr-1" />
            <span>Like</span>
          </button>

          <button
            onClick={reportTrivia}
            className={`text-sm flex items-center ${reported ? "text-red-500" : "text-gray-500"} hover:text-red-500`}
            disabled={reported}
          >
            <Flag size={14} className="mr-1" />
            <span>{reported ? "Reported" : "Report"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default TriviaCard
