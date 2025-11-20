const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Test database connection
async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('✅ MongoDB connected successfully');
    
    console.log('Testing environment variables...');
    console.log('✅ JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Missing');
    console.log('✅ CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Missing');
    console.log('✅ OPENWEATHER_API_KEY:', process.env.OPENWEATHER_API_KEY ? 'Set' : 'Missing');
    
    console.log('\n🎉 All configurations are ready!');
    console.log('🚀 You can now start the server with: npm run dev');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
}

testConnection();