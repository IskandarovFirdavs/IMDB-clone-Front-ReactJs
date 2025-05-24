import { useEffect, useState } from "react";
import { triviaService } from "../services/api";
import TriviaCard from "../components/trivia/TriviaCard";

const TriviaPage = () => {
  const [triviaList, setTriviaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrivia = async () => {
      try {
        const response = await triviaService.getAll();
        const results = Array.isArray(response.data)
          ? response.data
          : response.data.results || [];
        setTriviaList(results);
      } catch (err) {
        console.error("Error loading trivia:", err);
        setError("Failed to load trivia.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrivia();
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-8 mx-auto max-w-7xl">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <h1 className="mb-6 text-2xl font-bold">Trivia</h1>
      {triviaList.length > 0 ? (
        triviaList.map((trivia) => (
          <TriviaCard key={trivia.id} trivia={trivia} />
        ))
      ) : (
        <p>No trivia found.</p>
      )}
    </div>
  );
};

export default TriviaPage;
