import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Wardrobe from './pages/Wardrobe';
import Recommendations from './pages/Recommendations';
import TripPlanner from './pages/TripPlanner';
import Profile from './pages/Profile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend using cookies (primary) and header (fallback)
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include' // Important: Include cookies
      })
      .then(res => {
        console.log('Profile check response status:', res.status);
        if (res.ok) {
          return res.json();
        } else {
          // If profile check fails, clear invalid token
          localStorage.removeItem('token');
          throw new Error(`Profile check failed: ${res.status}`);
        }
      })
      .then(data => {
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem('token');
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route 
            path="/login" 
            element={!user ? <Login setUser={setUser} /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/upload" 
            element={user ? <Upload /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/wardrobe" 
            element={user ? <Wardrobe /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/recommendations" 
            element={user ? <Recommendations /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/trip-planner" 
            element={user ? <TripPlanner /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/profile" 
            element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" />} 
          />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;