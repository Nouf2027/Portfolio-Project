const pool = require('../config/db');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");

// Create uploads folder only if it does not exist as a directory
try {
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  } else if (!fs.statSync(uploadDir).isDirectory()) {
    fs.unlinkSync(uploadDir);
    fs.mkdirSync(uploadDir, { recursive: true });
  }
} catch (err) {
  console.error("Uploads folder error:", err);
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
class Center {
  // Create new center
  
  static async create({ name, location, description, image }) {
  const result = await pool.query(
    `INSERT INTO centers (name, location, description, image, approved)
     VALUES ($1, $2, $3, $4, FALSE)
     RETURNING *`,
    [name, location, description, image]
  );

  return result.rows[0];
}

  // Get all approved centers
 static async findAll() {
  const result = await pool.query(
    `SELECT 
      centers.*,
      COALESCE(ROUND(AVG(reviews.rating), 1), 0) AS average_rating,
      COUNT(reviews.id) AS review_count
    FROM centers
    LEFT JOIN reviews ON centers.id = reviews.centre_id
    WHERE centers.approved = TRUE
    GROUP BY centers.id`
  );

  return result.rows;
}



  // Search centers by location
  static async findByLocation(location) {
    const result = await pool.query(
      'SELECT * FROM centers WHERE location ILIKE $1 AND approved = TRUE',
      [`%${location}%`]
    );
    return result.rows;
  }

  // Approve center (admin only)
  static async approve(id) {
    const result = await pool.query(
      'UPDATE centers SET approved = TRUE WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }
  
}

module.exports = Center;
