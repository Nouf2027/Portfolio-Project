const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const centerRoutes = require('./routes/centers');
const reviewRoutes = require('./routes/reviews');
const bookingRoutes = require('./routes/bookings');
const courseRoutes = require('./routes/courses');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/centers', centerRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
app.get('/', (req, res) => {
  res.json({ message: 'Jeel API is running!' });
});
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
