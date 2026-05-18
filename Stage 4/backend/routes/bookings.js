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

// Get my bookings with course details
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await pool.query(
      `SELECT b.*, c.name as course_name, c.price, c.duration, c.days, c.times
       FROM bookings b
       JOIN courses c ON b.course_id = c.id
       WHERE b.user_id = $1`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all bookings (admin only)
router.get('/all', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.email, c.name as course_name, c.price
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN courses c ON b.course_id = c.id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

// Get bookings for center
router.get('/center', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.email, c.name as course_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN courses c ON b.course_id = c.id
       WHERE c.center_id = (SELECT id FROM centers WHERE user_id = $1 LIMIT 1)`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel booking
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM bookings WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
