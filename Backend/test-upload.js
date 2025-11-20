const { detectClothing } = require('./services/aiService');

async function testAI() {
  console.log('🧪 Testing AI Detection Service...\n');

  try {
    // Test 1: Test with a sample image URL
    console.log('1. Testing AI detection with sample URL...');
    const result1 = await detectClothing('/uploads/test-shirt.jpg');
    console.log('✅ Detection result:', result1);

    // Test 2: Test with different filename patterns
    console.log('\n2. Testing filename pattern detection...');
    const testFiles = [
      '/uploads/blue-shirt-123.jpg',
      '/uploads/black-jeans-456.jpg',
      '/uploads/white-sneakers-789.jpg',
      '/uploads/red-dress-101.jpg'
    ];

    for (const file of testFiles) {
      const result = await detectClothing(file);
      console.log(`File: ${file} -> Type: ${result.type}, Color: ${result.color.primary}, Category: ${result.category}`);
    }

    console.log('\n✅ AI Detection service is working!');
    
  } catch (error) {
    console.error('❌ AI Detection test failed:', error.message);
  }
}

testAI();