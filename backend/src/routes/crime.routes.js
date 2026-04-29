const router = require("express").Router();
const db = require("../db");

function getRiskLevel(score) {
  if (score >= 70) return "High Risk";
  if (score >= 40) return "Medium Risk";
  return "Low Risk";
}

function severityScore(severity) {
  if (severity === "high") return 15;
  if (severity === "medium") return 8;
  return 3;
}

router.get("/", async (req, res) => {
  try {
    const { area, type, severity } = req.query;

    let sql = `
      SELECT 
        cr.*,
        cc.name AS category_name
      FROM crime_reports cr
      LEFT JOIN crime_categories cc ON cr.category_id = cc.id
      WHERE 1 = 1
    `;

    const params = [];

    if (area) {
      sql += " AND cr.area LIKE ?";
      params.push(`%${area}%`);
    }

    if (type) {
      sql += " AND cr.type LIKE ?";
      params.push(`%${type}%`);
    }

    if (severity) {
      sql += " AND cr.severity = ?";
      params.push(severity);
    }

    sql += " ORDER BY cr.created_at DESC LIMIT 500";

    const [rows] = await db.query(sql, params);

    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch crimes",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      user_id = null,
      type,
      area,
      division = null,
      district = null,
      latitude = null,
      longitude = null,
      severity = "medium",
      description = "",
      report_date = null,
    } = req.body;

    if (!type || !area) {
      return res.status(400).json({
        message: "Crime type and area are required",
      });
    }

    let [categoryRows] = await db.query(
      "SELECT id FROM crime_categories WHERE name = ?",
      [type]
    );

    let categoryId = categoryRows[0]?.id || null;

    if (!categoryId) {
      const [newCategory] = await db.query(
        "INSERT INTO crime_categories (name, severity_weight) VALUES (?, ?)",
        [type, severity === "high" ? 5 : severity === "medium" ? 3 : 1]
      );

      categoryId = newCategory.insertId;
    }

    const [result] = await db.query(
      `
      INSERT INTO crime_reports
      (
        user_id,
        category_id,
        type,
        area,
        division,
        district,
        latitude,
        longitude,
        severity,
        description,
        source,
        status,
        report_date
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'user', 'pending', ?)
      `,
      [
        user_id,
        categoryId,
        type,
        area,
        division,
        district,
        latitude,
        longitude,
        severity,
        description,
        report_date,
      ]
    );

    res.json({
      message: "Crime report stored successfully",
      reportId: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to store crime report",
      error: error.message,
    });
  }
});

router.get("/area/:area", async (req, res) => {
  try {
    const area = req.params.area;

    const [rows] = await db.query(
      `
      SELECT *
      FROM crime_reports
      WHERE area LIKE ?
      ORDER BY created_at DESC
      `,
      [`%${area}%`]
    );

    const rawScore = rows.reduce((sum, item) => {
      return sum + severityScore(item.severity);
    }, 0);

    const riskScore = Math.min(100, rawScore);

    res.json({
      area,
      riskScore,
      riskLevel: getRiskLevel(riskScore),
      totalReports: rows.length,
      recentCrimes: rows.slice(0, 10),
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch area risk",
      error: error.message,
    });
  }
});

router.get("/heatmap", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        area,
        AVG(latitude) AS latitude,
        AVG(longitude) AS longitude,
        COUNT(*) AS total,
        SUM(
          CASE 
            WHEN severity = 'high' THEN 15
            WHEN severity = 'medium' THEN 8
            ELSE 3
          END
        ) AS score
      FROM crime_reports
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      GROUP BY area
      ORDER BY score DESC
    `);

    const heatmap = rows.map((row) => {
      const riskScore = Math.min(100, Number(row.score));

      return {
        area: row.area,
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        total: Number(row.total),
        riskScore,
        riskLevel: getRiskLevel(riskScore),
      };
    });

    res.json(heatmap);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch heatmap",
      error: error.message,
    });
  }
});

router.get("/ranking/safety", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        area,
        COUNT(*) AS total,
        SUM(
          CASE 
            WHEN severity = 'high' THEN 15
            WHEN severity = 'medium' THEN 8
            ELSE 3
          END
        ) AS risk_score
      FROM crime_reports
      GROUP BY area
      ORDER BY risk_score ASC
      LIMIT 20
    `);

    const result = rows.map((row) => {
      const riskScore = Math.min(100, Number(row.risk_score));
      return {
        area: row.area,
        totalReports: Number(row.total),
        riskScore,
        safetyScore: Math.max(0, 100 - riskScore),
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch ranking",
      error: error.message,
    });
  }
});

module.exports = router;