const express = require('express');
const router = express.Router();
const pool = require('../config/db');

router.get('/', async (req, res) => {
  try {
    const { center_id } = req.query;
    let result;
    if (center_id) {
      result = await pool.query('SELECT * FROM courses WHERE center_id = $1', [center_id]);
    } else {
      result = await pool.query('SELECT * FROM courses');
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Course not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description, price, duration, days, times, instructor, center_id } = req.body;
    const result = await pool.query(
      'INSERT INTO courses (name, description, price, duration, days, times, instructor, center_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, description, price, duration, days, times, instructor, center_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
