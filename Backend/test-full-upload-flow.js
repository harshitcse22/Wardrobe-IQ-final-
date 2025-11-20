const mongoose = require('mongoose');
const WardrobeItem = require('./models/WardrobeItem');
require('dotenv').config();

async function testFullFlow() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB\n');

    // Test 1: Check current items
    console.log('📊 CURRENT DATABASE STATE:');
    const allItems = await WardrobeItem.find();
    console.log(`Total items: ${allItems.length}\n`);

    const byCategory = {
      tops: allItems.filter(i => i.category === 'tops').length,
      bottoms: allItems.filter(i => i.category === 'bottoms').length,
      shoes: allItems.filter(i => i.category === 'shoes').length,
      outerwear: allItems.filter(i => i.category === 'outerwear').length,
      dresses: allItems.filter(i => i.category === 'dresses').length,
      accessories: allItems.filter(i => i.category === 'accessories').length
    };

    console.log('Items by category:');
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

    // Test 2: Try to create a test jeans item
    console.log('\n\n🧪 TEST: Creating a test jeans item...');
    
    const testUserId = new mongoose.Types.ObjectId('691f139f867e7df5eba42b30');
    
    const testJeans = {
      userId: testUserId,
      name: 'Test Blue Jeans',
      type: 'jeans',
      category: 'bottoms',
      color: { primary: 'blue', secondary: [] },
      fabric: 'denim',
      imageUrl: '/uploads/test-jeans.jpg',
      season: ['spring', 'summer', 'fall', 'winter'],
      occasion: ['casual', 'work']
    };

    console.log('Test item data:', JSON.stringify(testJeans, null, 2));

    const newItem = new WardrobeItem(testJeans);
    await newItem.save();

    console.log('\n✅ Test jeans saved successfully!');
    console.log('Item ID:', newItem._id);
    console.log('Item details:', {
      name: newItem.name,
      type: newItem.type,
      category: newItem.category,
      color: newItem.color
    });

    // Test 3: Verify it was saved
    console.log('\n\n🔍 VERIFICATION:');
    const savedItem = await WardrobeItem.findById(newItem._id);
    if (savedItem) {
      console.log('✅ Item found in database');
      console.log('Category:', savedItem.category);
      console.log('Type:', savedItem.type);
    } else {
      console.log('❌ Item NOT found in database');
    }

    // Test 4: Check updated counts
    console.log('\n\n📊 UPDATED DATABASE STATE:');
    const updatedItems = await WardrobeItem.find();
    console.log(`Total items: ${updatedItems.length}`);

    const updatedByCategory = {
      tops: updatedItems.filter(i => i.category === 'tops').length,
      bottoms: updatedItems.filter(i => i.category === 'bottoms').length,
      shoes: updatedItems.filter(i => i.category === 'shoes').length
    };

    console.log('Items by category:');
    Object.entries(updatedByCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

    // Test 5: Check if recommendations would work
    console.log('\n\n🎯 RECOMMENDATION CHECK:');
    const canRecommend = updatedByCategory.tops > 0 && 
                         updatedByCategory.bottoms > 0 && 
                         updatedByCategory.shoes > 0;
    
    console.log(`Can generate recommendations: ${canRecommend ? '✅ YES' : '❌ NO'}`);
    if (!canRecommend) {
      console.log('Missing categories:');
      if (updatedByCategory.tops === 0) console.log('  - Need tops');
      if (updatedByCategory.bottoms === 0) console.log('  - Need bottoms');
      if (updatedByCategory.shoes === 0) console.log('  - Need shoes');
    }

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('Error details:', error);
  } finally {
    mongoose.disconnect();
    console.log('\n\n✅ Disconnected from MongoDB');
  }
}

testFullFlow();
