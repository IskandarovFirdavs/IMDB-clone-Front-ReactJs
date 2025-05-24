import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { personService } from "../services/api";
import "../styles/PersonPage.css";

const PersonPage = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    personService
      .getAll()
      .then((response) => {
        const personsData = response.data.results || response.data;
        setPersons(personsData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "An error occurred");
        setLoading(false);
      });
  }, []);

  const handlePersonClick = (personId) => {
    navigate(`/person/${personId}`);
  };

  if (loading)
    return (
      <div className="container">
        <div className="loading">Loading...</div>
      </div>
    );

  if (error)
    return (
      <div className="container">
        <div className="error-message">Error: {error}</div>
      </div>
    );

  return (
    <div className="container">
      <h1 className="page-title">People</h1>

      {persons.length === 0 ? (
        <div className="empty-state">No data available</div>
      ) : (
        <div className="person-grid">
          {persons.map((person) => (
            <div
              className="person-card"
              key={person.id}
              onClick={() => handlePersonClick(person.id)}
              style={{ cursor: "pointer" }}
            >
              <img
                className="person-image"
                src={
                  person.photo ||
                  "https://via.placeholder.com/300x250?text=No+Photo"
                }
                alt={person.name}
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/300x250?text=No+Photo";
                }}
              />
              <div className="person-info">
                <h3 className="person-name">{person.name}</h3>
                <p className="person-detail">Birth Year: {person.birth_year}</p>
                <p className="person-detail">
                  Status:
                  {!person.death_year ? (
                    <span className="status-badge alive">Alive</span>
                  ) : (
                    <span className="status-badge">
                      Deceased: {person.death_year}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonPage;
