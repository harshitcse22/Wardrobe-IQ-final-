import { Upload, Shirt, Sparkles, MapPin, TrendingUp, Calendar, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = ({ user }) => {
  const navigate = useNavigate();

  const dashboardCards = [
    {
      title: 'Upload New Item',
      description: 'Scan and add new items to your wardrobe',
      icon: Upload,
      gradient: 'from-violet-500 to-purple-600',
      path: '/upload',
      bgPattern: 'bg-gradient-to-br from-violet-50 to-purple-50'
    },
    {
      title: 'My Wardrobe',
      description: 'Browse and manage your clothing collection',
      icon: Shirt,
      gradient: 'from-blue-500 to-indigo-600',
      path: '/wardrobe',
      bgPattern: 'bg-gradient-to-br from-blue-50 to-indigo-50'
    },
    {
      title: 'Daily Outfits',
      description: 'Get AI-powered outfit recommendations',
      icon: Sparkles,
      gradient: 'from-emerald-500 to-teal-600',
      path: '/recommendations',
      bgPattern: 'bg-gradient-to-br from-emerald-50 to-teal-50'
    },
    {
      title: 'Trip Planner',
      description: 'Plan outfits for your upcoming trips',
      icon: MapPin,
      gradient: 'from-orange-500 to-red-500',
      path: '/trip-planner',
      bgPattern: 'bg-gradient-to-br from-orange-50 to-red-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Navbar user={user} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">👋</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name?.split(' ')[0] || 'User'}!
              </h1>
              <p className="text-gray-600">
                Ready to create some amazing outfits today?
              </p>
            </div>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {dashboardCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div
                key={index}
                onClick={() => navigate(card.path)}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 cursor-pointer group transition-all duration-300 hover:scale-105 hover:shadow-xl border border-white/50"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${card.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <IconComponent size={24} className="text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                
                <p className="text-gray-600 text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Items</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">24</p>
                <p className="text-sm text-emerald-600 font-medium mt-1">+3 this week</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Shirt size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Outfits Created</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">12</p>
                <p className="text-sm text-blue-600 font-medium mt-1">+2 today</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
                <Sparkles size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Trips Planned</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">3</p>
                <p className="text-sm text-orange-600 font-medium mt-1">1 upcoming</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                <MapPin size={24} className="text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/50 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Favorites</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">8</p>
                <p className="text-sm text-pink-600 font-medium mt-1">Most loved</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center">
                <Heart size={24} className="text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => navigate('/upload')}
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl hover:from-violet-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Upload size={20} />
              <span className="font-semibold">Add New Item</span>
            </button>
            
            <button 
              onClick={() => navigate('/recommendations')}
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-2xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Sparkles size={20} />
              <span className="font-semibold">Get Outfit Ideas</span>
            </button>
            
            <button 
              onClick={() => navigate('/trip-planner')}
              className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl hover:from-orange-600 hover:to-red-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Calendar size={20} />
              <span className="font-semibold">Plan Trip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;