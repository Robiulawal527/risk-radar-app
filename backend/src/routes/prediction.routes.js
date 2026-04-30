const router = require('express').Router();
const db = require('../db');

function riskLevel(score) {
  if (score >= 70) return 'High Risk';
  if (score >= 40) return 'Medium Risk';
  return 'Low Risk';
}

function predictionMessage(area, currentRisk, predictedRisk) {
  if (predictedRisk >= currentRisk + 8) {
    return `Risk may increase in ${area} during the next 24 hours. Avoid late-night travel and prefer safer roads.`;
  }
  if (predictedRisk >= 70) {
    return `${area} is expected to remain high risk. Stay alert and avoid isolated routes.`;
  }
  if (predictedRisk >= 40) {
    return `${area} is expected to remain moderately risky. Travel with awareness.`;
  }
  return `${area} is currently forecast as relatively safer compared with other zones.`;
}

async function areaRisk(area) {
  const [rows] = await db.query(
    `
    SELECT
      COUNT(*) AS total,
      SUM(CASE WHEN severity = 'high' THEN 15 WHEN severity = 'medium' THEN 8 ELSE 3 END) AS weightedRisk,
      SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) THEN 1 ELSE 0 END) AS recentReports,
      SUM(CASE WHEN severity = 'high' THEN 1 ELSE 0 END) AS highSeverity
    FROM crime_reports
    WHERE area LIKE ?
    `,
    [`%${area}%`]
  );

  const data = rows[0] || {};
  const weighted = Number(data.weightedRisk || 0);
  const total = Number(data.total || 0);
  const recent = Number(data.recentReports || 0);
  const highSeverity = Number(data.highSeverity || 0);

  const currentRisk = Math.min(100, weighted);
  const recentBoost = Math.min(18, recent * 2.4);
  const severityBoost = Math.min(16, highSeverity * 1.5);
  const volumeBoost = Math.min(12, total / 40);
  const predictedRisk = Math.min(100, Math.round(currentRisk * 0.72 + recentBoost + severityBoost + volumeBoost));
  const confidence = Math.min(92, Math.max(48, Math.round(55 + Math.min(25, total / 25) + Math.min(12, recent * 1.8))));

  return {
    area,
    totalReports: total,
    currentRisk,
    predictedRisk,
    riskLevel: riskLevel(predictedRisk),
    confidence,
    prediction: predictionMessage(area, currentRisk, predictedRisk),
  };
}

router.get('/area/:area', async (req, res) => {
  try {
    const result = await areaRisk(req.params.area);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: 'Prediction failed', error: error.message });
  }
});

router.get('/overview', async (req, res) => {
  try {
    const [areas] = await db.query(
      `
      SELECT area
      FROM crime_reports
      GROUP BY area
      ORDER BY SUM(CASE WHEN severity = 'high' THEN 15 WHEN severity = 'medium' THEN 8 ELSE 3 END) DESC
      LIMIT 10
      `
    );

    const topAreas = [];
    for (const row of areas) {
      topAreas.push(await areaRisk(row.area));
    }

    const predictedRisk = topAreas.length
      ? Math.round(topAreas.reduce((sum, item) => sum + item.predictedRisk, 0) / topAreas.length)
      : 0;

    const confidence = topAreas.length
      ? Math.round(topAreas.reduce((sum, item) => sum + item.confidence, 0) / topAreas.length)
      : 0;

    res.json({
      city: 'Dhaka',
      predictedRisk,
      confidence,
      riskLevel: riskLevel(predictedRisk),
      message:
        predictedRisk >= 70
          ? 'Dhaka city risk is forecast to remain elevated. Prioritize safer routes and avoid high-risk hotspots.'
          : predictedRisk >= 40
            ? 'Dhaka city risk is moderate. Continue monitoring alerts before travel.'
            : 'Dhaka city risk is currently forecast as manageable.',
      topAreas: topAreas.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: 'Prediction overview failed', error: error.message });
  }
});

module.exports = router;
