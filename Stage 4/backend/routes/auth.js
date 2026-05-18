const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await User.findByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const user = await User.create({ name, email, password, role });
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const valid = await User.comparePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role }, token });
  } 
  catch (err) {
  console.log(err);
  res.status(500).json({ message: err.message });
}
});

module.exports = router;
