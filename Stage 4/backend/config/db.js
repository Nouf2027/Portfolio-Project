const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const createTables = async () => {
  try {
    await pool.query(`DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('parent', 'admin', 'center');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;`);

    await pool.query(`DO $$ BEGIN
      CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;`);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role user_role DEFAULT 'parent',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS centers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        approved BOOLEAN DEFAULT FALSE,
        owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        license VARCHAR(255),
        latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        description TEXT,
        instructor VARCHAR(150),
        age_range VARCHAR(50),
        price DECIMAL(10, 2) NOT NULL,
        duration VARCHAR(100),
        days VARCHAR(150),
        times VARCHAR(100),
        center_id INTEGER REFERENCES centers(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        date TIMESTAMP NOT NULL,
        status booking_status DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        centre_id INTEGER REFERENCES centers(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);

    // إضافة الأعمدة الناقصة في حال كان الجدول موجوداً مسبقاً
    await pool.query(`
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS description TEXT;
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS instructor VARCHAR(150);
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS duration VARCHAR(100);
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS days VARCHAR(150);
      ALTER TABLE courses ADD COLUMN IF NOT EXISTS times VARCHAR(100);
    `);

    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables:", err.message);
  }
};

createTables();
module.exports = pool;