const express = require('express');
const {
  createTripPlan,
  getTripPlans,
  updateTripPlan,
  deleteTripPlan
} = require('../controllers.js/tripController');
const auth = require('../middlewares.js/auth');

const router = express.Router();

// All routes are protected
router.use(auth);

// Trip planning
router.post('/trip-planner', createTripPlan);
router.get('/', getTripPlans);
router.put('/:id', updateTripPlan);
router.delete('/:id', deleteTripPlan);

module.exports = router;