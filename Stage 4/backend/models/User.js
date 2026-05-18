const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  // Create new user
  static async create({ name, email, password, role = 'parent' }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role, created_at`,
      [name, email, hashedPassword, role]
    );
    return result.rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  // Find user by ID
  static async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  // Update profile
  static async update(id, { name, email }) {
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2
       WHERE id = $3
       RETURNING id, name, email, role, created_at`,
      [name, email, id]
    );
    return result.rows[0];
  }

  // Compare passwords
  static async comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }
}

module.exports = User;