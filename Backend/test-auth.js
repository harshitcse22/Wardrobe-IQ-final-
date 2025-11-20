console.log('🧪 WardrobeIQ Backend Test Instructions\n');

console.log('To test the backend manually:');
console.log('1. Make sure the backend server is running: npm run dev');
console.log('2. Open your browser and go to: http://localhost:5173');
console.log('3. Try to register a new account');
console.log('4. Check the browser console (F12) for any errors');
console.log('5. Check the backend terminal for request logs\n');

console.log('Expected behavior:');
console.log('✅ Registration should work without 500 errors');
console.log('✅ Login should work and set cookies');
console.log('✅ Profile access should work with cookies');
console.log('✅ No 401 errors on profile endpoint\n');

console.log('If you see errors, check:');
console.log('- MongoDB connection in backend terminal');
console.log('- CORS settings allow localhost:5173');
console.log('- Cookies are being set and sent');
console.log('- JWT tokens are being generated\n');

console.log('🚀 Start the servers and test in browser!');