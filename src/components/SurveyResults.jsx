import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const SurveyResults = () => {
  const [surveyStats, setSurveyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchSurveyResults = async () => {
      try {
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
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading survey results...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center border border-red-200 my-8">
        <h2 className="text-2xl font-bold mb-3 text-red-600">
          Error Loading Results
        </h2>
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!surveyStats || surveyStats.total === 0) {
    return (
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center border border-gray-200 my-8">
        <h2 className="text-2xl font-bold mb-3 text-gray-800">
          Survey Results
        </h2>
        <p className="text-gray-500 mb-4">No surveys available yet.</p>
        <div className="mt-6">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-400">
              Data will appear here once surveys are submitted
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Data for charts
  const ageDistributionData = {
    labels: ["Under 18", "19-30", "31-45", "Over 45"],
    datasets: [
      {
        label: "Age Distribution",
        data: [
          surveyStats.ageDistribution.under18,
          surveyStats.ageDistribution.age19to30,
          surveyStats.ageDistribution.age31to45,
          surveyStats.ageDistribution.over45,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(255, 99, 132, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 99, 132, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const foodPreferencesData = {
    labels: ["Pizza", "Pasta", "Pap and Wors"],
    datasets: [
      {
        data: [
          surveyStats.foodPreferences.pizza,
          surveyStats.foodPreferences.pasta,
          surveyStats.foodPreferences.papAndWors,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const ratingDistributionData = {
    labels: ["1", "2", "3", "4", "5"],
    datasets: [
      {
        label: "Eat Out",
        data: surveyStats.ratingDistributions.eatOut,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "Movies",
        data: surveyStats.ratingDistributions.movies,
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "TV",
        data: surveyStats.ratingDistributions.tv,
        backgroundColor: "rgba(255, 206, 86, 0.6)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "Radio",
        data: surveyStats.ratingDistributions.radio,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const averageRatingsData = {
    labels: ["Eat Out", "Movies", "TV", "Radio"],
    datasets: [
      {
        label: "Average Rating",
        data: [
          surveyStats.ratingDistributions.eatOut,
          surveyStats.ratingDistributions.movies,
          surveyStats.ratingDistributions.tv,
          surveyStats.ratingDistributions.radio,
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Standard Deviation",
        data: [
          surveyStats.ratingDistributions.eatOutStdDev,
          surveyStats.ratingDistributions.moviesStdDev,
          surveyStats.ratingDistributions.tvStdDev,
          surveyStats.ratingDistributions.radioStdDev,
        ],
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow-md border border-gray-100 my-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Survey Analytics Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            {surveyStats.total} responses collected | Last updated:{" "}
            {new Date().toLocaleString()}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "overview"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("demographics")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "demographics"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Demographics
          </button>
          <button
            onClick={() => setActiveTab("preferences")}
            className={`px-4 py-2 rounded-md ${
              activeTab === "preferences"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Preferences
          </button>
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Summary Cards */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              Total Responses
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {surveyStats.total}
            </p>
            <p className="text-sm text-blue-500 mt-1">
              Unique respondents: {surveyStats.uniqueEmails}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Average Age
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {surveyStats.avgAge.toFixed(1)}
            </p>
            <p className="text-sm text-green-500 mt-1">
              Range: {surveyStats.minAge} - {surveyStats.maxAge} years
            </p>
          </div>

          {/* Recent Submissions */}
          <div className="md:col-span-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Recent Submissions
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Age
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {surveyStats.recentSubmissions.map((submission, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {submission.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {submission.age}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(
                          submission.submissionDate
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Food Preferences */}
          <div className="md:col-span-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Food Preferences
            </h3>
            <div className="h-64">
              <Pie
                data={foodPreferencesData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "right",
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.label}: ${context.raw.toFixed(1)}%`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Demographics Tab */}
      {activeTab === "demographics" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Age Distribution
            </h3>
            <div className="h-64">
              <Bar
                data={ageDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Percentage of Respondents",
                      },
                    },
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.label}: ${context.raw.toFixed(1)}%`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <h4 className="text-sm font-medium text-purple-800">Under 18</h4>
              <p className="text-2xl font-bold text-purple-600">
                {surveyStats.ageDistribution.under18.toFixed(1)}%
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="text-sm font-medium text-blue-800">19-30</h4>
              <p className="text-2xl font-bold text-blue-600">
                {surveyStats.ageDistribution.age19to30.toFixed(1)}%
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h4 className="text-sm font-medium text-yellow-800">31-45</h4>
              <p className="text-2xl font-bold text-yellow-600">
                {surveyStats.ageDistribution.age31to45.toFixed(1)}%
              </p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-100">
              <h4 className="text-sm font-medium text-red-800">Over 45</h4>
              <p className="text-2xl font-bold text-red-600">
                {surveyStats.ageDistribution.over45.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === "preferences" && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Activity Ratings
            </h3>
            <div className="h-64">
              <Bar
                data={averageRatingsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 5,
                      title: {
                        display: true,
                        text: "Rating (1-5 scale)",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Rating Distribution
            </h3>
            <div className="h-64">
              <Line
                data={ratingDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Number of Respondents",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
              <h4 className="text-sm font-medium text-pink-800">Eat Out</h4>
              <p className="text-2xl font-bold text-pink-600">
                {surveyStats.ratingDistributions.eatOut.toFixed(2)}
              </p>
              <p className="text-xs text-pink-500">
                ±{surveyStats.ratingDistributions.eatOutStdDev.toFixed(2)}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <h4 className="text-sm font-medium text-blue-800">Movies</h4>
              <p className="text-2xl font-bold text-blue-600">
                {surveyStats.ratingDistributions.movies.toFixed(2)}
              </p>
              <p className="text-xs text-blue-500">
                ±{surveyStats.ratingDistributions.moviesStdDev.toFixed(2)}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <h4 className="text-sm font-medium text-yellow-800">TV</h4>
              <p className="text-2xl font-bold text-yellow-600">
                {surveyStats.ratingDistributions.tv.toFixed(2)}
              </p>
              <p className="text-xs text-yellow-500">
                ±{surveyStats.ratingDistributions.tvStdDev.toFixed(2)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-100">
              <h4 className="text-sm font-medium text-green-800">Radio</h4>
              <p className="text-2xl font-bold text-green-600">
                {surveyStats.ratingDistributions.radio.toFixed(2)}
              </p>
              <p className="text-xs text-green-500">
                ±{surveyStats.ratingDistributions.radioStdDev.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SurveyResults;
