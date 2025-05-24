"use client";

import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "react-feather";
import { triviaService } from "../../services/api";

const TriviaCard = ({ trivia }) => {
  const triviaId = trivia.id;
  const [likes, setLikes] = useState(trivia.upvotes || 0);
  const [dislikes, setDislikes] = useState(trivia.downvotes || 0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [reported, setReported] = useState(false);
  const handleVote = async (voteType) => {
    try {
      const res = await triviaService.vote(triviaId, voteType);
      const data = res.data;
      setLikes(data.upvotes);
      setDislikes(data.downvotes);

      if (voteType === "like") {
        setLiked(true);
        setDisliked(false);
      } else {
        setLiked(false);
        setDisliked(true);
      }
    } catch (err) {
      console.error(`Failed to ${voteType} trivia:`, err);
    }
  };

  const toggleExpanded = () => setExpanded((prev) => !prev);

  const reportTrivia = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setReported(true);
    console.log("Reported trivia:", triviaId);
    // Add API call here if needed
  };

  return (
    <div className="p-4 mb-4 bg-white rounded-lg shadow-md">
      <div className={expanded ? "" : "line-clamp-3"}>
        <p className="text-gray-700">{trivia.content}</p>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div>
          {trivia.content.length > 150 && (
            <button
              onClick={toggleExpanded}
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              {expanded ? "Show less" : "Read more"}
            </button>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!liked) handleVote("like");
            }}
            className={`text-sm flex items-center ${
              liked ? "text-blue-500" : "text-gray-500"
            } hover:text-blue-500`}
          >
            <ThumbsUp size={14} className="mr-1" />
            <span>Like ({likes})</span>
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!disliked) handleVote("dislike");
            }}
            className={`text-sm flex items-center ${
              disliked ? "text-red-500" : "text-gray-500"
            } hover:text-red-500`}
          >
            <ThumbsDown size={14} className="mr-1" />
            <span>Dislike ({dislikes})</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TriviaCard;
