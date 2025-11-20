const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function checkUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected to MongoDB');

    const users = await User.find({}).select('name email _id');
    console.log('Users in database:', users.length);
    
    if (users.length > 0) {
      console.log('First user:', users[0]);
    } else {
      console.log('No users found - this might be the issue!');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

checkUsers();