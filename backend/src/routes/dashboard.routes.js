const router = require("express").Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [[total]] = await db.query(`
      SELECT COUNT(*) AS totalCrimes FROM crime_reports
    `);

    const [byCategory] = await db.query(`
      SELECT type, COUNT(*) AS total
      FROM crime_reports
      GROUP BY type
      ORDER BY total DESC
      LIMIT 10
    `);

    const [byArea] = await db.query(`
      SELECT 
        area,
        COUNT(*) AS total,
        SUM(
          CASE 
            WHEN severity = 'high' THEN 15
            WHEN severity = 'medium' THEN 8
            ELSE 3
          END
        ) AS riskScore
      FROM crime_reports
      GROUP BY area
      ORDER BY riskScore DESC
      LIMIT 10
    `);

    const [weeklyTrend] = await db.query(`
      SELECT 
        DATE(created_at) AS date,
        COUNT(*) AS total
      FROM crime_reports
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);

    const highRiskAreas = byArea.filter((item) => Number(item.riskScore) >= 70).length;
    const safeAreas = byArea.filter((item) => Number(item.riskScore) < 40).length;

    res.json({
      totalCrimes: total.totalCrimes,
      highRiskAreas,
      safeAreas,
      byCategory,
      byArea,
      weeklyTrend,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch dashboard",
      error: error.message,
    });
  }
});

module.exports = router;