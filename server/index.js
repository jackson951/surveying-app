const express = require("express");
const cors = require("cors");
const surveyRoutes = require("./routes/surveyRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", surveyRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
