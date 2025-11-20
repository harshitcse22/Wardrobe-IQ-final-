const express = require('express');
const { register, login, logout, getProfile, updateProfile } = require('../controllers.js/authController');
const auth = require('../middlewares.js/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;