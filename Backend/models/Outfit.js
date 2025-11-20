const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: String,
  items: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WardrobeItem',
      required: true
    },
    category: String
  }],
  occasion: {
    type: String,
    enum: ['casual', 'formal', 'work', 'party', 'sport', 'beach'],
    required: true
  },
  season: {
    type: String,
    enum: ['spring', 'summer', 'fall', 'winter'],
    required: true
  },
  weather: {
    temperature: Number,
    condition: String
  },
  isFavorite: {
    type: Boolean,
    default: false
  },
  wornCount: {
    type: Number,
    default: 0
  },
  lastWorn: Date,
  rating: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Outfit', outfitSchema);