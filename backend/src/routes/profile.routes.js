const router = require("express").Router();
const db = require("../db");

let initialized = false;

async function ensureTables() {
  if (initialized) return;
  await db.query(`
    CREATE TABLE IF NOT EXISTS user_philanthropy (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(180) NOT NULL,
      note TEXT NULL,
      points INT NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  initialized = true;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function personalityType(crimeScore, philanthropyScore, reputationScore) {
  if (crimeScore >= 70) return "High-Risk Profile";
  if (philanthropyScore >= 75 && crimeScore <= 20) return "Trusted Guardian";
  if (philanthropyScore >= 60 && reputationScore >= 70) return "Community Builder";
  if (crimeScore <= 30 && philanthropyScore >= 35) return "Reliable Citizen";
  if (crimeScore <= 35) return "Cautious Neutral";
  return "Under Observation";
}

async function getProfileScore(userId) {
  await ensureTables();

  const [users] = await db.query(
    `SELECT id, name, email, role FROM users WHERE id = ? LIMIT 1`,
    [userId]
  );
  const user = users[0];
  if (!user) return null;

  const [crimeRows] = await db.query(
    `
    SELECT
      COUNT(*) AS reportCount,
      SUM(
        CASE
          WHEN severity = 'high' THEN 20
          WHEN severity = 'medium' THEN 12
          ELSE 6
        END
      ) AS penalty
    FROM crime_reports
    WHERE user_id = ?
    `,
    [userId]
  );

  const [philanthropyRows] = await db.query(
    `
    SELECT
      COUNT(*) AS contributionCount,
      COALESCE(SUM(points), 0) AS points
    FROM user_philanthropy
    WHERE user_id = ?
    `,
    [userId]
  );

  const crimePenalty = Number(crimeRows[0]?.penalty || 0);
  const crimeReportCount = Number(crimeRows[0]?.reportCount || 0);
  const philanthropyPoints = Number(philanthropyRows[0]?.points || 0);
  const philanthropyCount = Number(philanthropyRows[0]?.contributionCount || 0);

  const crimeScore = clamp(Math.round(crimePenalty / 2), 0, 100);
  const philanthropyScore = clamp(Math.round(philanthropyPoints / 2), 0, 100);
  const reputationScore = clamp(
    Math.round(50 + philanthropyScore * 0.7 - crimeScore * 0.8),
    0,
    100
  );
  const profileScore = clamp(
    Math.round(500 + philanthropyPoints * 6 - crimePenalty * 4),
    0,
    1000
  );

  return {
    user,
    scores: {
      profileScore,
      reputationScore,
      crimeScore,
      philanthropyScore,
      crimeReportCount,
      philanthropyCount,
      crimePenalty,
      philanthropyPoints,
      personalityType: personalityType(crimeScore, philanthropyScore, reputationScore),
    },
  };
}

router.get("/me/:userId", async (req, res) => {
  try {
    const result = await getProfileScore(Number(req.params.userId));
    if (!result) return res.status(404).json({ message: "User not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to load profile score", error: error.message });
  }
});

router.get("/rankings/all", async (req, res) => {
  try {
    await ensureTables();
    const [users] = await db.query(`SELECT id FROM users`);
    const profiles = [];
    for (const row of users) {
      const profile = await getProfileScore(row.id);
      if (profile) profiles.push(profile);
    }

    const topProfile = [...profiles]
      .sort((a, b) => b.scores.profileScore - a.scores.profileScore)
      .slice(0, 20);

    const topCrime = [...profiles]
      .sort((a, b) => b.scores.crimeScore - a.scores.crimeScore)
      .slice(0, 20);

    const topPhilanthropy = [...profiles]
      .sort((a, b) => b.scores.philanthropyScore - a.scores.philanthropyScore)
      .slice(0, 20);

    res.json({
      topProfile,
      topCrime,
      topPhilanthropy,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to load profile rankings", error: error.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const result = await getProfileScore(Number(req.params.userId));
    if (!result) return res.status(404).json({ message: "User not found" });
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to load public profile", error: error.message });
  }
});

router.post("/philanthropy", async (req, res) => {
  try {
    await ensureTables();
    const { user_id, title, note = "", points = 10 } = req.body;
    if (!user_id || !title) {
      return res.status(400).json({ message: "user_id and title are required" });
    }
    const sanitizedPoints = clamp(Number(points || 0), 1, 100);
    const [result] = await db.query(
      `
      INSERT INTO user_philanthropy (user_id, title, note, points)
      VALUES (?, ?, ?, ?)
      `,
      [user_id, title, note, sanitizedPoints]
    );

    res.json({
      message: "Philanthropy contribution recorded",
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to add philanthropy entry", error: error.message });
  }
});

module.exports = router;
