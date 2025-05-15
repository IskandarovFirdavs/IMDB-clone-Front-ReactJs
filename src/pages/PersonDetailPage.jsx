"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { User, Calendar, MapPin, Globe } from "react-feather"
import { personService } from "../services/api"
import TitleCard from "../components/titles/TitleCard"
import TriviaCard from "../components/trivia/TriviaCard"

const PersonDetailPage = () => {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [filmography, setFilmography] = useState([])
  const [trivia, setTrivia] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const fetchPersonData = async () => {
      try {
        setLoading(true)

        // Fetch person details
        const personResponse = await personService.getById(id)
        setPerson(personResponse.data)

        // Fetch filmography
        const filmographyResponse = await personService.getFilmography(id)
        setFilmography(filmographyResponse.data)

        // Fetch trivia
        try {
          const triviaResponse = await fetch(
            `${process.env.REACT_APP_API_URL || "http://localhost:8000/api"}/trivia/person/${id}/`,
          )
          if (triviaResponse.ok) {
            const triviaData = await triviaResponse.json()
            setTrivia(triviaData)
          }
        } catch (triviaErr) {
          console.error("Error fetching trivia:", triviaErr)
          // Don't set main error for trivia failure
        }
      } catch (err) {
        console.error("Error fetching person data:", err)
        setError("Failed to load person details. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPersonData()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  if (error || !person) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
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
                <p>{error || "Person not found"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Group filmography by role
  const filmographyByRole = filmography.reduce((acc, item) => {
    if (!acc[item.role]) {
      acc[item.role] = []
    }
    acc[item.role].push(item)
    return acc
  }, {})

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with Photo and Info */}
        <div className="md:w-1/3 lg:w-1/4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="aspect-[3/4] bg-gray-200">
              {person.photo ? (
                <img
                  src={person.photo || "/placeholder.svg"}
                  alt={person.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                  <User size={48} />
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4">Personal Info</h2>
            <dl className="space-y-3">
              {person.birth_year && (
                <div>
                  <dt className="text-sm text-gray-500 flex items-center">
                    <Calendar size={16} className="mr-2" />
                    Born
                  </dt>
                  <dd className="mt-1">
                    {person.birth_year}
                    {person.death_year && ` - ${person.death_year}`}
                  </dd>
                </div>
              )}

              {person.location && (
                <div>
                  <dt className="text-sm text-gray-500 flex items-center">
                    <MapPin size={16} className="mr-2" />
                    From
                  </dt>
                  <dd className="mt-1">{person.location}</dd>
                </div>
              )}

              {person.website && (
                <div>
                  <dt className="text-sm text-gray-500 flex items-center">
                    <Globe size={16} className="mr-2" />
                    Website
                  </dt>
                  <dd className="mt-1">
                    <a
                      href={person.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {new URL(person.website).hostname}
                    </a>
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:w-2/3 lg:w-3/4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{person.name}</h1>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
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
                onClick={() => setActiveTab("filmography")}
                className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "filmography"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Filmography
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
              {/* Bio */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Biography</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-700">{person.bio || "No biography available."}</p>
                </div>
              </div>

              {/* Known For */}
              {filmography.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Known For</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {filmography
                      .sort((a, b) => (b.title.average_rating || 0) - (a.title.average_rating || 0))
                      .slice(0, 4)
                      .map((item) => (
                        <TitleCard key={item.id} title={item.title} />
                      ))}
                  </div>
                </div>
              )}

              {/* Recent Work */}
              {filmography.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold mb-4">Recent Work</h2>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Year
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Title
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Role
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filmography
                          .sort((a, b) => b.title.start_year - a.title.start_year)
                          .slice(0, 5)
                          .map((item) => (
                            <tr key={item.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.title.start_year}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Link to={`/title/${item.title.id}`} className="text-blue-600 hover:text-blue-900">
                                  {item.title.primary_title}
                                </Link>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {item.role.charAt(0) + item.role.slice(1).toLowerCase()}
                                {item.characters && (
                                  <span className="ml-1">
                                    as {Array.isArray(item.characters) ? item.characters.join(", ") : item.characters}
                                  </span>
                                )}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <div className="bg-gray-50 px-6 py-3">
                      <button
                        onClick={() => setActiveTab("filmography")}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View full filmography
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "filmography" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Filmography</h2>

              {Object.keys(filmographyByRole).length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(filmographyByRole).map(([role, items]) => (
                    <div key={role}>
                      <h3 className="text-xl font-semibold mb-4">{role.charAt(0) + role.slice(1).toLowerCase()}</h3>
                      <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Year
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Title
                              </th>
                              <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                              >
                                Type
                              </th>
                              {role === "ACTOR" && (
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Character
                                </th>
                              )}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {items
                              .sort((a, b) => b.title.start_year - a.title.start_year)
                              .map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.title.start_year}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <Link to={`/title/${item.title.id}`} className="text-blue-600 hover:text-blue-900">
                                      {item.title.primary_title}
                                    </Link>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {item.title.title_type.replace("_", " ")}
                                  </td>
                                  {role === "ACTOR" && (
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-500">No filmography available.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "trivia" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Trivia</h2>

              {trivia.length > 0 ? (
                <div className="space-y-4">
                  {trivia.map((item) => (
                    <TriviaCard key={item.id} trivia={item} />
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 p-6 rounded-lg text-center">
                  <p className="text-gray-500">No trivia available for this person.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonDetailPage
