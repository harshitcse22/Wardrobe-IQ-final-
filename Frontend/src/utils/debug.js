// Debug utility to check environment variables
export const debugEnv = () => {
  console.log('Environment variables:');
  console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
  console.log('All env vars:', import.meta.env);
  
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  console.log('Final API URL:', apiUrl);
  
  return apiUrl;
};

export const testConnection = async () => {
  const apiUrl = debugEnv();
  
  try {
    console.log('Testing connection to:', `${apiUrl}/api/health`);
    const response = await fetch(`${apiUrl}/api/health`);
    const data = await response.json();
    console.log('Connection test result:', data);
    return true;
  } catch (error) {
    console.error('Connection test failed:', error);
    return false;
  }
};