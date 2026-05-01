const router = require("express").Router();
const db = require("../db");

router.post("/", async (req, res) => {
  try {
    const { user_id = null, latitude = null, longitude = null } = req.body;

    const [result] = await db.query(
      `
      INSERT INTO sos_alerts (user_id, latitude, longitude, status)
      VALUES (?, ?, ?, 'active')
      `,
      [user_id, latitude, longitude]
    );

    const [rows] = await db.query("SELECT * FROM sos_alerts WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json({
      message: "SOS alert sent to emergency contacts and authorities.",
      alert: rows[0],
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send SOS alert",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM sos_alerts ORDER BY created_at DESC LIMIT 100"
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch SOS alerts",
      error: error.message,
    });
  }
});

module.exports = router;
