const express = require('express');
const {
  uploadImage,
  detectClothes,
  getWardrobe,
  updateWardrobeItem,
  deleteWardrobeItem
} = require('../controllers.js/wardrobeController');
const { simpleUpload } = require('../simple-controller');
const { completeUpload, addToWardrobe } = require('../complete-upload');
const auth = require('../middlewares.js/auth');
const upload = require('../simple-upload');

const router = express.Router();

// Add logging before auth middleware
router.use((req, res, next) => {
  console.log('Wardrobe route accessed:', req.method, req.path);
  next();
});

// Skip auth for wardrobe routes in development
router.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('Skipping auth for', req.path, 'in development');
    // Mock user for development
    req.user = { id: '691f139f867e7df5eba42b30' };
    return next();
  }
  auth(req, res, next);
});

// Complete upload and AI analysis with error handling
router.post('/upload-image', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('❌ Multer error:', err);
      return res.status(400).json({ 
        message: 'File upload error', 
        error: err.message 
      });
    }
    completeUpload(req, res).catch(next);
  });
});
router.post('/detect-clothes', detectClothes);

// Wardrobe management with error handling
router.post('/add-to-wardrobe', (req, res, next) => {
  addToWardrobe(req, res).catch(next);
});
router.get('/', getWardrobe);
router.put('/:id', updateWardrobeItem);
router.delete('/:id', deleteWardrobeItem);

module.exports = router;