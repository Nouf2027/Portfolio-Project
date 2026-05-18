const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
  try {
    res.json({ notifications: [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
