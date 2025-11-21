const mongoose = require('mongoose');
require('dotenv').config();

const Notification = require('./models/Notification');

async function createTestNotifications() {
  try {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/wardrobeiq');
    console.log('Connected to MongoDB');

    const userId = '691f139f867e7df5eba42b30'; // Your test user ID

    // Create test notifications
    const notifications = [
      {
        userId,
        type: 'cloth_added',
        title: 'New Item Added! 🛍️',
        message: 'Blue Jeans has been added to your wardrobe',
        data: {
          itemName: 'Blue Jeans'
        }
      },
      {
        userId,
        type: 'cloth_removed',
        title: 'Item Removed 📦',
        message: 'Old T-Shirt has been removed from your wardrobe',
        data: {
          itemName: 'Old T-Shirt'
        }
      },
      {
        userId,
        type: 'trip_planned',
        title: 'Trip Planned ✈️',
        message: 'Your trip to Paris has been planned successfully',
        data: {
          destination: 'Paris'
        }
      },
      {
        userId,
        type: 'outfit_suggested',
        title: 'New Outfit Suggestions ✨',
        message: '3 outfit suggestions are ready for casual occasion',
        data: {}
      }
    ];

    for (const notif of notifications) {
      const notification = new Notification(notif);
      await notification.save();
      console.log(`✅ Created: ${notif.title}`);
    }

    console.log('\n🎉 All test notifications created successfully!');
    console.log('Now check the notification panel in your app.');
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

createTestNotifications();
