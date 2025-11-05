const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// POST /api/surveys
exports.createSurvey = async (req, res) => {
  const {
    name,
    email,
    age,
    dob,
    favoriteFoods,
    eatOutRating,
    watchMoviesRating,
    watchTVRating,
    listenToRadioRating,
  } = req.body;

  if (
    !name ||
    !email ||
    !age ||
    !dob ||
    !favoriteFoods ||
    !eatOutRating ||
    !watchMoviesRating ||
    !watchTVRating ||
    !listenToRadioRating
  ) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const existing = await prisma.survey.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({
        error: "This email has already been used to submit a survey.",
      });
    }

    const newSurvey = await prisma.survey.create({
      data: {
        name,
        email,
        age,
        dob,
        favoriteFoods: Array.isArray(favoriteFoods)
          ? favoriteFoods.join(", ")
          : favoriteFoods,
        eatOutRating,
        watchMoviesRating,
        watchTVRating,
        listenToRadioRating,
      },
    });

    return res.status(200).json({
      message: "Survey submitted successfully",
      id: newSurvey.id,
    });
  } catch (error) {
    console.error("Error saving survey:", error);
    res.status(500).json({ error: "Failed to save survey" });
  }
};

// GET /api/results
exports.getResults = async (req, res) => {
  try {
    const total = await prisma.survey.count();
    if (total === 0)
      return res.json({ total: 0, message: "No surveys available yet" });

    const all = await prisma.survey.findMany();

    // Compute stats in JS
    const ages = all.map((s) => s.age);
    const avgAge = ages.reduce((a, b) => a + b, 0) / total;
    const minAge = Math.min(...ages);
    const maxAge = Math.max(...ages);

    const ageDistribution = {
      under18: all.filter((s) => s.age <= 18).length,
      age19to30: all.filter((s) => s.age >= 19 && s.age <= 30).length,
      age31to45: all.filter((s) => s.age >= 31 && s.age <= 45).length,
      over45: all.filter((s) => s.age > 45).length,
    };

    const foodCounts = {
      pizza: all.filter((s) => s.favoriteFoods.includes("Pizza")).length,
      pasta: all.filter((s) => s.favoriteFoods.includes("Pasta")).length,
      papAndWors: all.filter((s) => s.favoriteFoods.includes("Pap and Wors"))
        .length,
    };

    const ratings = {
      eatOut: all.map((s) => s.eatOutRating),
      movies: all.map((s) => s.watchMoviesRating),
      tv: all.map((s) => s.watchTVRating),
      radio: all.map((s) => s.listenToRadioRating),
    };

    const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
    const stdDev = (arr) => {
      const mean = avg(arr);
      return Math.sqrt(avg(arr.map((v) => (v - mean) ** 2)));
    };

    const ratingDistributions = {
      eatOut: avg(ratings.eatOut),
      movies: avg(ratings.movies),
      tv: avg(ratings.tv),
      radio: avg(ratings.radio),
      eatOutStdDev: stdDev(ratings.eatOut),
      moviesStdDev: stdDev(ratings.movies),
      tvStdDev: stdDev(ratings.tv),
      radioStdDev: stdDev(ratings.radio),
    };

    const recentSubmissions = await prisma.survey.findMany({
      orderBy: { submissionDate: "desc" },
      take: 5,
      select: { name: true, age: true, submissionDate: true },
    });

    return res.json({
      total,
      avgAge,
      minAge,
      maxAge,
      uniqueEmails: total,
      ageDistribution,
      foodPreferences: foodCounts,
      ratingDistributions,
      recentSubmissions,
    });
  } catch (error) {
    console.error("Error fetching results:", error);
    res.status(500).json({ error: "Failed to generate survey results" });
  }
};

// GET /api/health
exports.healthCheck = async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "healthy", database: "connected" });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", error: error.message });
  }
};
