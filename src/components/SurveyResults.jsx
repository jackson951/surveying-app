import { useEffect, useState } from "react";

const SurveyResults = () => {
  const [surveyData, setSurveyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("surveys") || "[]");
    setSurveyData(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (surveyData.length === 0) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm text-center border border-gray-100">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">
          Survey Results
        </h2>
        <p className="text-gray-500">No surveys available yet.</p>
      </div>
    );
  }

  // Calculate all statistics
  const totalSurveys = surveyData.length;
  const ages = surveyData.map((s) => parseInt(s.age));
  const averageAge = (ages.reduce((a, b) => a + b, 0) / totalSurveys).toFixed(
    1
  );
  const oldest = Math.max(...ages);
  const youngest = Math.min(...ages);

  // Food preferences
  const pizzaLovers = surveyData.filter((s) =>
    s.favoriteFoods.includes("Pizza")
  ).length;
  const pastaLovers = surveyData.filter((s) =>
    s.favoriteFoods.includes("Pasta")
  ).length;
  const papWorsLovers = surveyData.filter((s) =>
    s.favoriteFoods.includes("Pap and Wors")
  ).length;

  const pizzaPercentage = ((pizzaLovers / totalSurveys) * 100).toFixed(1);
  const pastaPercentage = ((pastaLovers / totalSurveys) * 100).toFixed(1);
  const papWorsPercentage = ((papWorsLovers / totalSurveys) * 100).toFixed(1);

  // Rating averages
  const eatOutRatings = surveyData.map((s) => parseInt(s.eatOutRating));
  const moviesRatings = surveyData.map((s) => parseInt(s.watchMoviesRating));
  const tvRatings = surveyData.map((s) => parseInt(s.watchTVRating));
  const radioRatings = surveyData.map((s) => parseInt(s.listenToRadioRating));

  const avgEatOutRating = (
    eatOutRatings.reduce((a, b) => a + b, 0) / totalSurveys
  ).toFixed(1);
  const avgMoviesRating = (
    moviesRatings.reduce((a, b) => a + b, 0) / totalSurveys
  ).toFixed(1);
  const avgTVRating = (
    tvRatings.reduce((a, b) => a + b, 0) / totalSurveys
  ).toFixed(1);
  const avgRadioRating = (
    radioRatings.reduce((a, b) => a + b, 0) / totalSurveys
  ).toFixed(1);

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
            <span className="text-gray-800 font-semibold">{totalSurveys}</span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">Average age:</span>
            <span className="text-gray-800 font-semibold">{averageAge}</span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              Oldest participant person who participated in the survey:
            </span>
            <span className="text-gray-800 font-semibold">{oldest}</span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              Youngest participant who participated in the survey:
            </span>
            <span className="text-gray-800 font-semibold">{youngest}</span>
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
              {pizzaPercentage}%
            </span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              Percentage of people who like pasta:
            </span>
            <span className="text-gray-800 font-semibold">
              {pastaPercentage}%
            </span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              Percentage of people who like pap and wors:
            </span>
            <span className="text-gray-800 font-semibold">
              {papWorsPercentage}%
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
              {avgEatOutRating}/5
            </span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              People who like to watch movies:
            </span>
            <span className="text-gray-800 font-semibold">
              {avgMoviesRating}/5
            </span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              {" "}
              People who like to watch TV:
            </span>
            <span className="text-gray-800 font-semibold">{avgTVRating}/5</span>
          </div>
          <div className="flex justify-between max-w-xs">
            <span className="text-gray-600 font-medium">
              People who like to listen to radio:
            </span>
            <span className="text-gray-800 font-semibold">
              {avgRadioRating}/5
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyResults;
