const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes.js/authRoutes');
const wardrobeRoutes = require('./routes.js/wardrobeRoutes');
const recommendationRoutes = require('./routes.js/recommendationRoutes');
const tripRoutes = require('./routes.js/tripRoutes');
const upload = require('./simple-upload');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST' && req.body) {
    const safeBody = { ...req.body };
    if (safeBody.password) safeBody.password = '[HIDDEN]';
    console.log('Body:', safeBody);
  }
  if (req.cookies) console.log('Cookies:', req.cookies);
  if (req.headers.authorization) console.log('Auth Header:', req.headers.authorization);
  next();
});

// Database connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/wardrobe', wardrobeRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/trips', tripRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'WardrobeIQ Backend is running!' });
});

// Simple test endpoint
app.post('/api/test-simple', (req, res) => {
  console.log('Simple test endpoint hit');
  res.json({ message: 'Test successful', timestamp: new Date() });
});

// Direct upload test
app.post('/api/direct-upload', upload.single('image'), (req, res) => {
  console.log('=== DIRECT UPLOAD TEST ===');
  console.log('File received:', !!req.file);
  console.log('File details:', req.file);
  
  if (!req.file) {
    return res.status(400).json({ message: 'No file' });
  }
  
  res.json({
    success: true,
    filename: req.file.filename,
    size: req.file.size
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({
    message: 'Internal server error',
    error: error.message,
    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});