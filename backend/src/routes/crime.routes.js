const router = require("express").Router();
const db = require("../db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM crimes ORDER BY created_at DESC");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch crimes", error });
  }
});

router.post("/", async (req, res) => {
  try {
    const { type, area, latitude, longitude, severity, description } = req.body;

    await db.query(
      `INSERT INTO crimes 
      (type, area, latitude, longitude, severity, description) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [type, area, latitude, longitude, severity, description]
    );

    res.json({ message: "Crime report submitted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit crime", error });
  }
});

router.get("/area/:area", async (req, res) => {
  try {
    const area = req.params.area;

    const [rows] = await db.query("SELECT * FROM crimes WHERE area = ?", [
      area,
    ]);

    const riskScore = Math.min(100, rows.length * 12);

    let riskLevel = "Low Risk";

    if (riskScore >= 70) riskLevel = "High Risk";
    else if (riskScore >= 40) riskLevel = "Medium Risk";

    res.json({
      area,
      riskScore,
      riskLevel,
      crimes: rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch area data", error });
  }
});

module.exports = router;