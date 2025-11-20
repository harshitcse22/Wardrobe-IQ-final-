const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testAPIEndpoints() {
  const BASE_URL = 'http://localhost:5000';
  
  console.log('🧪 TESTING API ENDPOINTS\n');
  console.log('Base URL:', BASE_URL);
  console.log('='.repeat(50));

  // Test 1: Health check
  console.log('\n1️⃣ Testing Health Endpoint...');
  try {
    const response = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health check:', response.data);
  } catch (error) {
    console.log('❌ Health check failed:', error.message);
    console.log('⚠️  Make sure server is running: npm start');
    return;
  }

  // Test 2: Upload endpoint
  console.log('\n2️⃣ Testing Upload Endpoint...');
  console.log('Endpoint: POST /api/wardrobe/upload-image');
  
  // Create a test file
  const testImagePath = path.join(__dirname, 'uploads', 'test-image.txt');
  if (!fs.existsSync(testImagePath)) {
    fs.writeFileSync(testImagePath, 'test image content');
  }

  try {
    const formData = new FormData();
    formData.append('image', fs.createReadStream(testImagePath), {
      filename: 'blue-jeans.jpg',
      contentType: 'image/jpeg'
    });

    const response = await axios.post(
      `${BASE_URL}/api/wardrobe/upload-image`,
      formData,
      {
        headers: {
          ...formData.getHeaders()
        }
      }
    );

    console.log('✅ Upload successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    // Test 3: Add to wardrobe
    if (response.data.imageUrl && response.data.detection) {
      console.log('\n3️⃣ Testing Add to Wardrobe...');
      console.log('Endpoint: POST /api/wardrobe/add-to-wardrobe');
      
      const addResponse = await axios.post(
        `${BASE_URL}/api/wardrobe/add-to-wardrobe`,
        {
          name: `${response.data.detection.color.primary} ${response.data.detection.type}`,
          type: response.data.detection.type,
          category: response.data.detection.category,
          color: response.data.detection.color,
          fabric: response.data.detection.fabric,
          imageUrl: response.data.imageUrl
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Add to wardrobe successful!');
      console.log('Response:', JSON.stringify(addResponse.data, null, 2));
    }

  } catch (error) {
    console.log('❌ Upload failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }

  // Test 4: Get wardrobe
  console.log('\n4️⃣ Testing Get Wardrobe...');
  console.log('Endpoint: GET /api/wardrobe');
  
  try {
    const response = await axios.get(`${BASE_URL}/api/wardrobe`);
    console.log('✅ Get wardrobe successful!');
    console.log(`Total items: ${response.data.items.length}`);
    
    const byCategory = {
      tops: response.data.items.filter(i => i.category === 'tops').length,
      bottoms: response.data.items.filter(i => i.category === 'bottoms').length,
      shoes: response.data.items.filter(i => i.category === 'shoes').length
    };
    
    console.log('Items by category:');
    Object.entries(byCategory).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count}`);
    });

  } catch (error) {
    console.log('❌ Get wardrobe failed');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ API Testing Complete\n');
}

testAPIEndpoints();
