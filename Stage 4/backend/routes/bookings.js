const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { course_id, date } = req.body;

    // إذا كان date نصاً غير صالح أو فارغاً، استخدم تاريخ اليوم
    let bookingDate = date;
    if (!date || isNaN(new Date(date).getTime())) {
      bookingDate = new Date().toISOString().split('T')[0];
    }

    const result = await pool.query(
      `INSERT INTO bookings (user_id, course_id, date, status) VALUES ($1, $2, $3, 'pending') RETURNING *`,
      [req.user.id, course_id, bookingDate]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, co.name as course_name, co.price, co.duration, co.days, co.times, ce.name as center_name
       FROM bookings b
       JOIN courses co ON b.course_id = co.id
       JOIN centers ce ON co.center_id = ce.id
       WHERE b.user_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }
    const result = await pool.query(
      `SELECT b.*, u.email, co.name as course_name, co.price, ce.name as center_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN courses co ON b.course_id = co.id
       JOIN centers ce ON co.center_id = ce.id`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/center', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT b.*, u.email, co.name as course_name, ce.name as center_name
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       JOIN courses co ON b.course_id = co.id
       JOIN centers ce ON co.center_id = ce.id
       WHERE ce.owner_id = $1`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const result = await pool.query(
      `UPDATE bookings b
       SET status = $1
       FROM courses co
       JOIN centers ce ON co.center_id = ce.id
       WHERE b.course_id = co.id
       AND b.id = $2
       AND ce.owner_id = $3
       RETURNING b.*`,
      [status, req.params.id, req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found or not allowed' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM bookings WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id]);
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;