const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const db = require("../src/db");

const csvPath = path.join(__dirname, "../data/crime-data.csv");

function pick(row, keys, fallback = null) {
  for (const key of keys) {
    if (row[key] !== undefined && row[key] !== null && String(row[key]).trim() !== "") {
      return String(row[key]).trim();
    }
  }

  return fallback;
}

function normalizeSeverity(value) {
  const text = String(value || "").toLowerCase();

  if (text.includes("high") || text.includes("murder") || text.includes("robbery")) {
    return "high";
  }

  if (text.includes("medium") || text.includes("assault") || text.includes("harassment")) {
    return "medium";
  }

  return "low";
}

async function getOrCreateCategory(type, severity) {
  const [rows] = await db.query("SELECT id FROM crime_categories WHERE name = ?", [type]);

  if (rows.length > 0) {
    return rows[0].id;
  }

  const weight = severity === "high" ? 5 : severity === "medium" ? 3 : 1;

  const [result] = await db.query(
    "INSERT INTO crime_categories (name, severity_weight) VALUES (?, ?)",
    [type, weight]
  );

  return result.insertId;
}

async function importCsv() {
  const rows = [];

  if (!fs.existsSync(csvPath)) {
    console.error("CSV file not found:", csvPath);
    process.exit(1);
  }

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on("data", (row) => rows.push(row))
    .on("end", async () => {
      console.log(`Found ${rows.length} CSV rows`);

      let inserted = 0;

      for (const row of rows) {
        const type = pick(row, [
          "type",
          "Type",
          "crime_type",
          "Crime Type",
          "Crime",
          "crime",
          "Category",
          "category",
        ], "Unknown");

        const area = pick(row, [
          "area",
          "Area",
          "Location",
          "location",
          "Thana",
          "thana",
          "Police Station",
          "District",
          "district",
        ], "Unknown Area");

        const division = pick(row, ["Division", "division"], null);
        const district = pick(row, ["District", "district", "City", "city"], null);

        const latitudeValue = pick(row, ["latitude", "Latitude", "lat", "Lat"], null);
        const longitudeValue = pick(row, ["longitude", "Longitude", "lng", "Lng", "lon", "Lon"], null);

        const latitude = latitudeValue ? Number(latitudeValue) : null;
        const longitude = longitudeValue ? Number(longitudeValue) : null;

        const severity = normalizeSeverity(
          pick(row, ["severity", "Severity", "type", "Type", "Crime Type", "crime_type"], type)
        );

        const description = pick(row, [
          "description",
          "Description",
          "details",
          "Details",
          "Remarks",
          "remarks",
        ], `Imported ${type} report from CSV`);

        const reportDate = pick(row, [
          "date",
          "Date",
          "report_date",
          "Report Date",
          "Year",
          "year",
        ], null);

        const categoryId = await getOrCreateCategory(type, severity);

        await db.query(
          `
          INSERT INTO crime_reports
          (
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
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'csv', 'verified', ?)
          `,
          [
            categoryId,
            type,
            area,
            division,
            district,
            Number.isFinite(latitude) ? latitude : null,
            Number.isFinite(longitude) ? longitude : null,
            severity,
            description,
            reportDate && reportDate.length === 4 ? `${reportDate}-01-01` : null,
          ]
        );

        inserted += 1;
      }

      console.log(`Imported ${inserted} rows into MySQL`);
      process.exit(0);
    });
}

importCsv();