import { useEffect, useState } from "react";
import axios from "axios";

const SurveyResults = () => {
  const [surveyStats, setSurveyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSurveyResults = async () => {
      try {
        // Using Axios instead of fetch
        const response = await axios.get("http://localhost:5000/api/results");
        setSurveyStats(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyResults();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm text-center border border-gray-100">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">Error</h2>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!surveyStats || surveyStats.total === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm text-center border border-gray-100">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">
          Survey Results
        </h2>
        <p className="text-gray-500">No surveys available yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center pb-4 border-b border-gray-100">
        Survey Results
      </h2>

      {/* Personal Details Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 pl-2 border-l-4 border-blue-500">
          Personal Details
        </h3>
        <div className="space-y-3 pl-6">
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              Total number of surveys:
            </span>
            <span className="text-gray-800 font-semibold">
              {surveyStats.total}
            </span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">Average age:</span>
            <span className="text-gray-800 font-semibold">
              {surveyStats.avgAge.toFixed(1)}
            </span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              Oldest participant:
            </span>
            <span className="text-gray-800 font-semibold">
              {surveyStats.maxAge}
            </span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              Youngest participant:
            </span>
            <span className="text-gray-800 font-semibold">
              {surveyStats.minAge}
            </span>
          </div>
        </div>
      </div>

      {/* Favorite Food Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4 pl-2 border-l-4 border-green-500">
          Favorite Food
        </h3>
        <div className="space-y-3 pl-6">
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              Percentage of people who like pizza:
            </span>
            <span className="text-gray-800 font-semibold">
              {surveyStats.foodPreferences.pizza.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              Percentage of people who like pasta:
            </span>
            <span className="text-gray-800 font-semibold">
              {surveyStats.foodPreferences.pasta.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              Percentage of people who like pap and wors:
            </span>
            <span className="text-gray-800 font-semibold">
              {surveyStats.foodPreferences.papAndWors.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 pl-2 border-l-4 border-purple-500">
          Activity Preferences
        </h3>
        <div className="space-y-3 pl-6">
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">Like to eat out:</span>
            <span className="text-gray-800 font-semibold">
              {surveyStats.averageRatings.eatOut.toFixed(1)}/5
            </span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              People who like to watch movies:
            </span>
            <span className="text-gray-800 font-semibold">
              {surveyStats.averageRatings.movies.toFixed(1)}/5
            </span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              People who like to watch TV:
            </span>
            <span className="text-gray-800 font-semibold">
              {surveyStats.averageRatings.tv.toFixed(1)}/5
            </span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              People who like to listen to radio:
            </span>
            <span className="text-gray-800 font-semibold">
              {surveyStats.averageRatings.radio.toFixed(1)}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyResults;
