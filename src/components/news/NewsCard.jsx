import { Link } from "react-router-dom";

const NewsCard = ({ news, compact = false }) => {
  const truncateContent = (content, maxLength) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <Link to={`/news/${news.id}`} className="block">
      <div
        className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 ${
          compact ? "" : "h-full flex flex-col"
        }`}
      >
        {!compact && (
          <div className="h-48 bg-gray-200">
            {news.image ? (
              <img
                src={news.image || "/placeholder.svg"}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                <span>No Image</span>
              </div>
            )}
          </div>
        )}
        <div className={`p-4 ${compact ? "" : "flex-grow"}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500">
              {new Date(news.published_at).toLocaleDateString()}
            </span>
            {news.related_title && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Movie
              </span>
            )}
            {news.related_person && (
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                Person
              </span>
            )}
          </div>
          <h3
            className={`font-semibold text-gray-900 ${
              compact ? "text-sm" : "text-lg"
            } mb-2`}
          >
            {news.title}
          </h3>
          {!compact && (
            <p className="text-gray-600 text-sm mb-3">
              {truncateContent(news.content, 150)}
            </p>
          )}
          {news.author && (
            <div className="text-xs text-gray-500">
              By {news.author.username}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
