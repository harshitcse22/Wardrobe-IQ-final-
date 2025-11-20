const simpleUpload = async (req, res) => {
  try {
    console.log('=== UPLOAD REQUEST ===');
    console.log('Method:', req.method);
    console.log('Headers:', req.headers);
    console.log('File:', req.file);
    console.log('Body:', req.body);
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Simple AI detection
    const detection = {
      type: 'shirt',
      category: 'tops', 
      color: { primary: 'blue', secondary: [] },
      fabric: 'cotton',
      confidence: 0.8,
      aiSource: 'simple'
    };

    console.log('=== RESPONSE ===');
    console.log('Detection:', detection);

    res.json({
      message: 'Upload successful',
      imageUrl: `/uploads/${req.file.filename}`,
      detection
    });

  } catch (error) {
    console.error('=== ERROR ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    
    res.status(500).json({
      message: 'Upload failed',
      error: error.message
    });
  }
};

module.exports = { simpleUpload };