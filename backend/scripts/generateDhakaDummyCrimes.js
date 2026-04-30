const db = require("../src/db");

const areas = [
  ["Dhanmondi", 23.7465, 90.376],
  ["Mirpur", 23.8103, 90.3654],
  ["Uttara", 23.8759, 90.3795],
  ["Gulshan", 23.7925, 90.4078],
  ["Banani", 23.7937, 90.4066],
  ["Mohammadpur", 23.764, 90.358],
  ["Motijheel", 23.7335, 90.417],
  ["Tejgaon", 23.7603, 90.3897],
  ["Farmgate", 23.757, 90.389],
  ["New Market", 23.7285, 90.385],
  ["Badda", 23.7806, 90.4255],
  ["Rampura", 23.7626, 90.4217],
  ["Jatrabari", 23.7104, 90.4348],
  ["Wari", 23.7119, 90.4117],
  ["Lalbagh", 23.7189, 90.3881],
  ["Paltan", 23.7361, 90.4143],
  ["Khilgaon", 23.7508, 90.4255],
  ["Bashundhara", 23.8151, 90.4263],
  ["Shyamoli", 23.7748, 90.3657],
  ["Malibagh", 23.7461, 90.4123],
];

const crimeTypes = [
  ["Theft", "medium", 1],
  ["Robbery", "high", 2],
  ["Harassment", "medium", 3],
  ["Assault", "high", 4],
  ["Fraud", "low", 5],
  ["Cyber Crime", "medium", 7],
  ["Drug Related", "medium", 8],
];

const descriptions = [
  "Phone snatching reported",
  "Suspicious activity reported",
  "Street harassment incident",
  "Robbery near main road",
  "Pickpocket incident",
  "Bike theft reported",
  "Shop theft reported",
  "Night time assault reported",
  "Crowded area crime reported",
  "User submitted safety report",
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomOffset() {
  return (Math.random() - 0.5) * 0.018;
}

function randomDate() {
  const start = new Date("2024-01-01").getTime();
  const end = new Date("2026-04-30").getTime();
  const date = new Date(start + Math.random() * (end - start));
  return date.toISOString().slice(0, 10);
}

async function generate() {
  const total = 10000;
  const batchSize = 500;
  let inserted = 0;

  console.log(`Generating ${total} Dhaka crime reports...`);

  for (let i = 0; i < total; i += batchSize) {
    const values = [];

    for (let j = 0; j < batchSize && inserted < total; j++) {
      const [area, lat, lng] = randomItem(areas);
      const [type, severity, categoryId] = randomItem(crimeTypes);

      values.push([
        null,
        categoryId,
        type,
        area,
        "Dhaka",
        "Dhaka",
        lat + randomOffset(),
        lng + randomOffset(),
        severity,
        randomItem(descriptions),
        "user",
        "verified",
        randomDate(),
      ]);

      inserted++;
    }

    await db.query(
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
      VALUES ?
      `,
      [values]
    );

    console.log(`Inserted ${inserted}/${total}`);
  }

  console.log("Done. 10,000 dummy Dhaka crimes inserted.");
  process.exit(0);
}

generate().catch((error) => {
  console.error(error);
  process.exit(1);
});