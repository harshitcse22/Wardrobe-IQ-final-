const { detectClothing } = require('./services/aiService');

async function testAI() {
  console.log('🤖 Testing AI Clothing Detection...\n');
  
  // Test with a sample image URL
  const testImageUrl = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400';
  
  try {
    console.log('Testing Hugging Face AI...');
    const hfResult = await detectClothing(testImageUrl, 'huggingface');
    console.log('✅ Hugging Face Result:', hfResult);
    
    console.log('\nTesting Auto-selection...');
    const autoResult = await detectClothing(testImageUrl, 'auto');
    console.log('✅ Auto Result:', autoResult);
    
    console.log('\n🎉 AI Integration Working!');
  } catch (error) {
    console.log('❌ AI Test Failed:', error.message);
    console.log('Using fallback detection...');
    
    const fallbackResult = await detectClothing(testImageUrl, 'fallback');
    console.log('✅ Fallback Result:', fallbackResult);
  }
}

testAI();