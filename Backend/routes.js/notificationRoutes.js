const express = require('express');
const router = express.Router();
const auth = require('../middlewares.js/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers.js/notificationController');

// Development mode auth bypass
const devAuth = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    req.user = { id: '691f139f867e7df5eba42b30' };
    return next();
  }
  auth(req, res, next);
};

router.get('/', devAuth, getNotifications);
router.patch('/:id/read', devAuth, markAsRead);
router.patch('/read-all', devAuth, markAllAsRead);
router.delete('/:id', devAuth, deleteNotification);

module.exports = router;
