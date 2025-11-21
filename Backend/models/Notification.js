const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['cloth_added', 'cloth_removed', 'trip_planned', 'outfit_suggested'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  data: {
    itemId: mongoose.Schema.Types.ObjectId,
    itemName: String,
    imageUrl: String,
    tripId: mongoose.Schema.Types.ObjectId,
    destination: String
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
