"use client";

import { Link } from "react-router-dom";
import { Star } from "react-feather";
import { useState } from "react";

const TitleCard = ({ title }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Link to={`/title/${title.id}`} className="block">
      <div className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg title-card-hover">
        <div className="relative aspect-[2/3] bg-gray-200">
          {!imageError && title.poster ? (
            <img
              src={title.poster || "/placeholder.svg"}
              alt={title.primary_title}
              className="object-cover w-full h-full"
              onError={handleImageError}
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-300">
              <span className="text-sm">No Image</span>
            </div>
          )}
          {/* {title.average_rating && (
            <div className="absolute flex items-center px-2 py-1 text-sm text-white bg-black rounded-md bottom-2 left-2 bg-opacity-70">
              <Star size={14} className="mr-1 text-yellow-400" />
              <span>{title.average_rating.toFixed(1)}</span>
            </div>
          )} */}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-900 truncate">
            {title.primary_title}
          </h3>
          <p className="text-sm text-gray-500">{title.start_year}</p>
        </div>
      </div>
    </Link>
  );
};

export default TitleCard;
