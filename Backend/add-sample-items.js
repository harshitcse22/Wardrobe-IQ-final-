const mongoose = require('mongoose');
const WardrobeItem = require('./models/WardrobeItem');
const User = require('./models/User');
require('dotenv').config();

async function addSampleItems() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB\n');

    // Get first user
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No user found!');
      return;
    }

    console.log(`👤 Adding items for user: ${user.email}`);

    // Check existing items
    const existing = await WardrobeItem.find({ userId: user._id });
    const existingCategories = {
      tops: existing.filter(i => i.category === 'tops').length,
      bottoms: existing.filter(i => i.category === 'bottoms').length,
      shoes: existing.filter(i => i.category === 'shoes').length
    };

    console.log('\n📊 Current Items:');
    console.log(`- Tops: ${existingCategories.tops}`);
    console.log(`- Bottoms: ${existingCategories.bottoms}`);
    console.log(`- Shoes: ${existingCategories.shoes}\n`);

    const itemsToAdd = [];

    // Add bottoms if missing
    if (existingCategories.bottoms === 0) {
      itemsToAdd.push(
        {
          userId: user._id,
          name: 'Black Jeans',
          type: 'jeans',
          category: 'bottoms',
          color: { primary: 'black', secondary: [] },
          fabric: 'denim',
          occasion: ['casual', 'work'],
          season: ['spring', 'summer', 'fall', 'winter'],
          imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=300&fit=crop'
        },
        {
          userId: user._id,
          name: 'Blue Denim Jeans',
          type: 'jeans',
          category: 'bottoms',
          color: { primary: 'blue', secondary: [] },
          fabric: 'denim',
          occasion: ['casual', 'sport'],
          season: ['spring', 'summer', 'fall', 'winter'],
          imageUrl: 'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=300&h=300&fit=crop'
        },
        {
          userId: user._id,
          name: 'Khaki Chinos',
          type: 'pants',
          category: 'bottoms',
          color: { primary: 'brown', secondary: [] },
          fabric: 'cotton',
          occasion: ['casual', 'work', 'formal'],
          season: ['spring', 'summer', 'fall'],
          imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=300&h=300&fit=crop'
        }
      );
    }

    // Add shoes if missing
    if (existingCategories.shoes === 0) {
      itemsToAdd.push(
        {
          userId: user._id,
          name: 'White Sneakers',
          type: 'shoes',
          category: 'shoes',
          color: { primary: 'white', secondary: [] },
          fabric: 'synthetic',
          occasion: ['casual', 'sport'],
          season: ['spring', 'summer', 'fall', 'winter'],
          imageUrl: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=300&fit=crop'
        },
        {
          userId: user._id,
          name: 'Black Formal Shoes',
          type: 'shoes',
          category: 'shoes',
          color: { primary: 'black', secondary: [] },
          fabric: 'leather',
          occasion: ['formal', 'work'],
          season: ['spring', 'summer', 'fall', 'winter'],
          imageUrl: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=300&h=300&fit=crop'
        },
        {
          userId: user._id,
          name: 'Brown Casual Shoes',
          type: 'shoes',
          category: 'shoes',
          color: { primary: 'brown', secondary: [] },
          fabric: 'leather',
          occasion: ['casual', 'work'],
          season: ['spring', 'summer', 'fall', 'winter'],
          imageUrl: 'https://images.unsplash.com/photo-1582897085656-c636d006a246?w=300&h=300&fit=crop'
        }
      );
    }

    if (itemsToAdd.length > 0) {
      await WardrobeItem.insertMany(itemsToAdd);
      console.log(`✅ Added ${itemsToAdd.length} sample items!\n`);
      
      // Show updated counts
      const updated = await WardrobeItem.find({ userId: user._id });
      const updatedCategories = {
        tops: updated.filter(i => i.category === 'tops').length,
        bottoms: updated.filter(i => i.category === 'bottoms').length,
        shoes: updated.filter(i => i.category === 'shoes').length
      };

      console.log('📊 Updated Items:');
      console.log(`- Tops: ${updatedCategories.tops}`);
      console.log(`- Bottoms: ${updatedCategories.bottoms}`);
      console.log(`- Shoes: ${updatedCategories.shoes}`);
      console.log('\n✅ Now you can generate outfit recommendations!');
    } else {
      console.log('✅ All categories already have items!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

addSampleItems();
