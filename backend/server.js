const express = require("express");
const cors = require("cors");
require("dotenv").config();

const crimeRoutes = require("./src/routes/crime.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const alertRoutes = require("./src/routes/alert.routes");
const authRoutes = require("./src/routes/auth.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Risk Radar MySQL API running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/crimes", crimeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/alerts", alertRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Risk Radar backend running on port ${PORT}`);
});


// Add near your other route imports in backend/server.js:
const predictionRoutes = require('./src/routes/prediction.routes');

// Add near your other app.use lines in backend/server.js:
app.use('/api/prediction', predictionRoutes);
