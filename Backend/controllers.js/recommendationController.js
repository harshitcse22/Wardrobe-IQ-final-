const WardrobeItem = require('../models/WardrobeItem');
const Outfit = require('../models/Outfit');
const axios = require('axios');

// Weather API integration
const getWeatherData = async (city) => {
  try {
    const API_KEY = process.env.OPENWEATHER_API_KEY;
    if (!API_KEY) {
      return { temperature: 22, condition: 'clear' }; // Mock data
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    return {
      temperature: Math.round(response.data.main.temp),
      condition: response.data.weather[0].main.toLowerCase()
    };
  } catch (error) {
    return { temperature: 22, condition: 'clear' }; // Fallback
  }
};

// Outfit recommendation engine
const generateOutfitRecommendation = async (userId, occasion, weather, userPreferences) => {
  try {
    // Get user's wardrobe items
    const wardrobeItems = await WardrobeItem.find({ userId });

    if (wardrobeItems.length === 0) {
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

    // Filter items based on weather and occasion
    let suitableItems = wardrobeItems.filter(item => {
      // Weather suitability
      const seasonMatch = item.season.some(s => currentSeasons.includes(s));
      
      // Temperature-based type filtering
      let tempSuitable = true;
      if (weather.temperature > 25) {
        // Hot weather - avoid heavy items
        tempSuitable = !['jacket', 'sweater'].includes(item.type);
      } else if (weather.temperature < 15) {
        // Cold weather - prefer warm items
        if (item.category === 'outerwear') tempSuitable = true;
      }
      
      // Occasion suitability
      const occasionSuitable = item.occasion.includes(occasion) || 
        item.occasion.includes('casual');
      
      return seasonMatch && tempSuitable && occasionSuitable;
    });

    // Group items by category
    const itemsByCategory = {
      tops: suitableItems.filter(item => item.category === 'tops'),
      bottoms: suitableItems.filter(item => item.category === 'bottoms'),
      shoes: suitableItems.filter(item => item.category === 'shoes'),
      outerwear: suitableItems.filter(item => item.category === 'outerwear'),
      accessories: suitableItems.filter(item => item.category === 'accessories')
    };

    // Generate 3 outfit combinations
    const outfits = [];
    const maxOutfits = 3;
    
    // Shuffle arrays for variety
    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    shuffle(itemsByCategory.tops);
    shuffle(itemsByCategory.bottoms);
    shuffle(itemsByCategory.shoes);

    for (let i = 0; i < maxOutfits; i++) {
      const top = itemsByCategory.tops[i % itemsByCategory.tops.length];
      const bottom = itemsByCategory.bottoms[i % itemsByCategory.bottoms.length];
      const shoes = itemsByCategory.shoes[i % itemsByCategory.shoes.length];
      
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

        // Calculate match score based on color coordination and weather
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
      }
    }

    return outfits;
  } catch (error) {
    console.error('Recommendation generation error:', error);
    throw new Error('Failed to generate recommendations');
  }
};

const recommendOutfit = async (req, res) => {
  try {
    console.log('\n' + '='.repeat(60));
    console.log('🎯 [BACKEND] RECOMMENDATION REQUEST RECEIVED');
    console.log('='.repeat(60));
    
    const { occasion = 'casual', city } = req.body;
    console.log('🎯 [BACKEND] Request body:', req.body);
    console.log('🎯 [BACKEND] User from auth:', req.user ? 'Present' : 'Missing');
    
    if (!req.user || !req.user.id) {
      console.error('❌ [BACKEND] No user ID found!');
      return res.status(401).json({ message: 'Authentication required', recommendations: [] });
    }
    
    const userId = req.user.id;
    console.log('🎯 [BACKEND] User ID:', userId);
    console.log('🎯 [BACKEND] Occasion:', occasion);
    console.log('🎯 [BACKEND] City:', city);

    // Get weather data
    const weather = city ? await getWeatherData(city) : { temperature: 22, condition: 'clear' };
    console.log('🎯 [BACKEND] Weather:', weather);

    // Get user preferences
    const userPreferences = req.user.preferences || {};

    // Generate recommendations
    console.log('🎯 [BACKEND] Generating recommendations...');
    const recommendations = await generateOutfitRecommendation(
      userId,
      occasion,
      weather,
      userPreferences
    );

    console.log('✅ [BACKEND] Recommendations generated:', recommendations.length);
    console.log('='.repeat(60) + '\n');

    // Create notification if recommendations generated
    if (recommendations.length > 0) {
      const { createNotification } = require('./notificationController');
      await createNotification(
        userId,
        'outfit_suggested',
        'New Outfit Suggestions',
        `${recommendations.length} outfit suggestions are ready for ${occasion}`,
        {}
      );
    }

    res.json({
      recommendations,
      weather,
      occasion
    });
  } catch (error) {
    console.error('❌ [BACKEND] Recommendation error:', error);
    res.status(500).json({ message: 'Failed to generate recommendations', error: error.message, recommendations: [] });
  }
};

const saveOutfit = async (req, res) => {
  try {
    const { name, items, occasion, weather } = req.body;
    
    const outfit = new Outfit({
      userId: req.user.id,
      name,
      items,
      occasion,
      weather,
      season: getCurrentSeason()
    });

    await outfit.save();
    
    res.status(201).json({
      message: 'Outfit saved successfully',
      outfit
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save outfit', error: error.message });
  }
};

const getSavedOutfits = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const outfits = await Outfit.find({ userId: req.user.id })
      .populate('items.itemId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Outfit.countDocuments({ userId: req.user.id });

    res.json({
      outfits,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch outfits', error: error.message });
  }
};

const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
};

module.exports = {
  recommendOutfit,
  saveOutfit,
  getSavedOutfits
};