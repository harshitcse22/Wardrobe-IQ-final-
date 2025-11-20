const mongoose = require('mongoose');
const WardrobeItem = require('./models/WardrobeItem');
const User = require('./models/User');
require('dotenv').config();

// ⚠️ WARNING: This file creates DUMMY DATA for testing purposes only
// ⚠️ DO NOT USE IN PRODUCTION - Use real wardrobe items instead

async function createMockData() {
  console.log('⚠️  WARNING: This script creates dummy/mock data!');
  console.log('⚠️  This should only be used for development/testing purposes.');
  console.log('⚠️  Use remove-dummy-data.js to clean up dummy data.');
  console.log('');
  
  // Prevent accidental execution
  console.log('❌ Mock data creation is disabled.');
  console.log('💡 If you really need to create test data, uncomment the code in this file.');
  return;
  
  /* COMMENTED OUT TO PREVENT ACCIDENTAL DUMMY DATA CREATION
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Find the first user or create one
    let user = await User.findOne();
    if (!user) {
      user = new User({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      });
      await user.save();
      console.log('Created test user');
    }

    // Check if mock items already exist
    const existingItems = await WardrobeItem.find({ userId: user._id });
    if (existingItems.length > 0) {
      console.log('Mock data already exists');
      return;
    }

    // Create mock wardrobe items
    const mockItems = [
      {
        userId: user._id,
        name: 'Blue Cotton T-shirt',
        type: 't-shirt',
        category: 'tops',
        color: { primary: 'blue' },
        fabric: 'cotton',
        occasion: ['casual', 'sport'],
        season: ['spring', 'summer'],
        imageUrl: 'https://via.placeholder.com/300x300?text=Blue+T-shirt'
      },
      {
        userId: user._id,
        name: 'Blue Denim Jeans',
        type: 'jeans',
        category: 'bottoms',
        color: { primary: 'blue' },
        fabric: 'denim',
        occasion: ['casual', 'work'],
        season: ['spring', 'fall', 'winter'],
        imageUrl: 'https://via.placeholder.com/300x300?text=Blue+Jeans'
      },
      {
        userId: user._id,
        name: 'White Sneakers',
        type: 'shoes',
        category: 'shoes',
        color: { primary: 'white' },
        fabric: 'synthetic',
        occasion: ['casual', 'sport'],
        season: ['spring', 'summer', 'fall'],
        imageUrl: 'https://via.placeholder.com/300x300?text=White+Sneakers'
      },
      {
        userId: user._id,
        name: 'White Cotton Shirt',
        type: 'shirt',
        category: 'tops',
        color: { primary: 'white' },
        fabric: 'cotton',
        occasion: ['formal', 'work'],
        season: ['spring', 'summer', 'fall'],
        imageUrl: 'https://via.placeholder.com/300x300?text=White+Shirt'
      },
      {
        userId: user._id,
        name: 'Black Dress Pants',
        type: 'pants',
        category: 'bottoms',
        color: { primary: 'black' },
        fabric: 'wool',
        occasion: ['formal', 'work'],
        season: ['fall', 'winter'],
        imageUrl: 'https://via.placeholder.com/300x300?text=Black+Pants'
      },
      {
        userId: user._id,
        name: 'Black Leather Shoes',
        type: 'shoes',
        category: 'shoes',
        color: { primary: 'black' },
        fabric: 'leather',
        occasion: ['formal', 'work'],
        season: ['spring', 'fall', 'winter'],
        imageUrl: 'https://via.placeholder.com/300x300?text=Black+Shoes'
      }
    ];

    await WardrobeItem.insertMany(mockItems);
    console.log('Created mock wardrobe items');
    console.log('User ID:', user._id);
    
  } catch (error) {
    console.error('Error creating mock data:', error);
  } finally {
    mongoose.disconnect();
  }
  */
}

createMockData();