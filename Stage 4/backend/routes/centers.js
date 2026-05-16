const express = require('express');
const router = express.Router();
const Center = require('../models/Center');
const auth = require('../middleware/auth');
const Course = require('../models/Course');

router.get('/', async (req, res) => {
  try {
    const centers = await Center.findAll();
    res.json(centers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ message: 'Location query is required' });
    }
    const centers = await Center.findByLocation(location);
    res.json(centers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const center = await Center.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    res.json(center);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { name, location, description } = req.body;
    if (!name || !location || !description) {
      return res.status(400).json({ message: 'Name, location, and description are required' });
    }
    const center = await Center.create({ name, location, description });
    res.status(201).json(center);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/approve', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admins only' });
    }
    const center = await Center.approve(req.params.id);
    if (!center) {
      return res.status(404).json({ message: 'Center not found' });
    }
    res.json(center);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id/courses', async (req, res) => {
  try {
    const courses = await Course.findByCenterId(req.params.id);

    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
