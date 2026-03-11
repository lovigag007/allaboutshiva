require('dotenv').config();
const mysql2 = require('mysql2/promise');

async function setupDatabase() {
  const connection = await mysql2.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true
  });

  console.log('Connected to MySQL server.');

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'shiva_db'}\``);
  await connection.query(`USE \`${process.env.DB_NAME || 'shiva_db'}\``);
  console.log(`Database "${process.env.DB_NAME || 'shiva_db'}" ready.`);

  // ── Admin Users ──────────────────────────────────────────────────────────────
  await connection.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      email       VARCHAR(255) NOT NULL UNIQUE,
      password    VARCHAR(255) NOT NULL,
      name        VARCHAR(100) NOT NULL,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // ── Names ────────────────────────────────────────────────────────────────────
  await connection.query(`
    CREATE TABLE IF NOT EXISTS names (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(200) NOT NULL,
      language    VARCHAR(50)  NOT NULL DEFAULT 'Sanskrit',
      meaning     TEXT         NOT NULL,
      story       LONGTEXT,
      is_featured TINYINT(1)   NOT NULL DEFAULT 0,
      sort_order  INT          NOT NULL DEFAULT 0,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // ── Mantras ──────────────────────────────────────────────────────────────────
  await connection.query(`
    CREATE TABLE IF NOT EXISTS mantras (
      id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title           VARCHAR(300) NOT NULL,
      text_sanskrit   LONGTEXT     NOT NULL,
      text_english    LONGTEXT     NOT NULL,
      meaning         LONGTEXT     NOT NULL,
      source          VARCHAR(300),
      story           LONGTEXT,
      is_featured     TINYINT(1)   NOT NULL DEFAULT 0,
      sort_order      INT          NOT NULL DEFAULT 0,
      created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // ── Vedas ────────────────────────────────────────────────────────────────────
  await connection.query(`
    CREATE TABLE IF NOT EXISTS vedas (
      id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name            VARCHAR(100) NOT NULL UNIQUE,
      meaning         TEXT         NOT NULL,
      timeline        TEXT         NOT NULL,
      description     LONGTEXT,
      sort_order      INT          NOT NULL DEFAULT 0,
      created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS veda_incidents (
      id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      veda_id    INT UNSIGNED NOT NULL,
      title      VARCHAR(300) NOT NULL,
      content    LONGTEXT     NOT NULL,
      type       ENUM('incident','story') NOT NULL DEFAULT 'incident',
      sort_order INT          NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT fk_incident_veda FOREIGN KEY (veda_id) REFERENCES vedas(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // ── Stotras ──────────────────────────────────────────────────────────────────
  await connection.query(`
    CREATE TABLE IF NOT EXISTS stotras (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      title       VARCHAR(300) NOT NULL,
      text        LONGTEXT     NOT NULL,
      meaning     LONGTEXT     NOT NULL,
      written_by  VARCHAR(200),
      story       LONGTEXT,
      is_featured TINYINT(1)   NOT NULL DEFAULT 0,
      sort_order  INT          NOT NULL DEFAULT 0,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // ── Events ───────────────────────────────────────────────────────────────────
  await connection.query(`
    CREATE TABLE IF NOT EXISTS events (
      id           INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      event_name   VARCHAR(300) NOT NULL,
      event_date   DATE         NOT NULL,
      day_name     VARCHAR(100),
      mahurat_time VARCHAR(100),
      description  TEXT,
      is_active    TINYINT(1)   NOT NULL DEFAULT 1,
      sort_order   INT          NOT NULL DEFAULT 0,
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // ── Ornaments / Body Items ────────────────────────────────────────────────────
  await connection.query(`
    CREATE TABLE IF NOT EXISTS ornaments (
      id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(200) NOT NULL,
      body_part   VARCHAR(100) NOT NULL,
      meaning     TEXT         NOT NULL,
      story       LONGTEXT,
      sort_order  INT          NOT NULL DEFAULT 0,
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  // ── Static Pages ─────────────────────────────────────────────────────────────
  await connection.query(`
    CREATE TABLE IF NOT EXISTS pages (
      id         INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      slug       VARCHAR(200) NOT NULL UNIQUE,
      title      VARCHAR(300) NOT NULL,
      content    LONGTEXT,
      is_active  TINYINT(1)   NOT NULL DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('All tables created successfully.');
  await connection.end();
}

setupDatabase().catch(err => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
