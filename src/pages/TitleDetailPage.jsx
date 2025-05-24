"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Clock, Film, User, MessageSquare } from "react-feather";
import { titleService } from "../services/api";
import RatingStars from "../components/ratings/RatingStars";
import WatchlistButton from "../components/watchlist/WatchlistButton";
import ReviewCard from "../components/reviews/ReviewCard";
import ReviewForm from "../components/reviews/ReviewForm";
import TriviaCard from "../components/trivia/TriviaCard";

const TitleDetailPage = () => {
  const { id } = useParams();
  const [title, setTitle] = useState(null);
  const [cast, setCast] = useState([]);
  const [crew, setCrew] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [trivia, setTrivia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchTitleData = async () => {
      try {
        setLoading(true);

        // Fetch title details
        const titleResponse = await titleService.getById(id);
        setTitle(titleResponse.data);

        // Fetch cast and crew (assuming these are included in the response or via separate endpoints)
        if (titleResponse.data.title_people) {
          const castMembers = titleResponse.data.title_people
            .filter((tp) => tp.role === "ACTOR")
            .sort((a, b) => (a.order || 999) - (b.order || 999));

          const crewMembers = titleResponse.data.title_people.filter(
            (tp) => tp.role !== "ACTOR"
          );

          setCast(castMembers);
          setCrew(crewMembers);
        }

        // Fetch reviews
        const reviewsResponse = await titleService.getReviews(id);
        setReviews(reviewsResponse.data);

        // Fetch trivia
        try {
          const triviaResponse = await fetch(
            `${
              process.env.REACT_APP_API_URL || "http://localhost:8000/api"
            }/trivia/title/${id}/`
          );
          if (triviaResponse.ok) {
            const triviaData = await triviaResponse.json();
            setTrivia(triviaData);
          }
        } catch (triviaErr) {
          console.error("Error fetching trivia:", triviaErr);
          // Don't set main error for trivia failure
        }
      } catch (err) {
        console.error("Error fetching title data:", err);
        setError("Failed to load title details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTitleData();
  }, [id]);

  const handleReviewSubmitted = async () => {
    try {
      const reviewsResponse = await titleService.getReviews(id);
      setReviews(reviewsResponse.data);
    } catch (err) {
      console.error("Error refreshing reviews:", err);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !title) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="p-4 rounded-md bg-red-50">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error || "Title not found"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Title Header with Backdrop */}
      <div className="relative">
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black to-transparent"></div>
        <div className="absolute inset-0 z-0 bg-black opacity-50"></div>
        {title.backdrop_path ? (
          <img
            src={title.backdrop_path || "/placeholder.svg"}
            alt={title.primary_title}
            className="w-full h-[500px] object-cover"
          />
        ) : (
          <div className="w-full h-[500px] bg-gray-800"></div>
        )}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-8">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-col items-end md:flex-row md:items-end">
              <div className="flex-shrink-0 hidden w-64 mr-8 -mb-16 overflow-hidden rounded-lg shadow-lg md:block h-96">
                {title.poster ? (
                  <img
                    src={title.poster || "/placeholder.svg"}
                    alt={title.primary_title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-300">
                    <Film size={48} className="text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h1 className="mb-2 text-4xl font-bold text-white md:text-5xl">
                  {title.primary_title}
                </h1>
                <div className="flex flex-wrap items-center mb-4 text-gray-300">
                  <span className="mr-4">{title.start_year}</span>
                  {title.runtime_minutes && (
                    <span className="flex items-center mr-4">
                      <Clock size={16} className="mr-1" />
                      {Math.floor(title.runtime_minutes / 60)}h{" "}
                      {title.runtime_minutes % 60}m
                    </span>
                  )}
                  <span className="mr-4">
                    {title.title_type.replace("_", " ")}
                  </span>
                  {title.genres &&
                    title.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-2 py-1 mb-2 mr-2 text-xs text-gray-200 bg-gray-800 rounded"
                      >
                        {genre.name}
                      </span>
                    ))}
                </div>
                {title.average_rating && (
                  <div className="flex items-center mb-6">
                    <div className="flex items-center bg-[#f5c518] text-black font-bold px-2 py-1 rounded mr-4">
                      <Star size={18} className="mr-1" />
                      <span>{title.average_rating.toFixed(1)}</span>
                    </div>
                    <span className="text-gray-300">
                      {title.num_votes.toLocaleString()} votes
                    </span>
                  </div>
                )}
                <div className="flex flex-wrap gap-3 mb-4">
                  <WatchlistButton titleId={title.id} />
                  <Link
                    to={`/reviews/${title.id}`}
                    className="inline-flex items-center px-4 py-2 font-medium text-gray-900 bg-white rounded-md hover:bg-gray-100"
                  >
                    <MessageSquare size={18} className="mr-1" />
                    Read Reviews
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Poster (only visible on mobile) */}
      <div className="relative z-20 flex justify-center px-4 mb-4 -mt-20 md:hidden">
        <div className="w-40 overflow-hidden rounded-lg shadow-lg h-60">
          {title.poster ? (
            <img
              src={title.poster || "/placeholder.svg"}
              alt={title.primary_title}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gray-300">
              <Film size={32} className="text-gray-500" />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8 md:pt-24">
        {/* Tabs */}
        <div className="mb-8 border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("cast")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "cast"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Cast & Crew
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "reviews"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Reviews
            </button>
            <button
              onClick={() => setActiveTab("trivia")}
              className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "trivia"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Trivia
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div>
            <div className="mb-8">
              <h2 className="mb-4 text-2xl font-bold">Overview</h2>
              <p className="mb-6 text-gray-700">
                {title.plot || "No plot description available."}
              </p>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-lg font-semibold">Details</h3>
                  <div className="p-4 bg-white rounded-lg shadow-md">
                    <dl className="divide-y divide-gray-200">
                      <div className="flex justify-between py-3">
                        <dt className="text-gray-500">Type</dt>
                        <dd className="text-gray-900">
                          {title.title_type.replace("_", " ")}
                        </dd>
                      </div>
                      <div className="flex justify-between py-3">
                        <dt className="text-gray-500">Release Year</dt>
                        <dd className="text-gray-900">{title.start_year}</dd>
                      </div>
                      {title.end_year && (
                        <div className="flex justify-between py-3">
                          <dt className="text-gray-500">End Year</dt>
                          <dd className="text-gray-900">{title.end_year}</dd>
                        </div>
                      )}
                      {title.runtime_minutes && (
                        <div className="flex justify-between py-3">
                          <dt className="text-gray-500">Runtime</dt>
                          <dd className="text-gray-900">
                            {Math.floor(title.runtime_minutes / 60)}h{" "}
                            {title.runtime_minutes % 60}m
                          </dd>
                        </div>
                      )}
                      {title.genres && title.genres.length > 0 && (
                        <div className="flex justify-between py-3">
                          <dt className="text-gray-500">Genres</dt>
                          <dd className="text-right text-gray-900">
                            {title.genres.map((genre) => genre.name).join(", ")}
                          </dd>
                        </div>
                      )}
                      {title.is_adult && (
                        <div className="flex justify-between py-3">
                          <dt className="text-gray-500">Content Rating</dt>
                          <dd className="text-gray-900">Adult</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 text-lg font-semibold">
                    Rate This Title
                  </h3>
                  <div className="p-4 bg-white rounded-lg shadow-md">
                    <RatingStars
                      titleId={title.id}
                      initialRating={0}
                      size="lg"
                    />
                  </div>

                  {title.title_type === "TV_SERIES" &&
                    title.episodes &&
                    title.episodes.length > 0 && (
                      <div className="mt-6">
                        <h3 className="mb-3 text-lg font-semibold">Episodes</h3>
                        <div className="p-4 bg-white rounded-lg shadow-md">
                          <div className="overflow-y-auto max-h-60">
                            {title.episodes.map((episode) => (
                              <Link
                                key={episode.id}
                                to={`/title/${episode.title.id}`}
                                className="block px-3 py-2 rounded-md hover:bg-gray-100"
                              >
                                <div className="flex justify-between">
                                  <span>
                                    S{episode.season_number} E
                                    {episode.episode_number}
                                  </span>
                                  <span className="text-gray-500">
                                    {episode.title.primary_title}
                                  </span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Top Cast Preview */}
            {cast.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Top Cast</h2>
                  <button
                    onClick={() => setActiveTab("cast")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    See all
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                  {cast.slice(0, 6).map((castMember) => (
                    <Link
                      key={castMember.id}
                      to={`/person/${castMember.person.id}`}
                      className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
                    >
                      <div className="aspect-[2/3] bg-gray-200">
                        {castMember.person.photo ? (
                          <img
                            src={castMember.person.photo || "/placeholder.svg"}
                            alt={castMember.person.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-300">
                            <User size={24} />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 truncate">
                          {castMember.person.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {castMember.characters
                            ? typeof castMember.characters === "string"
                              ? castMember.characters
                              : Array.isArray(castMember.characters)
                              ? castMember.characters.join(", ")
                              : "Character"
                            : "Character"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews Preview */}
            {reviews.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">Reviews</h2>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    See all
                  </button>
                </div>
                <div className="space-y-4">
                  {reviews.slice(0, 2).map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "cast" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold">Cast & Crew</h2>

            {/* Cast */}
            {cast.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-xl font-semibold">Cast</h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {cast.map((castMember) => (
                    <Link
                      key={castMember.id}
                      to={`/person/${castMember.person.id}`}
                      className="overflow-hidden transition-all duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
                    >
                      <div className="aspect-[2/3] bg-gray-200">
                        {castMember.person.photo ? (
                          <img
                            src={castMember.person.photo || "/placeholder.svg"}
                            alt={castMember.person.name}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-gray-500 bg-gray-300">
                            <User size={24} />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="font-medium text-gray-900 truncate">
                          {castMember.person.name}
                        </h3>
                        <p className="text-sm text-gray-500 truncate">
                          {castMember.characters
                            ? typeof castMember.characters === "string"
                              ? castMember.characters
                              : Array.isArray(castMember.characters)
                              ? castMember.characters.join(", ")
                              : "Character"
                            : "Character"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Crew */}
            {crew.length > 0 && (
              <div>
                <h3 className="mb-4 text-xl font-semibold">Crew</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {/* Directors */}
                  {crew.filter((c) => c.role === "DIRECTOR").length > 0 && (
                    <div className="p-4 bg-white rounded-lg shadow-md">
                      <h4 className="mb-3 font-semibold">Directors</h4>
                      <div className="space-y-3">
                        {crew
                          .filter((c) => c.role === "DIRECTOR")
                          .map((crewMember) => (
                            <Link
                              key={crewMember.id}
                              to={`/person/${crewMember.person.id}`}
                              className="flex items-center p-2 rounded-md hover:bg-gray-50"
                            >
                              <div className="w-10 h-10 mr-3 overflow-hidden bg-gray-200 rounded-full">
                                {crewMember.person.photo ? (
                                  <img
                                    src={
                                      crewMember.person.photo ||
                                      "/placeholder.svg"
                                    }
                                    alt={crewMember.person.name}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full">
                                    <User size={16} className="text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <span className="font-medium">
                                {crewMember.person.name}
                              </span>
                            </Link>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Writers */}
                  {crew.filter((c) => c.role === "WRITER").length > 0 && (
                    <div className="p-4 bg-white rounded-lg shadow-md">
                      <h4 className="mb-3 font-semibold">Writers</h4>
                      <div className="space-y-3">
                        {crew
                          .filter((c) => c.role === "WRITER")
                          .map((crewMember) => (
                            <Link
                              key={crewMember.id}
                              to={`/person/${crewMember.person.id}`}
                              className="flex items-center p-2 rounded-md hover:bg-gray-50"
                            >
                              <div className="w-10 h-10 mr-3 overflow-hidden bg-gray-200 rounded-full">
                                {crewMember.person.photo ? (
                                  <img
                                    src={
                                      crewMember.person.photo ||
                                      "/placeholder.svg"
                                    }
                                    alt={crewMember.person.name}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full">
                                    <User size={16} className="text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <span className="font-medium">
                                {crewMember.person.name}
                              </span>
                            </Link>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Producers */}
                  {crew.filter((c) => c.role === "PRODUCER").length > 0 && (
                    <div className="p-4 bg-white rounded-lg shadow-md">
                      <h4 className="mb-3 font-semibold">Producers</h4>
                      <div className="space-y-3">
                        {crew
                          .filter((c) => c.role === "PRODUCER")
                          .map((crewMember) => (
                            <Link
                              key={crewMember.id}
                              to={`/person/${crewMember.person.id}`}
                              className="flex items-center p-2 rounded-md hover:bg-gray-50"
                            >
                              <div className="w-10 h-10 mr-3 overflow-hidden bg-gray-200 rounded-full">
                                {crewMember.person.photo ? (
                                  <img
                                    src={
                                      crewMember.person.photo ||
                                      "/placeholder.svg"
                                    }
                                    alt={crewMember.person.name}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full">
                                    <User size={16} className="text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <span className="font-medium">
                                {crewMember.person.name}
                              </span>
                            </Link>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Other Crew */}
                  {crew.filter(
                    (c) => !["DIRECTOR", "WRITER", "PRODUCER"].includes(c.role)
                  ).length > 0 && (
                    <div className="p-4 bg-white rounded-lg shadow-md">
                      <h4 className="mb-3 font-semibold">Other Crew</h4>
                      <div className="space-y-3">
                        {crew
                          .filter(
                            (c) =>
                              !["DIRECTOR", "WRITER", "PRODUCER"].includes(
                                c.role
                              )
                          )
                          .map((crewMember) => (
                            <Link
                              key={crewMember.id}
                              to={`/person/${crewMember.person.id}`}
                              className="flex items-center p-2 rounded-md hover:bg-gray-50"
                            >
                              <div className="w-10 h-10 mr-3 overflow-hidden bg-gray-200 rounded-full">
                                {crewMember.person.photo ? (
                                  <img
                                    src={
                                      crewMember.person.photo ||
                                      "/placeholder.svg"
                                    }
                                    alt={crewMember.person.name}
                                    className="object-cover w-full h-full"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center w-full h-full">
                                    <User size={16} className="text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <span className="block font-medium">
                                  {crewMember.person.name}
                                </span>
                                <span className="text-sm text-gray-500">
                                  {crewMember.role.charAt(0) +
                                    crewMember.role.slice(1).toLowerCase()}
                                </span>
                              </div>
                            </Link>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {cast.length === 0 && crew.length === 0 && (
              <div className="p-6 text-center rounded-lg bg-gray-50">
                <p className="text-gray-500">
                  No cast or crew information available.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold">Reviews</h2>

            <ReviewForm
              titleId={title.id}
              onReviewSubmitted={handleReviewSubmitted}
            />

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded-lg bg-gray-50">
                <p className="text-gray-500">
                  No reviews yet. Be the first to review!
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "trivia" && (
          <div>
            <h2 className="mb-6 text-2xl font-bold">Trivia</h2>

            {trivia.length > 0 ? (
              <div className="space-y-4">
                {trivia.map((item) => (
                  <TriviaCard key={item.id} trivia={item} />
                ))}
              </div>
            ) : (
              <div className="p-6 text-center rounded-lg bg-gray-50">
                <p className="text-gray-500">
                  No trivia available for this title.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TitleDetailPage;
