const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require("dotenv").config();


const MONGODB_CLOUD_URL = process.env.MONGODB_URI;
const PORT = process.env.PORT || 5000;
// Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(`${MONGODB_CLOUD_URL}`, {
  dbName: "beauty-clinic",
})
  .then(() => console.log("✅ MongoDB Connected to Atlas"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/services', require('./routes/services'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/slots', require('./routes/slots'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Beauty Clinic API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});