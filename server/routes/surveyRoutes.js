const express = require("express");
const router = express.Router();
const {
  createSurvey,
  getResults,
  healthCheck,
} = require("../controllers/surveyController");

router.post("/surveys", createSurvey);
router.get("/results", getResults);
router.get("/health", healthCheck);

module.exports = router;
