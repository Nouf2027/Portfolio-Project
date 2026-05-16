const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const notifications = [
      {
        id: 1,
        message: 'Your booking has been confirmed'
      },
      {
        id: 2,
        message: 'New course added'
      }
    ];

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
