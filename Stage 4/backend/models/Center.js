const pool = require('../config/db');

class Center {
  // Create new center
  static async create({ name, location, description }) {
    const result = await pool.query(
      `INSERT INTO centers (name, location, description, approved)
       VALUES ($1, $2, $3, FALSE)
       RETURNING *`,
      [name, location, description]
    );
    return result.rows[0];
  }

  // Get all approved centers
  static async findAll() {
    const result = await pool.query(
      'SELECT * FROM centers WHERE approved = TRUE'
    );
    return result.rows;
  }

  // Find center by ID
  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM centers WHERE id = $1',
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
