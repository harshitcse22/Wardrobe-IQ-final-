const mongoose = require('mongoose');

const wardrobeItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['shirt', 't-shirt', 'jeans', 'pants', 'dress', 'skirt', 'jacket', 'sweater', 'shorts', 'shoes', 'accessories']
  },
  category: {
    type: String,
    required: true,
    enum: ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories']
  },
  color: {
    primary: { type: String, required: true },
    secondary: [String]
  },
  fabric: {
    type: String,
    enum: ['cotton', 'denim', 'silk', 'wool', 'polyester', 'linen', 'leather', 'synthetic']
  },
  brand: String,
  size: String,
  season: {
    type: [String],
    enum: ['spring', 'summer', 'fall', 'winter'],
    default: ['spring', 'summer', 'fall', 'winter']
  },
  occasion: {
    type: [String],
    enum: ['casual', 'formal', 'work', 'party', 'sport', 'beach'],
    default: ['casual']
  },
  imageUrl: String,
  tags: [String],
  isFavorite: {
    type: Boolean,
    default: false
  },
  wearCount: {
    type: Number,
    default: 0
  },
  lastWorn: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('WardrobeItem', wardrobeItemSchema);