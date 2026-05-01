const db = require("../src/db");

async function setup() {
  console.log("Setting up database tables...");

  try {
    // 1. users
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ users table ready");

    // 2. crime_categories
    await db.query(`
      CREATE TABLE IF NOT EXISTS crime_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        severity_weight INT DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ crime_categories table ready");

    // 3. crime_reports
    await db.query(`
      CREATE TABLE IF NOT EXISTS crime_reports (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        category_id INT NULL,
        type VARCHAR(255) NOT NULL,
        area VARCHAR(255) NOT NULL,
        division VARCHAR(255) NULL,
        district VARCHAR(255) NULL,
        latitude DECIMAL(10, 8) NULL,
        longitude DECIMAL(11, 8) NULL,
        severity VARCHAR(50) DEFAULT 'medium',
        description TEXT,
        source VARCHAR(50) DEFAULT 'user',
        status VARCHAR(50) DEFAULT 'pending',
        report_date DATE NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        FOREIGN KEY (category_id) REFERENCES crime_categories(id) ON DELETE SET NULL
      )
    `);
    console.log("✅ crime_reports table ready");

    // 4. sos_alerts
    await db.query(`
      CREATE TABLE IF NOT EXISTS sos_alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NULL,
        latitude DECIMAL(10, 8) NULL,
        longitude DECIMAL(11, 8) NULL,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ sos_alerts table ready");

    // 5. user_philanthropy
    await db.query(`
      CREATE TABLE IF NOT EXISTS user_philanthropy (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        title VARCHAR(180) NOT NULL,
        note TEXT NULL,
        points INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    console.log("✅ user_philanthropy table ready");

    console.log("🎉 Database setup complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to set up database:", error.message);
    process.exit(1);
  }
}

setup();
