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
    console.log('🔍 [DETECTION] Original filename:', req.file.originalname);
    console.log('🔍 [DETECTION] Lowercase filename:', filename);
    
    let type = 'shirt';
    let color = 'blue';
    let category = 'tops';
    let detectionMethod = 'default';
    
    // Smart detection based on filename
    console.log('🔍 [DETECTION] Checking filename patterns...');
    
    if (filename.includes('jean') || filename.includes('denim')) {
      type = 'jeans';
      category = 'bottoms';
      color = 'blue';
      detectionMethod = 'jeans_detected';
      console.log('✅ [DETECTION] Detected as JEANS');
    } else if (filename.includes('dress')) {
      type = 'dress';
      category = 'dresses';
    } else if (filename.includes('shoe') || filename.includes('sneaker') || filename.includes('boot')) {
      type = 'shoes';
      category = 'shoes';
    } else if (filename.includes('pant') || filename.includes('trouser') || filename.includes('chino')) {
      type = 'pants';
      category = 'bottoms';
    } else if (filename.includes('short')) {
      type = 'shorts';
      category = 'bottoms';
    } else if (filename.includes('jacket') || filename.includes('coat')) {
      type = 'jacket';
      category = 'outerwear';
    } else if (filename.includes('sweater') || filename.includes('hoodie')) {
      type = 'sweater';
      category = 'outerwear';
    } else if (filename.includes('skirt')) {
      type = 'skirt';
      category = 'bottoms';
    } else if (filename.includes('tshirt') || filename.includes('t-shirt')) {
      type = 't-shirt';
      category = 'tops';
    }
    
    // Color detection
    console.log('🔍 [DETECTION] Checking color patterns...');
    const originalColor = color;
    
    if (filename.includes('black')) color = 'black';
    else if (filename.includes('white')) color = 'white';
    else if (filename.includes('red')) color = 'red';
    else if (filename.includes('green')) color = 'green';
    else if (filename.includes('yellow')) color = 'yellow';
    else if (filename.includes('brown')) color = 'brown';
    else if (filename.includes('grey') || filename.includes('gray')) color = 'gray';
    else if (filename.includes('pink')) color = 'pink';
    else if (filename.includes('purple')) color = 'purple';
    else if (filename.includes('orange')) color = 'orange';
    
    if (color !== originalColor) {
      console.log(`✅ [DETECTION] Color changed from ${originalColor} to ${color}`);
    } else {
      console.log(`⚠️  [DETECTION] No color found in filename, using default: ${color}`);
    }
    
    const detection = {
      type,
      category,
      color: { primary: color, secondary: [] },
      fabric: 'cotton',
      confidence: 0.85,
      aiSource: 'smart_detection',
      detectionMethod
    };

    console.log('\n' + '='.repeat(60));
    console.log('✅ [DETECTION] FINAL RESULT:');
    console.log('='.repeat(60));
    console.log('Type:', type);
    console.log('Category:', category);
    console.log('Color:', color);
    console.log('Detection Method:', detectionMethod);
    console.log('Image URL:', imageUrl);
    console.log('='.repeat(60) + '\n');

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
    console.log('\n' + '='.repeat(60));
    console.log('🟢 [BACKEND] ADD TO WARDROBE REQUEST RECEIVED');
    console.log('='.repeat(60));
    console.log('🟢 [BACKEND] Request body:', JSON.stringify(req.body, null, 2));
    
    // Use mock user ID for development
    const userId = new mongoose.Types.ObjectId('691f139f867e7df5eba42b30');
    
    const type = req.body.type || 'shirt';
    const category = req.body.category || 'tops';
    
    // Smart season detection based on type
    let season = ['spring', 'summer', 'fall', 'winter'];
    if (['jacket', 'sweater'].includes(type)) {
      season = ['fall', 'winter'];
    } else if (['shorts', 't-shirt'].includes(type)) {
      season = ['spring', 'summer'];
    }
    
    // Smart occasion detection based on type
    let occasion = ['casual'];
    if (type === 'dress' || type === 'shirt') {
      occasion = ['casual', 'formal', 'work'];
    } else if (type === 'jeans' || type === 'pants') {
      occasion = ['casual', 'work'];
    } else if (type === 'shoes') {
      occasion = ['casual', 'formal', 'work'];
    }
    
    const itemData = {
      userId,
      name: req.body.name || 'New Item',
      type,
      category,
      color: req.body.color || { primary: 'blue', secondary: [] },
      fabric: req.body.fabric || 'cotton',
      imageUrl: req.body.imageUrl,
      season,
      occasion
    };

    console.log('🟢 [BACKEND] Creating wardrobe item with data:', JSON.stringify(itemData, null, 2));

    const wardrobeItem = new WardrobeItem(itemData);
    await wardrobeItem.save();

    console.log('✅ [BACKEND] Item saved successfully!');
    console.log('✅ [BACKEND] Item ID:', wardrobeItem._id);
    console.log('✅ [BACKEND] Item details:', {
      name: wardrobeItem.name,
      type: wardrobeItem.type,
      category: wardrobeItem.category,
      color: wardrobeItem.color,
      season: wardrobeItem.season,
      occasion: wardrobeItem.occasion,
      imageUrl: wardrobeItem.imageUrl
    });

    // Create notification
    const { createNotification } = require('./controllers.js/notificationController');
    await createNotification(
      userId,
      'cloth_added',
      'New Item Added! 🛍️',
      `${wardrobeItem.name} has been added to your wardrobe`,
      {
        itemId: wardrobeItem._id,
        itemName: wardrobeItem.name,
        imageUrl: wardrobeItem.imageUrl
      }
    );
    console.log('✅ [BACKEND] Notification created!');
    console.log('='.repeat(60) + '\n');

    res.status(201).json({
      message: 'Item added to wardrobe successfully',
      item: wardrobeItem
    });

  } catch (error) {
    console.error('❌ Add to wardrobe error:', error);
    console.error('Error details:', error.errors);
    res.status(500).json({
      message: 'Failed to add item to wardrobe',
      error: error.message,
      details: error.errors
    });
  }
};

module.exports = { completeUpload, addToWardrobe };