import { useState, useEffect } from 'react';
import { Filter, Edit, Trash2, Search } from 'lucide-react';
import Navbar from '../components/Navbar';

const Wardrobe = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    color: '',
    type: '',
    search: ''
  });

  useEffect(() => {
    fetchWardrobeItems();
  }, [filters]);

  const fetchWardrobeItems = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wardrobe?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include'
      });
      
      console.log('Wardrobe fetch response:', response.status);

      const data = await response.json();
      console.log('Wardrobe data received:', data);
      
      if (response.ok) {
        setItems(data.items || []);
      } else {
        console.error('Failed to fetch wardrobe:', data);
      }
    } catch (error) {
      console.error('Failed to fetch wardrobe items:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/wardrobe/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        setItems(items.filter(item => item._id !== itemId));
      } else {
        alert('Failed to delete item');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const categories = ['tops', 'bottoms', 'dresses', 'outerwear', 'shoes', 'accessories'];
  const colors = ['black', 'white', 'blue', 'red', 'green', 'yellow', 'gray', 'brown', 'pink', 'purple'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wardrobe</h1>
          <p className="text-gray-600">Manage your clothing collection</p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Filter size={20} className="text-gray-500" />
            <h3 className="font-semibold text-gray-900">Filters</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                value={filters.search}
                onChange={(e) => setFilters({...filters, search: e.target.value})}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
              />
            </div>

            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="capitalize">{cat}</option>
              ))}
            </select>

            <select
              value={filters.color}
              onChange={(e) => setFilters({...filters, color: e.target.value})}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="">All Colors</option>
              {colors.map(color => (
                <option key={color} value={color} className="capitalize">{color}</option>
              ))}
            </select>

            <button
              onClick={() => setFilters({ category: '', color: '', type: '', search: '' })}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 shadow-lg border border-white/50 animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">👕</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600 mb-6">Start building your wardrobe by uploading some clothes!</p>
            <button
              onClick={() => window.location.href = '/upload'}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              Upload First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item._id} className="bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300 group">
                <div className="relative">
                  <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl">👕</div>
                    )}
                  </div>
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex space-x-1">
                      <button className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50">
                        <Edit size={16} className="text-gray-600" />
                      </button>
                      <button 
                        onClick={() => deleteItem(item._id)}
                        className="p-2 bg-white rounded-lg shadow-sm hover:bg-red-50"
                      >
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 capitalize">
                    {item.name || `${item.color?.primary} ${item.type}`}
                  </h3>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 capitalize">{item.category}</span>
                    <span className="text-sm text-gray-600 capitalize">{item.type}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: item.color?.primary }}
                    ></div>
                    <span className="text-sm text-gray-600 capitalize">{item.color?.primary}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full capitalize">
                      {item.fabric}
                    </span>
                    {item.isFavorite && (
                      <span className="text-red-500">❤️</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wardrobe;