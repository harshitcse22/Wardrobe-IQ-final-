const mongoose = require('mongoose');
const WardrobeItem = require('./models/WardrobeItem');
require('dotenv').config();

// Copy the exact recommendation logic from controller
const generateOutfitRecommendation = async (userId, occasion, weather) => {
  try {
    console.log('\n🎯 TESTING RECOMMENDATION GENERATION');
    console.log('='.repeat(60));
    console.log('User ID:', userId);
    console.log('Occasion:', occasion);
    console.log('Weather:', weather);
    console.log('='.repeat(60));

    // Get user's wardrobe items
    const wardrobeItems = await WardrobeItem.find({ userId });
    console.log(`\n📦 Total wardrobe items: ${wardrobeItems.length}`);

    if (wardrobeItems.length === 0) {
      console.log('❌ No wardrobe items found!');
      return [];
    }

    // Determine season based on temperature
    const getSeason = (temp) => {
      if (temp < 10) return ['winter', 'fall'];
      if (temp < 20) return ['fall', 'spring'];
      if (temp < 28) return ['spring', 'summer'];
      return ['summer'];
    };

    const currentSeasons = getSeason(weather.temperature);
    console.log(`\n🌡️  Temperature: ${weather.temperature}°C`);
    console.log(`🌸 Current seasons: ${currentSeasons.join(', ')}`);

    // Filter items based on weather and occasion
    let suitableItems = wardrobeItems.filter(item => {
      // Weather suitability
      const seasonMatch = item.season.some(s => currentSeasons.includes(s));
      
      // Temperature-based type filtering
      let tempSuitable = true;
      if (weather.temperature > 25) {
        tempSuitable = !['jacket', 'sweater'].includes(item.type);
      } else if (weather.temperature < 15) {
        if (item.category === 'outerwear') tempSuitable = true;
      }
      
      // Occasion suitability
      const occasionSuitable = item.occasion.includes(occasion) || 
        item.occasion.includes('casual');
      
      return seasonMatch && tempSuitable && occasionSuitable;
    });

    console.log(`\n✅ Suitable items after filtering: ${suitableItems.length}`);

    // Group items by category
    const itemsByCategory = {
      tops: suitableItems.filter(item => item.category === 'tops'),
      bottoms: suitableItems.filter(item => item.category === 'bottoms'),
      shoes: suitableItems.filter(item => item.category === 'shoes'),
      outerwear: suitableItems.filter(item => item.category === 'outerwear'),
      accessories: suitableItems.filter(item => item.category === 'accessories')
    };

    console.log('\n📊 Items by category:');
    console.log(`   Tops: ${itemsByCategory.tops.length}`);
    console.log(`   Bottoms: ${itemsByCategory.bottoms.length}`);
    console.log(`   Shoes: ${itemsByCategory.shoes.length}`);
    console.log(`   Outerwear: ${itemsByCategory.outerwear.length}`);

    // Generate 3 outfit combinations
    const outfits = [];
    const maxOutfits = 3;
    
    // Shuffle arrays for variety
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    shuffle(itemsByCategory.tops);
    shuffle(itemsByCategory.bottoms);
    shuffle(itemsByCategory.shoes);

    console.log('\n🎨 Generating outfits...');

    for (let i = 0; i < maxOutfits; i++) {
      const top = itemsByCategory.tops[i % itemsByCategory.tops.length];
      const bottom = itemsByCategory.bottoms[i % itemsByCategory.bottoms.length];
      const shoes = itemsByCategory.shoes[i % itemsByCategory.shoes.length];
      
      console.log(`\n   Outfit ${i + 1}:`);
      console.log(`   - Top: ${top ? top.name : 'MISSING'}`);
      console.log(`   - Bottom: ${bottom ? bottom.name : 'MISSING'}`);
      console.log(`   - Shoes: ${shoes ? shoes.name : 'MISSING'}`);
      
      if (top && bottom && shoes) {
        const outfitItems = [
          { 
            itemId: top._id, 
            category: 'tops', 
            name: top.name,
            color: top.color.primary,
            imageUrl: top.imageUrl
          },
          { 
            itemId: bottom._id, 
            category: 'bottoms', 
            name: bottom.name,
            color: bottom.color.primary,
            imageUrl: bottom.imageUrl
          },
          { 
            itemId: shoes._id, 
            category: 'shoes', 
            name: shoes.name,
            color: shoes.color.primary,
            imageUrl: shoes.imageUrl
          }
        ];

        // Add outerwear if cold
        if (weather.temperature < 18 && itemsByCategory.outerwear.length > 0) {
          const outerwear = itemsByCategory.outerwear[i % itemsByCategory.outerwear.length];
          if (outerwear) {
            outfitItems.push({
              itemId: outerwear._id,
              category: 'outerwear',
              name: outerwear.name,
              color: outerwear.color.primary,
              imageUrl: outerwear.imageUrl
            });
          }
        }

        // Calculate match score
        const baseScore = 70;
        const weatherBonus = currentSeasons.some(s => top.season.includes(s)) ? 15 : 0;
        const occasionBonus = top.occasion.includes(occasion) ? 15 : 0;
        
        const outfit = {
          items: outfitItems,
          occasion,
          weather,
          score: Math.min(100, baseScore + weatherBonus + occasionBonus)
        };

        outfits.push(outfit);
        console.log(`   ✅ Outfit ${i + 1} created successfully!`);
      } else {
        console.log(`   ❌ Outfit ${i + 1} FAILED - Missing items!`);
      }
    }

    console.log(`\n✅ Total outfits generated: ${outfits.length}`);
    return outfits;
  } catch (error) {
    console.error('❌ Recommendation generation error:', error);
    throw error;
  }
};

async function testRecommendationAPI() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ Connected to MongoDB\n');

    const userId = '691f139f867e7df5eba42b30';
    const occasion = 'casual';
    const weather = { temperature: 25, condition: 'clear' };

    const recommendations = await generateOutfitRecommendation(userId, occasion, weather);

    console.log('\n' + '='.repeat(60));
    console.log('📋 FINAL RECOMMENDATIONS:');
    console.log('='.repeat(60));
    console.log(JSON.stringify(recommendations, null, 2));
    console.log('='.repeat(60));

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
}

testRecommendationAPI();
