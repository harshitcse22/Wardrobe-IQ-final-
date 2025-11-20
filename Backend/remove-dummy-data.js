const mongoose = require('mongoose');
const WardrobeItem = require('./models/WardrobeItem');
require('dotenv').config();

async function removeDummyData() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    // Remove items with placeholder images (dummy data)
    const result = await WardrobeItem.deleteMany({
      imageUrl: { $regex: /via\.placeholder\.com/i }
    });

    console.log(`✅ Removed ${result.deletedCount} dummy wardrobe items`);
    
    // Show remaining items count
    const remainingCount = await WardrobeItem.countDocuments();
    console.log(`📦 Remaining wardrobe items: ${remainingCount}`);
    
  } catch (error) {
    console.error('❌ Error removing dummy data:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

removeDummyData();
