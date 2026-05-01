const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const crimeRoutes = require("./src/routes/crime.routes");
const dashboardRoutes = require("./src/routes/dashboard.routes");
const alertRoutes = require("./src/routes/alert.routes");
const authRoutes = require("./src/routes/auth.routes");
const sosRoutes = require("./src/routes/sos.routes");
const predictionRoutes = require("./src/routes/prediction.routes");
const profileRoutes = require("./src/routes/profile.routes");

const app = express();

app.disable("x-powered-by");
app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);
app.use(compression());
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1200,
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.json({
    message: "Risk Radar MySQL API running",
  });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/crimes", crimeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/sos", sosRoutes);
app.use("/api/prediction", predictionRoutes);
app.use("/api/profiles", profileRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Risk Radar backend running on port ${PORT}`);
});
