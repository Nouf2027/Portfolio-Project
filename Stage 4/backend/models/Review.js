const pool = require('../config/db');

class Review {
  // Create new review
  static async create({ user_id, centre_id, rating, comment }) {
    const result = await pool.query(
      `INSERT INTO reviews (user_id, centre_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [user_id, centre_id, rating, comment]
    );
    return result.rows[0];
  }

  // Get reviews by center
  static async findByCenterId(centre_id) {
    const result = await pool.query(
      `SELECT r.*, u.name as user_name 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.centre_id = $1`,
      [centre_id]
    );
    return result.rows;
  }

  // Get average rating for center
  static async getAverageRating(centre_id) {
    const result = await pool.query(
      'SELECT AVG(rating) as avg_rating FROM reviews WHERE centre_id = $1',
      [centre_id]
    );
    return result.rows[0].avg_rating;
  }
}

module.exports = Review;
