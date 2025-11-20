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

    // Filter items based on weather and occasion
    let suitableItems = wardrobeItems.filter(item => {
      const weatherSuitable = weather.temperature > 20 ? 
        !['jacket', 'sweater'].includes(item.type) : 
        true;
      
      const occasionSuitable = item.occasion.includes(occasion) || 
        item.occasion.includes('casual');
      
      return weatherSuitable && occasionSuitable;
    });

    // Group items by category
    const itemsByCategory = {
      tops: suitableItems.filter(item => item.category === 'tops'),
      bottoms: suitableItems.filter(item => item.category === 'bottoms'),
      shoes: suitableItems.filter(item => item.category === 'shoes'),
      outerwear: suitableItems.filter(item => item.category === 'outerwear'),
      accessories: suitableItems.filter(item => item.category === 'accessories')
    };

    // Generate outfit combinations
    const outfits = [];
    
    for (let i = 0; i < Math.min(3, itemsByCategory.tops.length); i++) {
      const top = itemsByCategory.tops[i];
      const bottom = itemsByCategory.bottoms[Math.floor(Math.random() * itemsByCategory.bottoms.length)];
      const shoes = itemsByCategory.shoes[Math.floor(Math.random() * itemsByCategory.shoes.length)];
      
      if (top && bottom && shoes) {
        const outfit = {
          items: [
            { itemId: top._id, category: 'tops', name: top.name },
            { itemId: bottom._id, category: 'bottoms', name: bottom.name },
            { itemId: shoes._id, category: 'shoes', name: shoes.name }
          ],
          occasion,
          weather,
          score: Math.round(Math.random() * 30 + 70) // Score between 70-100
        };

        // Add outerwear if cold
        if (weather.temperature < 15 && itemsByCategory.outerwear.length > 0) {
          outfit.items.push({
            itemId: itemsByCategory.outerwear[0]._id,
            category: 'outerwear',
            name: itemsByCategory.outerwear[0].name
          });
        }

        outfits.push(outfit);
      }
    }

    return outfits;
  } catch (error) {
    throw new Error('Failed to generate recommendations');
  }
};

const recommendOutfit = async (req, res) => {
  try {
    const { occasion = 'casual', city } = req.body;
    const userId = req.user.id;

    // Get weather data
    const weather = city ? await getWeatherData(city) : { temperature: 22, condition: 'clear' };

    // Get user preferences
    const userPreferences = req.user.preferences || {};

    // Generate recommendations
    const recommendations = await generateOutfitRecommendation(
      userId,
      occasion,
      weather,
      userPreferences
    );

    res.json({
      recommendations,
      weather,
      occasion
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to generate recommendations', error: error.message });
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