const router = require("express").Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [highRiskAreas] = await db.query(`
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
      HAVING riskScore >= 70
      ORDER BY riskScore DESC
      LIMIT 10
    `);

    const alerts = highRiskAreas.map((item, index) => ({
      id: index + 1,
      title: "High Risk Alert",
      body: `High crime activity detected in ${item.area}`,
      area: item.area,
      type: "danger",
      riskScore: Math.min(100, Number(item.riskScore)),
    }));

    res.json(alerts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch alerts",
      error: error.message,
    });
  }
});

module.exports = router;