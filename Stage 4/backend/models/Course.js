const pool = require('../config/db');

class Course {
  static async findByCenterId(centerId) {
    const result = await pool.query(
      'SELECT * FROM courses WHERE center_id = $1',
      [centerId]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async create({ title, description, center_id, price, duration }) {
    const result = await pool.query(
      'INSERT INTO courses (title, description, center_id, price, duration) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, description, center_id, price, duration]
    );
    return result.rows[0];
  }
}

module.exports = Course;
