// backend/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
// Import routes later
// const authRoutes = require('./routes/auth');
// const classRoutes = require('./routes/classes');
// const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = process.env.PORT || 5001; // Different from React's default 3000

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON bodies

// Basic Route
app.get('/', (req, res) => {
    res.send('Dance Studio MVP Backend Running!');
});

// API Routes (to be created)
// app.use('/api/auth', authRoutes);
// app.use('/api/classes', classRoutes);
// app.use('/api/bookings', bookingRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
