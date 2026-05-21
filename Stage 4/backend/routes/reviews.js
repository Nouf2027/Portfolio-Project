const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const auth = require('../middleware/auth');

router.get('/center/:centre_id', async (req, res) => {
  try {
    const reviews = await Review.findByCenterId(req.params.centre_id);
    const average = await Review.getAverageRating(req.params.centre_id);
    res.json({ reviews, average_rating: Number(average) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { centre_id, rating, comment } = req.body;
    if (!centre_id || !rating) {
      return res.status(400).json({ message: 'Centre ID and rating are required' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    const review = await Review.create({
      user_id: req.user.id,
      centre_id,
      rating,
      comment
    });
    const pool = require('../config/db');
    const result = await pool.query(
      `SELECT r.*, u.name as user_name 
       FROM reviews r
       JOIN users u ON r.user_id = u.id
       WHERE r.id = $1`,
      [review.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
