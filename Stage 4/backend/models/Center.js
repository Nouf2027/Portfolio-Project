const pool = require('../config/db');

class Center {
  // Create new center
  static async create({ name, location, description, image, category, owner_id }) {
  const result = await pool.query(
    `INSERT INTO centers (name, location, description, image, category, owner_id, approved)
     VALUES ($1, $2, $3, $4, $5, $6, FALSE)
     RETURNING *`,
    [name, location, description, image, category, owner_id]
  );
  return result.rows[0];
}

  // Get all approved centers
  static async findAll() {
    const result = await pool.query(
      `SELECT centers.*, 
              COALESCE(ROUND(AVG(reviews.rating), 1), 0) AS average_rating,
              COUNT(reviews.id) AS review_count
       FROM centers
       LEFT JOIN reviews ON centers.id = reviews.centre_id
       WHERE centers.approved = TRUE
       GROUP BY centers.id`
    );
    return result.rows;
  }

  // Find center by ID
  static async findById(id) {
    const result = await pool.query(
      `SELECT centers.*,
              COALESCE(ROUND(AVG(reviews.rating), 1), 0) AS average_rating,
              COUNT(reviews.id) AS review_count
       FROM centers
       LEFT JOIN reviews ON centers.id = reviews.centre_id
       WHERE centers.id = $1
       GROUP BY centers.id`,
      [id]
    );
    return result.rows[0];
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
