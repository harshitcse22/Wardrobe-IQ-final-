const express = require('express');
const {
  recommendOutfit,
  saveOutfit,
  getSavedOutfits
} = require('../controllers.js/recommendationController');
const auth = require('../middlewares.js/auth');

const router = express.Router();

// Skip auth for recommendation routes in development
router.use((req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('⚠️  [DEV MODE] Skipping auth for recommendations, using mock user');
    req.user = { id: '691f139f867e7df5eba42b30' };
    return next();
  }
  auth(req, res, next);
});

// Outfit recommendations
router.post('/recommend-outfit', recommendOutfit);
router.post('/save-outfit', saveOutfit);
router.get('/outfits', getSavedOutfits);

module.exports = router;