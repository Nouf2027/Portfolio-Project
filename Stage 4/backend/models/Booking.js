const pool = require('../config/db');

class Booking {
  static async create({ user_id, course_id, date }) {
    const result = await pool.query(
      `INSERT INTO bookings (user_id, course_id, date, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [user_id, course_id, date]
    );
    return result.rows[0];
  }

  static async findByUserId(user_id) {
    const result = await pool.query(
      `SELECT b.*, c.name as course_name, cn.name as center_name
       FROM bookings b
       JOIN courses c ON b.course_id = c.id
       JOIN centers cn ON c.center_id = cn.id
       WHERE b.user_id = $1`,
      [user_id]
    );
    return result.rows;
  }

  static async updateStatus(id, status) {
    const result = await pool.query(
      `UPDATE bookings SET status = $1
       WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }
}

module.exports = Booking;
