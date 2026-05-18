const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// Create booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { course_id, date } = req.body;
    const user_id = req.user.id;
    const result = await pool.query(
      `INSERT INTO bookings (user_id, course_id, date, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING *`,
      [user_id, course_id, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my bookings
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;











































