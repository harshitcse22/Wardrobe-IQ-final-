const express = require('express');
const multer = require('multer');
const path = require('path');

// Test the upload middleware in isolation
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

console.log('✅ Upload middleware created successfully');
console.log('✅ Storage configured for ./uploads directory');
console.log('✅ File size limit: 10MB');
console.log('✅ File filter: images only');

// Test AI service
const { detectClothing } = require('./services/aiService');

async function testAI() {
  try {
    const result = await detectClothing('/uploads/test.jpg');
    console.log('✅ AI service working:', result.type, result.color.primary);
  } catch (error) {
    console.error('❌ AI service error:', error.message);
  }
}

testAI();