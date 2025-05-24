import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { User, Calendar, MapPin, Globe } from "react-feather";
import { personService, triviaService } from "../services/api";
import TitleCard from "../components/titles/TitleCard";
import TriviaCard from "../components/trivia/TriviaCard";

const PersonDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState(null);
  const [filmography, setFilmography] = useState([]);
  const [trivia, setTrivia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;

  const fetchPersonData = useCallback(async () => {
    if (!id || typeof id !== "string" || id.trim() === "") {
      setError("Invalid person ID provided.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [personResponse, filmographyResponse, triviaResponse] =
        await Promise.all([
          personService.getById(id).catch(() => null),
          personService.getFilmography(id).catch(() => ({ data: [] })),
          triviaService.getByPerson(id).catch(() => ({ data: [] })),
        ]);

      if (!personResponse?.data) {
        throw new Error("Person data not found");
      }

      setPerson(personResponse.data);
      setFilmography(filmographyResponse.data || []);
      setTrivia(triviaResponse.data || []);
    } catch (err) {
      console.error("Error fetching person data:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });

      if (err.response?.status === 404) {
        setError("Person not found. Please check the ID or try again.");
      } else if (err.response?.status === 401) {
        setError("Authentication required. Please log in.");
        // Optionally trigger token refresh via /users/token/refresh/
      } else if (err.response?.status >= 500) {
        setError("Server error. Please try again later or contact support.");
      } else if (err.message === "Network Error") {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError(`Failed to load person details: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }, [id, retryCount]);

  useEffect(() => {
    fetchPersonData();
  }, [fetchPersonData]);

  const handleRetry = () => {
    if (retryCount >= maxRetries) {
      setError("Maximum retry attempts reached. Please try again later.");
      return;
    }
    setError(null);
    setRetryCount((prev) => prev + 1);
  };

  // Group filmography by role
  const filmographyByRole = filmography.reduce((acc, item) => {
    const role = item.role?.toUpperCase() || "UNKNOWN";
    acc[role] = acc[role] || [];
    acc[role].push(item);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-8">
        <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen px-4 py-8 mx-auto max-w-7xl">
        <div className="p-6 rounded-lg bg-red-50">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 mr-3 text-red-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error</h3>
              <p className="mt-2 text-sm text-red-700">{error}</p>
              <div className="flex mt-4 space-x-4">
                <button
                  onClick={handleRetry}
                  disabled={retryCount >= maxRetries}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
                >
                  Retry
                </button>
                <button
                  onClick={() => navigate(-1)}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 mx-auto max-w-7xl">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar */}
        <aside className="space-y-6 md:w-1/3 lg:w-1/4">
          <div className="overflow-hidden bg-white rounded-lg shadow-md">
            <div className="aspect-[3/4] bg-gray-200">
              {person.photo ? (
                <img
                  src={person.photo}
                  alt={`${person.name || "Person"}'s photo`}
                  className="object-cover w-full h-full"
                  onError={(e) => (e.target.src = "/placeholder.svg")}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-300">
                  <User
                    size={48}
                    className="text-gray-500"
                    aria-hidden="true"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Personal Info</h2>
            <dl className="space-y-4">
              {person.birth_year && (
                <div>
                  <dt className="flex items-center text-sm text-gray-500">
                    <Calendar size={16} className="mr-2" aria-hidden="true" />
                    Born
                  </dt>
                  <dd className="mt-1 text-gray-900">
                    {person.birth_year}
                    {person.death_year && ` - ${person.death_year}`}
                  </dd>
                </div>
              )}
              {person.location && (
                <div>
                  <dt className="flex items-center text-sm text-gray-500">
                    <MapPin size={16} className="mr-2" aria-hidden="true" />
                    From
                  </dt>
                  <dd className="mt-1 text-gray-900">{person.location}</dd>
                </div>
              )}
              {person.website && (
                <div>
                  <dt className="flex items-center text-sm text-gray-500">
                    <Globe size={16} className="mr-2" aria-hidden="true" />
                    Website
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={person.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 break-words hover:text-blue-800"
                    >
                      {new URL(person.website).hostname}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </aside>

        {/* Main Content */}
        <main className="md:w-2/3 lg:w-3/4">
          <h1 className="mb-6 text-3xl font-bold md:text-4xl">
            {person.name || "Unknown"}
          </h1>

          {/* Tabs */}
          <nav className="flex mb-6 border-b border-gray-200">
            {["overview", "filmography", "trivia"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                aria-current={activeTab === tab ? "page" : undefined}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <section>
                <h2 className="mb-4 text-2xl font-bold">Biography</h2>
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <p className="text-gray-700">
                    {person.bio || "No biography available."}
                  </p>
                </div>
              </section>

              {filmography.length > 0 && (
                <>
                  <section>
                    <h2 className="mb-4 text-2xl font-bold">Known For</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                      {filmography
                        .sort(
                          (a, b) =>
                            (b.title?.average_rating || 0) -
                            (a.title?.average_rating || 0)
                        )
                        .slice(0, 4)
                        .map((item) => (
                          <TitleCard key={item.id} title={item.title} />
                        ))}
                    </div>
                  </section>
                  <section>
                    <h2 className="mb-4 text-2xl font-bold">Recent Work</h2>
                    <div className="overflow-hidden bg-white rounded-lg shadow-md">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Year
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Title
                            </th>
                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                              Role
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filmography
                            .sort(
                              (a, b) =>
                                (b.title?.start_year ||
                                  new Date().getFullYear()) -
                                (a.title?.start_year ||
                                  new Date().getFullYear())
                            )
                            .slice(0, 5)
                            .map((item) => (
                              <tr key={item.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {item.title?.start_year || "N/A"}
                                </td>
                                <td className="px-6 py-4">
                                  <Link
                                    to={`/title/${item.title?.id}`}
                                    className="text-blue-600 hover:text-blue-900"
                                  >
                                    {item.title?.primary_title || "Untitled"}
                                  </Link>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                  {(item.role || "Unknown").charAt(0) +
                                    (item.role || "unknown")
                                      .slice(1)
                                      .toLowerCase()}
                                  {item.characters && (
                                    <span className="ml-1">
                                      as{" "}
                                      {Array.isArray(item.characters)
                                        ? item.characters.join(", ")
                                        : item.characters}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                      <div className="px-6 py-3 bg-gray-50">
                        <button
                          onClick={() => setActiveTab("filmography")}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          View full filmography
                        </button>
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          )}

          {activeTab === "filmography" && (
            <section>
              <h2 className="mb-6 text-2xl font-bold">Filmography</h2>
              {Object.keys(filmographyByRole).length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(filmographyByRole).map(([role, items]) => (
                    <div key={role}>
                      <h3 className="mb-4 text-xl font-semibold">
                        {(role || "Unknown").charAt(0) +
                          (role || "unknown").slice(1).toLowerCase()}
                      </h3>
                      <div className="overflow-hidden bg-white rounded-lg shadow-md">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Year
                              </th>
                              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Title
                              </th>
                              <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                Type
                              </th>
                              {role === "ACTOR" && (
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                  Character
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {items
                              .sort(
                                (a, b) =>
                                  (b.title?.start_year ||
                                    new Date().getFullYear()) -
                                  (a.title?.start_year ||
                                    new Date().getFullYear())
                              )
                              .map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm text-gray-500">
                                    {item.title?.start_year || "N/A"}
                                  </td>
                                  <td className="px-6 py-4">
                                    <Link
                                      to={`/title/${item.title?.id}`}
                                      className="text-blue-600 hover:text-blue-900"
                                    >
                                      {item.title?.primary_title || "Untitled"}
                                    </Link>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-500">
                                    {item.title?.title_type?.replace(
                                      "_",
                                      " "
                                    ) || "N/A"}
                                  </td>
                                  {role === "ACTOR" && (
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                      {item.characters
                                        ? Array.isArray(item.characters)
                                          ? item.characters.join(", ")
                                          : item.characters
                                        : "-"}
                                    </td>
                                  )}
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center rounded-lg bg-gray-50">
                  <p className="text-gray-500">No filmography available.</p>
                </div>
              )}
            </section>
          )}

          {activeTab === "trivia" && (
            <section>
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
                    No trivia available for this person.
                  </p>
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default PersonDetailPage;
