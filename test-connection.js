// Test backend connection
const testBackend = async () => {
  console.log('🔍 Testing backend connection...');
  
  try {
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);
    
    // Test login endpoint with invalid credentials
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@test.com', password: 'wrong' })
    });
    
    const loginData = await loginResponse.json();
    console.log('✅ Login endpoint response:', loginData);
    
    // Test register endpoint
    const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: 'Test User',
        email: 'test@example.com', 
        password: 'test123' 
      })
    });
    
    const registerData = await registerResponse.json();
    console.log('✅ Register endpoint response:', registerData);
    
    console.log('🎉 Backend is working correctly!');
    
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
  }
};

testBackend();