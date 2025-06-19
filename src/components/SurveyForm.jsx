import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

// Enhanced validation schema with more specific error messages
const surveySchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Name can only contain letters and spaces"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  age: z
    .number()
    .min(5, "You must be at least 5 years old")
    .max(120, "Please enter a valid age (under 120)"),
  dob: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => {
      const dobDate = new Date(val);
      const today = new Date();
      return dobDate < today;
    }, "Date of birth must be in the past"),
  favoriteFoods: z
    .array(z.string())
    .min(1, "Please select at least one favorite food")
    .max(3, "Please select no more than 3 favorite foods"),
  eatOutRating: z.string().min(1, "Please select a rating"),
  watchMoviesRating: z.string().min(1, "Please select a rating"),
  watchTVRating: z.string().min(1, "Please select a rating"),
  listenToRadioRating: z.string().min(1, "Please select a rating"),
});

const foodOptions = [
  { value: "Pizza", emoji: "🍕" },
  { value: "Pasta", emoji: "🍝" },
  { value: "Pap and Wors", emoji: "🌽" },
  { value: "Other", emoji: "🍲" },
];

const ratingOptions = [1, 2, 3, 4, 5];
const ratingLabels = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SurveyForm = () => {
  const navigate = useNavigate();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
    trigger,
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
    mode: "onChange",
  });

  const selectedFoods = watch("favoriteFoods");
  const formData = watch();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5000/api/surveys", {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        age: Number(data.age),
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
      const errorMessage =
        err.response?.data?.error ||
        err.message ||
        "Failed to submit survey. Please try again later.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const validateAndGoNext = async () => {
    let fieldsToValidate = [];

    switch (currentSection) {
      case 0:
        fieldsToValidate = ["name", "email", "age", "dob"];
        break;
      case 1:
        fieldsToValidate = ["favoriteFoods"];
        break;
      default:
        break;
    }

    const result = await trigger(fieldsToValidate);
    if (result) {
      setCurrentSection((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 my-8"
      >
        <Helmet>
          <title>Survey Submitted Successfully</title>
        </Helmet>
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border-l-8 border-green-500 p-8 rounded-lg">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-6">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="h-10 w-10 text-green-500"
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
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-green-800">
                Thank You For Your Feedback!
              </h3>
              <div className="mt-4 text-green-700 space-y-2">
                <p>Your responses have been successfully recorded.</p>
                <p>
                  We value your input and will use it to improve our services.
                </p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate("/results")}
                  className="px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  View Survey Results
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentSection(0);
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg bg-white hover:bg-gray-50 shadow-sm hover:shadow-md transition-all"
                >
                  Submit Another Response
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6 my-8"
    >
      <Helmet>
        <title>Lifestyle Preferences Survey</title>
      </Helmet>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Lifestyle Preferences Survey
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Help us understand your preferences by completing this short survey.
          It should take about 2 minutes.
        </p>

        {/* Progress indicator */}
        <div className="mt-6 w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentSection + 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg"
        >
          <div className="flex items-center">
            <svg
              className="h-5 w-5 text-red-500 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Section 1: Personal Details */}
        {currentSection === 0 && (
          <motion.div
            variants={formVariants}
            className="space-y-8 bg-gray-50 p-6 rounded-xl border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                1
              </span>
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type="text"
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="John Doe"
                      />
                      {!errors.name && field.value && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type="email"
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="john@example.com"
                      />
                      {!errors.email && field.value && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Age */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Age <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="age"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type="number"
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === "" ? "" : Number(e.target.value)
                          )
                        }
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                          errors.age ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="25"
                        min="5"
                        max="120"
                      />
                      {!errors.age && field.value && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.age.message}
                  </p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="dob"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <input
                        {...field}
                        type="date"
                        className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                          errors.dob ? "border-red-500" : "border-gray-300"
                        }`}
                        max={new Date().toISOString().split("T")[0]}
                      />
                      {!errors.dob && field.value && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <svg
                            className="h-5 w-5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  )}
                />
                {errors.dob && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg
                      className="h-4 w-4 mr-1"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.dob.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <motion.button
                type="button"
                onClick={validateAndGoNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md"
              >
                Next: Food Preferences
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Section 2: Favorite Foods */}
        {currentSection === 1 && (
          <motion.div
            variants={formVariants}
            className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                2
              </span>
              Food Preferences
            </h2>

            <div>
              <p className="text-sm text-gray-600 mb-4">
                What is your favorite food? (Select 1-3 options){" "}
                <span className="text-red-500">*</span>
              </p>

              <Controller
                name="favoriteFoods"
                control={control}
                render={({ field }) => (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {foodOptions.map((food) => (
                        <motion.label
                          key={food.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`flex items-center p-4 rounded-lg border cursor-pointer transition-all ${
                            selectedFoods.includes(food.value)
                              ? "bg-blue-50 border-blue-500 shadow-inner"
                              : "border-gray-300 hover:border-blue-300"
                          } ${
                            selectedFoods.length >= 3 &&
                            !selectedFoods.includes(food.value)
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="hidden"
                            checked={selectedFoods.includes(food.value)}
                            onChange={(e) => {
                              if (
                                selectedFoods.length < 3 ||
                                !e.target.checked
                              ) {
                                const newValue = e.target.checked
                                  ? [...field.value, food.value]
                                  : field.value.filter(
                                      (val) => val !== food.value
                                    );
                                field.onChange(newValue);
                              }
                            }}
                            disabled={
                              selectedFoods.length >= 3 &&
                              !selectedFoods.includes(food.value)
                            }
                          />
                          <span className="flex items-center w-full">
                            <div
                              className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                                selectedFoods.includes(food.value)
                                  ? "bg-blue-500 border-blue-500"
                                  : "border-gray-400"
                              }`}
                            >
                              {selectedFoods.includes(food.value) && (
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
                            <span className="text-gray-700">
                              <span className="mr-2">{food.emoji}</span>
                              {food.value}
                            </span>
                          </span>
                        </motion.label>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      {selectedFoods.length}/3 selected
                    </div>
                    {errors.favoriteFoods && (
                      <p className="text-red-500 text-sm mt-2 flex items-center">
                        <svg
                          className="h-4 w-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {errors.favoriteFoods.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>

            <div className="flex justify-between pt-4">
              <motion.button
                type="button"
                onClick={() => setCurrentSection((prev) => prev - 1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm"
              >
                Back
              </motion.button>
              <motion.button
                type="button"
                onClick={validateAndGoNext}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-md"
              >
                Next: Activity Ratings
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* Section 3: Activity Ratings */}
        {currentSection === 2 && (
          <motion.div
            variants={formVariants}
            className="space-y-6 bg-gray-50 p-6 rounded-xl border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <span className="bg-blue-600 text-white rounded-full h-8 w-8 flex items-center justify-center mr-3">
                3
              </span>
              Activity Preferences
            </h2>

            <p className="text-sm text-gray-600 mb-4">
              On a scale of 1 to 5, please indicate how much you agree with each
              statement <span className="text-red-500">*</span>
            </p>

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
                        className={`px-2 py-2 text-center text-sm font-medium ${
                          rating === 1
                            ? "bg-red-50"
                            : rating === 5
                            ? "bg-green-50"
                            : "bg-gray-200"
                        }`}
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
                      <div className="flex items-center">
                        <span className="mr-2">🍽️</span>
                        <span>I like to eat out</span>
                      </div>
                      {errors.eatOutRating && (
                        <p className="text-red-500 text-xs font-normal mt-1 flex items-center">
                          <svg
                            className="h-3 w-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.eatOutRating.message}
                        </p>
                      )}
                    </td>
                    {ratingOptions.map((rating) => (
                      <td
                        key={`eatOut-${rating}`}
                        className={`px-2 py-4 text-center ${
                          rating === 1
                            ? "bg-red-50"
                            : rating === 5
                            ? "bg-green-50"
                            : "bg-white"
                        }`}
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
                      <div className="flex items-center">
                        <span className="mr-2">🎬</span>
                        <span>I like to watch movies</span>
                      </div>
                      {errors.watchMoviesRating && (
                        <p className="text-red-500 text-xs font-normal mt-1 flex items-center">
                          <svg
                            className="h-3 w-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.watchMoviesRating.message}
                        </p>
                      )}
                    </td>
                    {ratingOptions.map((rating) => (
                      <td
                        key={`movies-${rating}`}
                        className={`px-2 py-4 text-center ${
                          rating === 1
                            ? "bg-red-50"
                            : rating === 5
                            ? "bg-green-50"
                            : "bg-white"
                        }`}
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
                      <div className="flex items-center">
                        <span className="mr-2">📺</span>
                        <span>I like to watch TV</span>
                      </div>
                      {errors.watchTVRating && (
                        <p className="text-red-500 text-xs font-normal mt-1 flex items-center">
                          <svg
                            className="h-3 w-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.watchTVRating.message}
                        </p>
                      )}
                    </td>
                    {ratingOptions.map((rating) => (
                      <td
                        key={`tv-${rating}`}
                        className={`px-2 py-4 text-center ${
                          rating === 1
                            ? "bg-red-50"
                            : rating === 5
                            ? "bg-green-50"
                            : "bg-white"
                        }`}
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
                      <div className="flex items-center">
                        <span className="mr-2">📻</span>
                        <span>I like to listen to the radio</span>
                      </div>
                      {errors.listenToRadioRating && (
                        <p className="text-red-500 text-xs font-normal mt-1 flex items-center">
                          <svg
                            className="h-3 w-3 mr-1"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {errors.listenToRadioRating.message}
                        </p>
                      )}
                    </td>
                    {ratingOptions.map((rating) => (
                      <td
                        key={`radio-${rating}`}
                        className={`px-2 py-4 text-center ${
                          rating === 1
                            ? "bg-red-50"
                            : rating === 5
                            ? "bg-green-50"
                            : "bg-white"
                        }`}
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

            <div className="flex justify-between pt-4">
              <motion.button
                type="button"
                onClick={() => setCurrentSection((prev) => prev - 1)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm"
              >
                Back
              </motion.button>
              <div className="flex space-x-3">
                <motion.button
                  type="button"
                  onClick={() => {
                    setCurrentSection(0);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm"
                >
                  Review Answers
                </motion.button>
                <motion.button
                  type="submit"
                  disabled={isLoading || !isValid}
                  whileHover={{ scale: isValid ? 1.05 : 1 }}
                  whileTap={{ scale: isValid ? 0.98 : 1 }}
                  className={`px-6 py-3 text-white font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : isValid
                      ? "bg-gradient-to-r from-blue-600 to-green-600 hover:shadow-xl"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    "Submit Survey"
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </form>
    </motion.div>
  );
};

export default SurveyForm;
