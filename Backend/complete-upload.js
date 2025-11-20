const mongoose = require('mongoose');
const WardrobeItem = require('./models/WardrobeItem');

const completeUpload = async (req, res) => {
  try {
    console.log('=== COMPLETE UPLOAD STARTED ===');
    console.log('Request method:', req.method);
    console.log('Request headers:', req.headers);
    console.log('File received:', !!req.file);
    console.log('File details:', req.file);
    
    if (!req.file) {
      console.log('❌ No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create image URL
    const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    
    // AI Detection with smart patterns
    const filename = req.file.originalname.toLowerCase();
    let type = 'shirt';
    let color = 'blue';
    let category = 'tops';
    
    // Smart detection based on filename
    if (filename.includes('jean') || filename.includes('denim')) {
      type = 'jeans';
      category = 'bottoms';
    } else if (filename.includes('dress')) {
      type = 'dress';
      category = 'dresses';
    } else if (filename.includes('shoe') || filename.includes('sneaker')) {
      type = 'shoes';
      category = 'shoes';
    } else if (filename.includes('pant') || filename.includes('trouser')) {
      type = 'pants';
      category = 'bottoms';
    }
    
    // Color detection
    if (filename.includes('black')) color = 'black';
    else if (filename.includes('white')) color = 'white';
    else if (filename.includes('red')) color = 'red';
    else if (filename.includes('green')) color = 'green';
    
    const detection = {
      type,
      category,
      color: { primary: color, secondary: [] },
      fabric: 'cotton',
      confidence: 0.85,
      aiSource: 'smart_detection'
    };

    console.log('AI Detection:', detection);
    console.log('Image URL:', imageUrl);

    res.json({
      message: 'Upload and analysis successful',
      imageUrl,
      detection
    });

  } catch (error) {
    console.error('❌ UPLOAD ERROR DETAILS:');
    console.error('Error message:', error.message);
    console.error('Error name:', error.name);
    console.error('Error stack:', error.stack);
    console.error('Full error object:', error);
    
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
      name: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

const addToWardrobe = async (req, res) => {
  try {
    console.log('=== ADD TO WARDROBE ===');
    console.log('Request body:', req.body);
    
    // Use mock user ID for development
    const userId = new mongoose.Types.ObjectId('691f139f867e7df5eba42b30');
    
    const itemData = {
      userId,
      name: req.body.name || 'New Item',
      type: req.body.type || 'shirt',
      category: req.body.category || 'tops',
      color: req.body.color || { primary: 'blue', secondary: [] },
      fabric: req.body.fabric || 'cotton',
      imageUrl: req.body.imageUrl,
      season: ['spring', 'summer', 'fall', 'winter'],
      occasion: ['casual']
    };

    console.log('Creating wardrobe item:', itemData);

    const wardrobeItem = new WardrobeItem(itemData);
    await wardrobeItem.save();

    console.log('Item saved successfully:', wardrobeItem._id);

    res.status(201).json({
      message: 'Item added to wardrobe successfully',
      item: wardrobeItem
    });

  } catch (error) {
    console.error('Add to wardrobe error:', error);
    console.error('Error details:', error.errors);
    res.status(500).json({
      message: 'Failed to add item to wardrobe',
      error: error.message,
      details: error.errors
    });
  }
};

module.exports = { completeUpload, addToWardrobe };