import { useState, useEffect } from 'react';
import { RefreshCw, Cloud, Heart, Save } from 'lucide-react';
import Navbar from '../components/Navbar';

const Recommendations = () => {
  const [weather, setWeather] = useState(null);
  const [occasion, setOccasion] = useState('casual');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getRecommendations();
  }, [occasion]);

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/recommendations/recommend-outfit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          occasion,
          city: 'New York'
        })
      });

      const data = await response.json();
      console.log('Recommendations response:', data);
      if (response.ok) {
        setWeather(data.weather);
        // Ensure recommendations is always an array
        const recs = Array.isArray(data.recommendations) ? data.recommendations : [];
        setRecommendations(recs);
      } else {
        console.error('Recommendations API error:', data);
        setRecommendations([]);
      }
    } catch (error) {
      console.error('Failed to get recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveOutfit = async (outfit) => {
    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/recommendations/save-outfit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          name: `${occasion} outfit for ${new Date().toLocaleDateString()}`,
          items: outfit.items,
          occasion,
          weather
        })
      });

      if (response.ok) {
        alert('Outfit saved successfully!');
      } else {
        alert('Failed to save outfit');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const occasions = ['casual', 'formal', 'work', 'party', 'sport', 'beach'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Outfit Recommendations</h1>
          <p className="text-gray-600">Get AI-powered outfit suggestions based on weather and occasion</p>
        </div>

        {/* Weather & Occasion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Weather Widget */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Cloud size={32} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Today's Weather</h3>
                {weather ? (
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{weather.temperature}°C</p>
                    <p className="text-gray-600 capitalize">{weather.condition}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">Loading weather...</p>
                )}
              </div>
            </div>
          </div>

          {/* Occasion Selector */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Occasion</h3>
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              {occasions.map(occ => (
                <option key={occ} value={occ} className="capitalize">{occ}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={getRecommendations}
            disabled={loading}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-200 disabled:opacity-50"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            <span>{loading ? 'Getting Recommendations...' : 'Refresh Suggestions'}</span>
          </button>
        </div>

        {/* Recommendations */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No recommendations available</h3>
            <p className="text-gray-600 mb-6">Add more items to your wardrobe to get better recommendations!</p>
            <button
              onClick={() => window.location.href = '/upload'}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Add More Items
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((outfit, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Outfit {index + 1}</h3>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-red-500 transition">
                      <Heart size={18} />
                    </button>
                    <button
                      onClick={() => saveOutfit(outfit)}
                      disabled={saving}
                      className="p-2 text-gray-400 hover:text-blue-500 transition"
                    >
                      <Save size={18} />
                    </button>
                  </div>
                </div>

                {/* Outfit Visualization */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mb-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">👕</div>
                    <p className="text-sm text-gray-600">Outfit Preview</p>
                  </div>
                </div>

                {/* Outfit Items */}
                <div className="space-y-3">
                  {outfit.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-xs">👔</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {item.name || item.category}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {item.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Outfit Score */}
                {outfit.score && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Match Score</span>
                      <span className="text-sm font-semibold text-green-600">
                        {Math.round(outfit.score)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Recommendations;