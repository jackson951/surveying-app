const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// Database setup
let db;
try {
  const dbPath = path.join(__dirname, 'survey.db');
  const dir = path.dirname(dbPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  db = new Database(dbPath);
  db.pragma('foreign_keys = ON');
  console.log('Database connected successfully');
} catch (err) {
  console.error('Database connection failed:', err);
  process.exit(1);
}

// Create table if it doesn't exist
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS surveys (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      age INTEGER NOT NULL CHECK(age >= 5 AND age <= 120),
      dob TEXT NOT NULL,
      favoriteFoods TEXT NOT NULL,
      eatOutRating INTEGER NOT NULL CHECK(eatOutRating >= 1 AND eatOutRating <= 5),
      watchMoviesRating INTEGER NOT NULL CHECK(watchMoviesRating >= 1 AND watchMoviesRating <= 5),
      watchTVRating INTEGER NOT NULL CHECK(watchTVRating >= 1 AND watchTVRating <= 5),
      listenToRadioRating INTEGER NOT NULL CHECK(listenToRadioRating >= 1 AND listenToRadioRating <= 5),
      submissionDate TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('Table created/verified');
} catch (err) {
  console.error('Table creation failed:', err);
  process.exit(1);
}

// POST /api/surveys
app.post('/api/surveys', (req, res) => {
  const {
    name,
    email,
    age,
    dob,
    favoriteFoods,
    eatOutRating,
    watchMoviesRating,
    watchTVRating,
    listenToRadioRating
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
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO surveys (
        name, email, age, dob, favoriteFoods,
        eatOutRating, watchMoviesRating, watchTVRating, listenToRadioRating
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      email,
      age,
      dob,
      Array.isArray(favoriteFoods) ? favoriteFoods.join(', ') : favoriteFoods,
      eatOutRating,
      watchMoviesRating,
      watchTVRating,
      listenToRadioRating
    );

    return res.status(201).json({
      message: 'Survey submitted successfully',
      id: result.lastInsertRowid
    });
  } catch (error) {
    console.error('Error saving survey:', error);
    return res.status(500).json({ error: 'Failed to save survey' });
  }
});

// GET /api/results
app.get('/api/results', (req, res) => {
  try {
    // Check if table exists
    const tableExists = db.prepare(`SELECT 1 FROM sqlite_master WHERE type='table' AND name='surveys'`).get();
    if (!tableExists) {
      return res.json({ total: 0, message: 'Survey table not initialized' });
    }

    const total = db.prepare('SELECT COUNT(*) FROM surveys').pluck().get() || 0;
    if (total === 0) {
      return res.json({ total: 0, message: 'No surveys available yet' });
    }

    const results = db.transaction(() => {
      const demographics = db.prepare(`
        SELECT AVG(age) as avgAge, MIN(age) as minAge, MAX(age) as maxAge FROM surveys
      `).get();

      const pizzaCount = db.prepare("SELECT SUM(CASE WHEN favoriteFoods LIKE ? THEN 1 ELSE 0 END) FROM surveys")
        .pluck()
        .get("%Pizza%");

      const pastaCount = db.prepare("SELECT SUM(CASE WHEN favoriteFoods LIKE ? THEN 1 ELSE 0 END) FROM surveys")
        .pluck()
        .get("%Pasta%");

      const papAndWorsCount = db.prepare("SELECT SUM(CASE WHEN favoriteFoods LIKE ? THEN 1 ELSE 0 END) FROM surveys")
        .pluck()
        .get("%Pap and Wors%");

      const avgRatings = db.prepare(`
        SELECT
          AVG(eatOutRating) as eatOut,
          AVG(watchMoviesRating) as movies,
          AVG(watchTVRating) as tv,
          AVG(listenToRadioRating) as radio
        FROM surveys
      `).get();

      return {
        demographics,
        foodCounts: {
          pizza: pizzaCount || 0,
          pasta: pastaCount || 0,
          papAndWors: papAndWorsCount || 0
        },
        avgRatings
      };
    })();

    return res.json({
      total,
      avgAge: results.demographics.avgAge,
      minAge: results.demographics.minAge,
      maxAge: results.demographics.maxAge,
      foodPreferences: {
        pizza: (results.foodCounts.pizza / total) * 100 || 0,
        pasta: (results.foodCounts.pasta / total) * 100 || 0,
        papAndWors: (results.foodCounts.papAndWors / total) * 100 || 0
      },
      averageRatings: {
        eatOut: results.avgRatings.eatOut || 0,
        movies: results.avgRatings.movies || 0,
        tv: results.avgRatings.tv || 0,
        radio: results.avgRatings.radio || 0
      }
    });
  } catch (error) {
    console.error('Error in /api/results:', error);
    return res.status(500).json({ error: 'Failed to generate survey results' });
  }
});

// GET /api/health
app.get('/api/health', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', error: error.message });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Available endpoints:
  - GET /api/health
  - GET /api/results
  - POST /api/surveys`);
});