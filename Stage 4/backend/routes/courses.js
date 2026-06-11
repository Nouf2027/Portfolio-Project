const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authMiddleware = require('../middleware/auth');

// GET all courses or by center_id
router.get('/', async (req, res) => {
  try {
    const { center_id } = req.query;
    let result;
    if (center_id) {
      result = await pool.query(
        `SELECT courses.*, centers.name as center_name 
         FROM courses 
         JOIN centers ON courses.center_id = centers.id 
         WHERE courses.center_id = $1`,
        [center_id]
      );
    } else {
      result = await pool.query(
        `SELECT courses.*, centers.name as center_name 
         FROM courses 
         JOIN centers ON courses.center_id = centers.id`
      );
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET course by id
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT courses.*, centers.name as center_name 
       FROM courses 
       JOIN centers ON courses.center_id = centers.id 
       WHERE courses.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Course not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add new course (center only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, duration, days, times, instructor, center_id } = req.body;
    const result = await pool.query(
      `INSERT INTO courses (name, description, price, duration, days, times, instructor, center_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, description, price, duration, days, times, instructor, center_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT edit course (center owner only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { name, description, price, duration, days, times, instructor } = req.body;

    // Make sure this course belongs to the logged-in center's owner
    const ownership = await pool.query(
      `SELECT courses.id 
       FROM courses 
       JOIN centers ON courses.center_id = centers.id 
       WHERE courses.id = $1 AND centers.owner_id = $2`,
      [req.params.id, req.user.id]
    );

    if (ownership.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to edit this course' });
    }

    const result = await pool.query(
      `UPDATE courses 
       SET name = COALESCE($1, name),
           description = COALESCE($2, description),
           price = COALESCE($3, price),
           duration = COALESCE($4, duration),
           days = COALESCE($5, days),
           times = COALESCE($6, times),
           instructor = COALESCE($7, instructor)
       WHERE id = $8
       RETURNING *`,
      [name, description, price, duration, days, times, instructor, req.params.id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE course (center owner only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Make sure this course belongs to the logged-in center's owner
    const ownership = await pool.query(
      `SELECT courses.id 
       FROM courses 
       JOIN centers ON courses.center_id = centers.id 
       WHERE courses.id = $1 AND centers.owner_id = $2`,
      [req.params.id, req.user.id]
    );

    if (ownership.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this course' });
    }

    await pool.query('DELETE FROM courses WHERE id = $1', [req.params.id]);
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;