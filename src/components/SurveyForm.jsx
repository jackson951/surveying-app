import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Define validation schema using Zod
const surveySchema = z.object({
  name: z.string().min(1, "Name is required").max(50, "Name is too long"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  age: z
    .number()
    .min(5, "Age must be at least 5")
    .max(120, "Age must be no more than 120"),
  dob: z.string().min(1, "Date of birth is required"),
  favoriteFoods: z
    .array(z.string())
    .min(1, "Select at least one favorite food"),
  eatOutRating: z.string().min(1, "Rating is required"),
  watchMoviesRating: z.string().min(1, "Rating is required"),
  watchTVRating: z.string().min(1, "Rating is required"),
  listenToRadioRating: z.string().min(1, "Rating is required"),
});

const foodOptions = ["Pizza", "Pasta", "Pap and Wors", "Other"];
const ratingOptions = [1, 2, 3, 4, 5];
const ratingLabels = [
  "Strongly Agree", // 1
  "Agree", // 2
  "Neutral", // 3
  "Disagree", // 4
  "Strongly Disagree", // 5
];

const SurveyForm = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      name: "",
      email: "",
      age: undefined,
      dob: "",
      favoriteFoods: [],
      eatOutRating: "",
      watchMoviesRating: "",
      watchTVRating: "",
      listenToRadioRating: "",
    },
  });

  const selectedFoods = watch("favoriteFoods");

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/surveys", {
        name: data.name,
        email: data.email,
        age: data.age,
        dob: data.dob,
        favoriteFoods: data.favoriteFoods,
        eatOutRating: parseInt(data.eatOutRating),
        watchMoviesRating: parseInt(data.watchMoviesRating),
        watchTVRating: parseInt(data.watchTVRating),
        listenToRadioRating: parseInt(data.listenToRadioRating),
      });

      if (response.data.message.toUpperCase().includes("SUCCESS")) {
        setIsSubmitted(true);
        reset();
      }
    } catch (err) {
      setError("Failed to submit survey. Please try again.");
      console.error("Submission error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 my-8">
        <div className="bg-green-50 border-l-4 border-green-500 p-8 rounded-lg">
          <div className="flex items-center justify-center">
            <div className="flex-shrink-0">
              <svg
                className="h-12 w-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-green-800">Thank You!</h3>
              <div className="mt-2 text-green-700">
                <p>Your survey has been successfully submitted.</p>
                <p className="mt-2">
                  We appreciate your time and valuable feedback.
                </p>
              </div>
              <div className="mt-6">
                <button
                  onClick={() => navigate("/results")}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  View Survey Results
                </button>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Submit Another Response
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 my-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Lifestyle Preferences Survey
        </h1>
        <p className="text-gray-600">
          Please fill out this form to help us understand your lifestyle
          preferences
        </p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Personal Details Section */}
        <div className="space-y-8 bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            Personal Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="text"
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="John Doe"
                  />
                )}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email *
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="email"
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="john@example.com"
                  />
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Age *
              </label>
              <Controller
                name="age"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.age ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="25"
                    min="5"
                    max="120"
                  />
                )}
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.age.message}
                </p>
              )}
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth *
              </label>
              <Controller
                name="dob"
                control={control}
                render={({ field }) => (
                  <input
                    {...field}
                    type="date"
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                      errors.dob ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                )}
              />
              {errors.dob && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dob.message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Favorite Foods Section */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            What is your favorite food? (You can choose more than one answer) *
          </h2>

          <Controller
            name="favoriteFoods"
            control={control}
            render={({ field }) => (
              <div>
                <div className="flex flex-wrap gap-4">
                  {foodOptions.map((food) => (
                    <label
                      key={food}
                      className={`inline-flex items-center px-4 py-3 rounded-lg border cursor-pointer transition ${
                        selectedFoods.includes(food)
                          ? "bg-blue-50 border-blue-500"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selectedFoods.includes(food)}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? [...field.value, food]
                            : field.value.filter((val) => val !== food);
                          field.onChange(newValue);
                        }}
                      />
                      <span className="flex items-center">
                        <div
                          className={`w-5 h-5 rounded border mr-2 flex items-center justify-center ${
                            selectedFoods.includes(food)
                              ? "bg-blue-500 border-blue-500"
                              : "border-gray-400"
                          }`}
                        >
                          {selectedFoods.includes(food) && (
                            <svg
                              className="w-3 h-3 text-white"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          )}
                        </div>
                        {food}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.favoriteFoods && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.favoriteFoods.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Ratings Section */}
        <div className="space-y-6 bg-gray-50 p-6 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
            On a scale of 1 to 5, please indicate your preferences
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 w-1/3 bg-gray-100">
                    Statement
                  </th>
                  {ratingOptions.map((rating) => (
                    <th
                      key={rating}
                      className="px-2 py-2 text-center text-sm font-medium text-gray-700 bg-gray-200"
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold">{rating}</span>
                        <span className="text-xs text-gray-600">
                          {ratingLabels[rating - 1]}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Eat Out Rating */}
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700 bg-gray-50">
                    I like to eat out *
                    {errors.eatOutRating && (
                      <p className="text-red-500 text-sm font-normal mt-1">
                        {errors.eatOutRating.message}
                      </p>
                    )}
                  </td>
                  {ratingOptions.map((rating) => (
                    <td
                      key={`eatOut-${rating}`}
                      className="px-2 py-4 text-center bg-white"
                    >
                      <Controller
                        name="eatOutRating"
                        control={control}
                        render={({ field }) => (
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                              checked={field.value === String(rating)}
                              onChange={() => field.onChange(String(rating))}
                            />
                          </label>
                        )}
                      />
                    </td>
                  ))}
                </tr>

                {/* Watch Movies Rating */}
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700 bg-gray-50">
                    I like to watch movies *
                    {errors.watchMoviesRating && (
                      <p className="text-red-500 text-sm font-normal mt-1">
                        {errors.watchMoviesRating.message}
                      </p>
                    )}
                  </td>
                  {ratingOptions.map((rating) => (
                    <td
                      key={`movies-${rating}`}
                      className="px-2 py-4 text-center bg-white"
                    >
                      <Controller
                        name="watchMoviesRating"
                        control={control}
                        render={({ field }) => (
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                              checked={field.value === String(rating)}
                              onChange={() => field.onChange(String(rating))}
                            />
                          </label>
                        )}
                      />
                    </td>
                  ))}
                </tr>

                {/* Watch TV Rating */}
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700 bg-gray-50">
                    I like to watch TV *
                    {errors.watchTVRating && (
                      <p className="text-red-500 text-sm font-normal mt-1">
                        {errors.watchTVRating.message}
                      </p>
                    )}
                  </td>
                  {ratingOptions.map((rating) => (
                    <td
                      key={`tv-${rating}`}
                      className="px-2 py-4 text-center bg-white"
                    >
                      <Controller
                        name="watchTVRating"
                        control={control}
                        render={({ field }) => (
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                              checked={field.value === String(rating)}
                              onChange={() => field.onChange(String(rating))}
                            />
                          </label>
                        )}
                      />
                    </td>
                  ))}
                </tr>

                {/* Listen to Radio Rating */}
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-700 bg-gray-50">
                    I like to listen to the radio *
                    {errors.listenToRadioRating && (
                      <p className="text-red-500 text-sm font-normal mt-1">
                        {errors.listenToRadioRating.message}
                      </p>
                    )}
                  </td>
                  {ratingOptions.map((rating) => (
                    <td
                      key={`radio-${rating}`}
                      className="px-2 py-4 text-center bg-white"
                    >
                      <Controller
                        name="listenToRadioRating"
                        control={control}
                        render={({ field }) => (
                          <label className="inline-flex items-center">
                            <input
                              type="radio"
                              className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                              checked={field.value === String(rating)}
                              onChange={() => field.onChange(String(rating))}
                            />
                          </label>
                        )}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Submitting..." : "Submit Survey"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SurveyForm;
