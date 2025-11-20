const mongoose = require('mongoose');

const tripPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  tripType: {
    type: String,
    enum: ['business', 'vacation', 'weekend', 'adventure'],
    required: true
  },
  activities: [String],
  weather: {
    avgTemp: Number,
    conditions: [String]
  },
  outfits: [{
    day: Number,
    occasion: String,
    outfitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Outfit'
    },
    items: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WardrobeItem'
    }]
  }],
  packingList: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WardrobeItem'
    },
    packed: {
      type: Boolean,
      default: false
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('TripPlan', tripPlanSchema);