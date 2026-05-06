const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});
const createTables = async () => {
  try {
    await pool.query(`DO $$ BEGIN
      CREATE TYPE user_role AS ENUM ('parent', 'admin');
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
        role user_role DEFAULT 'parent'
      );

      CREATE TABLE IF NOT EXISTS centers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        approved BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        age_range VARCHAR(50),
        price DECIMAL(10, 2) NOT NULL,
        center_id INTEGER REFERENCES centers(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        date TIMESTAMP NOT NULL,
        status booking_status DEFAULT 'pending'
        );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        centre_id INTEGER REFERENCES centers(id) ON DELETE CASCADE,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
        comment TEXT
      );
    `);
    console.log(" Tables created successfully");
  } catch (err) {
    console.error(" Error creating tables:", err.message);
  }
};

createTables();

module.exports = pool;