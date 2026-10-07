const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedData = require('./utils/seedData');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Enable CORS & JSON parsing
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/incidents', require('./routes/incidentRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'OpsPilot AI Command Platform',
    timestamp: new Date().toISOString(),
  });
});

// Seed data trigger route
app.post('/api/seed', async (req, res, next) => {
  try {
    await seedData();
    res.json({ message: 'Database seed executed successfully.' });
  } catch (err) {
    next(err);
  }
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Initialize Express Server & Connect DB in parallel
const server = app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 OpsPilot AI Command Backend Server is Running!`);
  console.log(`🌐 Port: http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);

  await connectDB();
  await seedData();
});
