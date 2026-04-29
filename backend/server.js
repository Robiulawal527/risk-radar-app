const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./src/routes/auth.routes");
const crimeRoutes = require("./src/routes/crime.routes");
const alertRoutes = require("./src/routes/alert.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/crimes", crimeRoutes);
app.use("/api/alerts", alertRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Risk Radar API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});