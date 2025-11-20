const mongoose = require('mongoose');
const WardrobeItem = require('./models/WardrobeItem');
const User = require('./models/User');
require('dotenv').config();

async function debugRecommendations() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB\n');

    // Check users
    const users = await User.find();
    console.log(`📊 Total Users: ${users.length}`);
    if (users.length > 0) {
      console.log(`First User ID: ${users[0]._id}`);
      console.log(`First User Email: ${users[0].email}\n`);
    }

    // Check wardrobe items
    const allItems = await WardrobeItem.find();
    console.log(`👔 Total Wardrobe Items: ${allItems.length}\n`);

    if (allItems.length > 0) {
      console.log('📦 Wardrobe Items Breakdown:');
      
      // Group by user
      const itemsByUser = {};
      allItems.forEach(item => {
        const userId = item.userId.toString();
        if (!itemsByUser[userId]) {
          itemsByUser[userId] = [];
        }
        itemsByUser[userId].push(item);
      });

      for (const [userId, items] of Object.entries(itemsByUser)) {
        console.log(`\n👤 User ID: ${userId}`);
        console.log(`   Items: ${items.length}`);
        
        // Group by category
        const byCategory = {};
        items.forEach(item => {
          if (!byCategory[item.category]) {
            byCategory[item.category] = [];
          }
          byCategory[item.category].push(item);
        });

        console.log('   Categories:');
        for (const [category, catItems] of Object.entries(byCategory)) {
          console.log(`     - ${category}: ${catItems.length} items`);
          catItems.forEach(item => {
            console.log(`       • ${item.name} (${item.type}) - ${item.color.primary}`);
            console.log(`         Seasons: ${item.season.join(', ')}`);
            console.log(`         Occasions: ${item.occasion.join(', ')}`);
          });
        }
      }

      // Test recommendation logic
      console.log('\n\n🧪 Testing Recommendation Logic:');
      const testUserId = allItems[0].userId;
      const testTemp = 25;
      
      console.log(`\nTest Parameters:`);
      console.log(`- User ID: ${testUserId}`);
      console.log(`- Temperature: ${testTemp}°C`);
      console.log(`- Occasion: casual`);

      const userItems = await WardrobeItem.find({ userId: testUserId });
      
      // Season logic
      const getSeason = (temp) => {
        if (temp < 10) return ['winter', 'fall'];
        if (temp < 20) return ['fall', 'spring'];
        if (temp < 28) return ['spring', 'summer'];
        return ['summer'];
      };

      const currentSeasons = getSeason(testTemp);
      console.log(`\nCurrent Seasons for ${testTemp}°C: ${currentSeasons.join(', ')}`);

      // Filter suitable items
      const suitableItems = userItems.filter(item => {
        const seasonMatch = item.season.some(s => currentSeasons.includes(s));
        let tempSuitable = true;
        if (testTemp > 25) {
          tempSuitable = !['jacket', 'sweater'].includes(item.type);
        }
        const occasionSuitable = item.occasion.includes('casual') || item.occasion.includes('casual');
        return seasonMatch && tempSuitable && occasionSuitable;
      });

      console.log(`\n✅ Suitable Items Found: ${suitableItems.length}`);
      
      const itemsByCategory = {
        tops: suitableItems.filter(item => item.category === 'tops'),
        bottoms: suitableItems.filter(item => item.category === 'bottoms'),
        shoes: suitableItems.filter(item => item.category === 'shoes'),
      };

      console.log(`\nSuitable Items by Category:`);
      console.log(`- Tops: ${itemsByCategory.tops.length}`);
      console.log(`- Bottoms: ${itemsByCategory.bottoms.length}`);
      console.log(`- Shoes: ${itemsByCategory.shoes.length}`);

      const canGenerateOutfits = itemsByCategory.tops.length > 0 && 
                                 itemsByCategory.bottoms.length > 0 && 
                                 itemsByCategory.shoes.length > 0;

      console.log(`\n${canGenerateOutfits ? '✅' : '❌'} Can Generate Outfits: ${canGenerateOutfits}`);

      if (!canGenerateOutfits) {
        console.log('\n⚠️  ISSUE FOUND: Not enough items in each category!');
        console.log('Need at least 1 item in: tops, bottoms, and shoes');
      }

    } else {
      console.log('❌ No wardrobe items found in database!');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
    console.log('\n\n✅ Disconnected from MongoDB');
  }
}

debugRecommendations();
