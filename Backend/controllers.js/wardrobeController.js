const WardrobeItem = require('../models/WardrobeItem');
const { detectClothing } = require('../services/aiService');
const axios = require('axios');

const uploadImage = async (req, res) => {
  try {
    console.log('Upload request received');
    console.log('User from auth:', req.user ? 'Present' : 'Missing');
    console.log('File:', req.file ? 'Present' : 'Missing');
    
    if (!req.file) {
      console.error('No file in request');
      return res.status(400).json({ message: 'No image uploaded' });
    }

    // For now, create a mock user if auth fails (development mode)
    if (!req.user && process.env.NODE_ENV === 'development') {
      req.user = { id: '691f139f867e7df5eba42b30' }; // Use existing user ID
      console.log('Using mock user for development');
    } else if (!req.user) {
      console.error('No user in request - auth failed');
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Create URL for local file
    const imageUrl = `/uploads/${req.file.filename}`;
    const fullImagePath = req.file.path;
    
    console.log('Image saved to:', fullImagePath);
    console.log('Image URL:', imageUrl);
    
    // Run AI detection with error handling
    let detection;
    try {
      detection = await detectClothing(imageUrl);
      console.log('AI detection completed:', detection);
    } catch (aiError) {
      console.error('AI detection failed:', aiError);
      // Use fallback detection
      detection = {
        type: 'shirt',
        category: 'tops',
        color: { primary: 'blue', secondary: [] },
        fabric: 'cotton',
        confidence: 0.6,
        aiSource: 'fallback'
      };
    }

    res.json({
      message: 'Image uploaded and analyzed successfully',
      imageUrl,
      detection
    });
  } catch (error) {
    console.error('Upload error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: 'Upload failed', 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const detectClothes = async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL required' });
    }

    const detection = await detectClothing(imageUrl);
    res.json({ detection });
  } catch (error) {
    res.status(500).json({ message: 'Detection failed', error: error.message });
  }
};

const addToWardrobe = async (req, res) => {
  try {
    const itemData = {
      ...req.body,
      userId: req.user.id
    };

    const wardrobeItem = new WardrobeItem(itemData);
    await wardrobeItem.save();

    res.status(201).json({
      message: 'Item added to wardrobe',
      item: wardrobeItem
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add item', error: error.message });
  }
};

const getWardrobe = async (req, res) => {
  try {
    const { category, color, type, season, page = 1, limit = 20 } = req.query;
    
    const filter = { userId: req.user.id };
    if (category) filter.category = category;
    if (color) filter['color.primary'] = new RegExp(color, 'i');
    if (type) filter.type = type;
    if (season) filter.season = { $in: [season] };

    const items = await WardrobeItem.find(filter)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await WardrobeItem.countDocuments(filter);

    res.json({
      items,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wardrobe', error: error.message });
  }
};

const updateWardrobeItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const item = await WardrobeItem.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item updated successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update item', error: error.message });
  }
};

const deleteWardrobeItem = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await WardrobeItem.findOneAndDelete({
      _id: id,
      userId: req.user.id
    });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item', error: error.message });
  }
};

module.exports = {
  uploadImage,
  detectClothes,
  addToWardrobe,
  getWardrobe,
  updateWardrobeItem,
  deleteWardrobeItem
};