const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  preferences: {
    style: {
      type: String,
      enum: ['casual', 'formal', 'sporty', 'trendy', 'classic'],
      default: 'casual'
    },
    favoriteColors: [String],
    preferredBrands: [String],
    bodyType: String,
    size: {
      top: String,
      bottom: String,
      shoes: String
    }
  },
  location: {
    city: String,
    country: String
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);