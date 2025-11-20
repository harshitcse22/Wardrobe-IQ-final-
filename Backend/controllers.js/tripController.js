const TripPlan = require('../models/TripPlan');
const WardrobeItem = require('../models/WardrobeItem');
const axios = require('axios');

const getDestinationWeather = async (destination, startDate, endDate) => {
  try {
    // Mock weather data - replace with actual weather API
    return {
      avgTemp: 25,
      conditions: ['sunny', 'partly-cloudy']
    };
  } catch (error) {
    return { avgTemp: 22, conditions: ['clear'] };
  }
};

const generateTripOutfits = async (userId, tripData) => {
  try {
    const { startDate, endDate, tripType, activities, weather } = tripData;
    const wardrobeItems = await WardrobeItem.find({ userId });

    const tripDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const outfits = [];

    // Define occasion mapping based on trip type and activities
    const occasionMap = {
      business: ['formal', 'work'],
      vacation: ['casual', 'party'],
      weekend: ['casual', 'sport'],
      adventure: ['sport', 'casual']
    };

    const suitableOccasions = occasionMap[tripType] || ['casual'];

    for (let day = 1; day <= tripDays; day++) {
      const dayOccasion = suitableOccasions[Math.floor(Math.random() * suitableOccasions.length)];
      
      // Filter items suitable for the occasion and weather
      const suitableItems = wardrobeItems.filter(item => {
        const occasionMatch = item.occasion.some(occ => suitableOccasions.includes(occ));
        const weatherSuitable = weather.avgTemp > 20 ? 
          !['jacket', 'sweater'].includes(item.type) : true;
        return occasionMatch && weatherSuitable;
      });

      // Group by category
      const itemsByCategory = {
        tops: suitableItems.filter(item => item.category === 'tops'),
        bottoms: suitableItems.filter(item => item.category === 'bottoms'),
        shoes: suitableItems.filter(item => item.category === 'shoes'),
        outerwear: suitableItems.filter(item => item.category === 'outerwear')
      };

      // Create outfit for the day
      const dayOutfit = {
        day,
        occasion: dayOccasion,
        items: []
      };

      // Select items for the outfit
      if (itemsByCategory.tops.length > 0) {
        dayOutfit.items.push(itemsByCategory.tops[Math.floor(Math.random() * itemsByCategory.tops.length)]._id);
      }
      if (itemsByCategory.bottoms.length > 0) {
        dayOutfit.items.push(itemsByCategory.bottoms[Math.floor(Math.random() * itemsByCategory.bottoms.length)]._id);
      }
      if (itemsByCategory.shoes.length > 0) {
        dayOutfit.items.push(itemsByCategory.shoes[Math.floor(Math.random() * itemsByCategory.shoes.length)]._id);
      }

      // Add outerwear if needed
      if (weather.avgTemp < 15 && itemsByCategory.outerwear.length > 0) {
        dayOutfit.items.push(itemsByCategory.outerwear[Math.floor(Math.random() * itemsByCategory.outerwear.length)]._id);
      }

      outfits.push(dayOutfit);
    }

    return outfits;
  } catch (error) {
    throw new Error('Failed to generate trip outfits');
  }
};

const createTripPlan = async (req, res) => {
  try {
    const { destination, startDate, endDate, tripType, activities } = req.body;
    const userId = req.user.id;

    // Get weather data for destination
    const weather = await getDestinationWeather(destination, startDate, endDate);

    // Generate outfits for the trip
    const outfits = await generateTripOutfits(userId, {
      startDate,
      endDate,
      tripType,
      activities,
      weather
    });

    // Create packing list from outfits
    const packingList = [];
    const addedItems = new Set();

    outfits.forEach(outfit => {
      outfit.items.forEach(itemId => {
        if (!addedItems.has(itemId.toString())) {
          packingList.push({
            itemId,
            packed: false
          });
          addedItems.add(itemId.toString());
        }
      });
    });

    const tripPlan = new TripPlan({
      userId,
      destination,
      startDate,
      endDate,
      tripType,
      activities,
      weather,
      outfits,
      packingList
    });

    await tripPlan.save();

    res.status(201).json({
      message: 'Trip plan created successfully',
      tripPlan
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create trip plan', error: error.message });
  }
};

const getTripPlans = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const tripPlans = await TripPlan.find({ userId: req.user.id })
      .populate('outfits.items')
      .populate('packingList.itemId')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ startDate: -1 });

    const total = await TripPlan.countDocuments({ userId: req.user.id });

    res.json({
      tripPlans,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch trip plans', error: error.message });
  }
};

const updateTripPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const tripPlan = await TripPlan.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    ).populate('outfits.items').populate('packingList.itemId');

    if (!tripPlan) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    res.json({ message: 'Trip plan updated successfully', tripPlan });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update trip plan', error: error.message });
  }
};

const deleteTripPlan = async (req, res) => {
  try {
    const { id } = req.params;

    const tripPlan = await TripPlan.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!tripPlan) {
      return res.status(404).json({ message: 'Trip plan not found' });
    }

    res.json({ message: 'Trip plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete trip plan', error: error.message });
  }
};

module.exports = {
  createTripPlan,
  getTripPlans,
  updateTripPlan,
  deleteTripPlan
};