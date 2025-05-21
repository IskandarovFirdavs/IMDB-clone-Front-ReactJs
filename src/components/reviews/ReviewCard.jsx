"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, User, Flag, ThumbsUp } from "react-feather";

const ReviewCard = ({ review }) => {
  const [expanded, setExpanded] = useState(false);
  const [reported, setReported] = useState(false);
  const [liked, setLiked] = useState(false);

  // Safely access user data with fallbacks
  const username = review?.user?.username || "Anonymous";
  const profilePicture = review?.user?.profile_picture || null;
  const userId = review?.user?.id;

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const reportReview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setReported(true);
  };

  const likeReview = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <div className="p-4 mb-4 bg-white rounded-lg shadow-md">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gray-200 rounded-full">
            {profilePicture ? (
              <img
                src={profilePicture || "/placeholder.svg"}
                alt={username}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <User size={20} className="text-gray-500" />
            )}
          </div>
          <div>
            {userId ? (
              <Link
                to={`/user/${userId}`}
                className="font-medium text-gray-900 hover:underline"
              >
                {username}
              </Link>
            ) : (
              <span className="font-medium text-gray-900">{username}</span>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <div className="flex items-center mr-2">
                <Star size={14} className="mr-1 text-yellow-400" />
                <span>{review?.rating || "N/A"}/10</span>
              </div>
              <span>
                {review?.created_at
                  ? new Date(review.created_at).toLocaleDateString()
                  : "Unknown date"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={likeReview}
            className={`text-sm flex items-center ${
              liked ? "text-blue-500" : "text-gray-500"
            } hover:text-blue-500`}
          >
            <ThumbsUp size={14} className="mr-1" />
            <span>Like</span>
          </button>
          <button
            onClick={reportReview}
            className={`text-sm flex items-center ${
              reported ? "text-red-500" : "text-gray-500"
            } hover:text-red-500`}
            disabled={reported}
          >
            <Flag size={14} className="mr-1" />
            <span>{reported ? "Reported" : "Report"}</span>
          </button>
        </div>
      </div>

      {review?.contains_spoilers && (
        <div className="bg-yellow-50 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded mb-2 inline-block">
          Contains Spoilers
        </div>
      )}

      <div className={expanded ? "" : "line-clamp-3"}>
        <p className="text-gray-700">{review?.content || "No content"}</p>
      </div>

      {review?.content && review.content.length > 150 && (
        <button
          onClick={toggleExpanded}
          className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default ReviewCard;
