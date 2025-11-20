const { completeUpload } = require('./complete-upload');

// Mock request and response objects
const mockReq = {
  file: {
    filename: 'test-blue-shirt.jpg',
    originalname: 'blue-shirt.jpg'
  }
};

const mockRes = {
  json: (data) => {
    console.log('✅ Response:', JSON.stringify(data, null, 2));
  },
  status: (code) => {
    console.log('Status:', code);
    return mockRes;
  }
};

console.log('🧪 Testing complete upload function...\n');

completeUpload(mockReq, mockRes)
  .then(() => {
    console.log('\n✅ Test completed successfully!');
  })
  .catch((error) => {
    console.error('\n❌ Test failed:', error.message);
  });