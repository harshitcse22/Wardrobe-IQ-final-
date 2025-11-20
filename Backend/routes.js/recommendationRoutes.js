const express = require('express');
const {
  recommendOutfit,
  saveOutfit,
  getSavedOutfits
} = require('../controllers.js/recommendationController');
const auth = require('../middlewares.js/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// Outfit recommendations
router.post('/recommend-outfit', recommendOutfit);
router.post('/save-outfit', saveOutfit);
router.get('/outfits', getSavedOutfits);

module.exports = router;