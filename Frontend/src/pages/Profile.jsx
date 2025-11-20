import { useState } from 'react';
import { User, Settings, Heart, BarChart3, Save } from 'lucide-react';
import Navbar from '../components/Navbar';

const Profile = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState('preferences');
  const [preferences, setPreferences] = useState({
    style: user?.preferences?.style || 'casual',
    favoriteColors: user?.preferences?.favoriteColors || [],
    preferredBrands: user?.preferences?.preferredBrands || [],
    bodyType: user?.preferences?.bodyType || '',
    size: user?.preferences?.size || { top: '', bottom: '', shoes: '' }
  });
  const [saving, setSaving] = useState(false);

  const updatePreferences = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ preferences })
      });

      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        alert('Preferences updated successfully!');
      } else {
        alert('Failed to update preferences');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const styles = ['casual', 'formal', 'sporty', 'trendy', 'classic'];
  const colors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'gray', 'brown', 'pink', 'purple'];
  const bodyTypes = ['pear', 'apple', 'hourglass', 'rectangle', 'inverted-triangle'];

  const toggleColor = (color) => {
    setPreferences(prev => ({
      ...prev,
      favoriteColors: prev.favoriteColors.includes(color)
        ? prev.favoriteColors.filter(c => c !== color)
        : [...prev.favoriteColors, color]
    }));
  };

  const tabs = [
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar user={user} />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">Manage your preferences and view your wardrobe analytics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 sticky top-8">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                <p className="text-gray-600">{user?.email}</p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition ${
                        activeTab === tab.id
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent size={20} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'preferences' && (
              <div className="space-y-6">
                {/* Style Preferences */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Style Preferences</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Preferred Style
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {styles.map(style => (
                          <button
                            key={style}
                            onClick={() => setPreferences({...preferences, style})}
                            className={`px-4 py-3 rounded-lg border text-sm font-medium transition ${
                              preferences.style === style
                                ? 'bg-purple-100 border-purple-300 text-purple-700'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Favorite Colors
                      </label>
                      <div className="grid grid-cols-5 md:grid-cols-10 gap-3">
                        {colors.map(color => (
                          <button
                            key={color}
                            onClick={() => toggleColor(color)}
                            className={`w-12 h-12 rounded-lg border-2 transition ${
                              preferences.favoriteColors.includes(color)
                                ? 'border-purple-500 ring-2 ring-purple-200'
                                : 'border-gray-300 hover:border-gray-400'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          >
                            {preferences.favoriteColors.includes(color) && (
                              <Heart size={16} className="text-white mx-auto" fill="currentColor" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Body Type
                      </label>
                      <select
                        value={preferences.bodyType}
                        onChange={(e) => setPreferences({...preferences, bodyType: e.target.value})}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      >
                        <option value="">Select body type</option>
                        {bodyTypes.map(type => (
                          <option key={type} value={type} className="capitalize">
                            {type.replace('-', ' ')}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Size Information */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Size Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Top Size
                      </label>
                      <input
                        type="text"
                        value={preferences.size.top}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          size: {...preferences.size, top: e.target.value}
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="S, M, L, XL"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bottom Size
                      </label>
                      <input
                        type="text"
                        value={preferences.size.bottom}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          size: {...preferences.size, bottom: e.target.value}
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="28, 30, 32, 34"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Shoe Size
                      </label>
                      <input
                        type="text"
                        value={preferences.size.shoes}
                        onChange={(e) => setPreferences({
                          ...preferences,
                          size: {...preferences.size, shoes: e.target.value}
                        })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="7, 8, 9, 10"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <button
                    onClick={updatePreferences}
                    disabled={saving}
                    className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition duration-200 disabled:opacity-50"
                  >
                    <Save size={20} />
                    <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                {/* Wardrobe Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Items</p>
                        <p className="text-3xl font-bold text-gray-900">24</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <User size={24} className="text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Most Worn</p>
                        <p className="text-lg font-semibold text-gray-900">Blue Jeans</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Heart size={24} className="text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Favorite Color</p>
                        <p className="text-lg font-semibold text-gray-900">Black</p>
                      </div>
                      <div className="w-12 h-12 bg-gray-800 rounded-lg"></div>
                    </div>
                  </div>
                </div>

                {/* Category Breakdown */}
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Wardrobe Breakdown</h3>
                  
                  <div className="space-y-4">
                    {[
                      { category: 'Tops', count: 8, percentage: 33 },
                      { category: 'Bottoms', count: 6, percentage: 25 },
                      { category: 'Shoes', count: 5, percentage: 21 },
                      { category: 'Outerwear', count: 3, percentage: 13 },
                      { category: 'Accessories', count: 2, percentage: 8 }
                    ].map((item) => (
                      <div key={item.category} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-700 font-medium">{item.category}</span>
                          <span className="text-gray-500">({item.count} items)</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600 w-8">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;