const router = require("express").Router();

router.get("/", (req, res) => {
  res.json([
    {
      id: 1,
      title: "High Risk Alert",
      body: "You have entered a high-risk zone",
      area: "Dhanmondi",
      type: "danger",
      time: "2 mins ago",
    },
    {
      id: 2,
      title: "Crowd Alert",
      body: "Large crowd detected nearby",
      area: "New Market",
      type: "warning",
      time: "15 mins ago",
    },
    {
      id: 3,
      title: "Safety Update",
      body: "Risk level improved in Gulshan",
      area: "Gulshan",
      type: "success",
      time: "30 mins ago",
    },
  ]);
});

module.exports = router;