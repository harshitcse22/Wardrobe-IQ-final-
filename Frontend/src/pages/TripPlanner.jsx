import { useState, useEffect } from 'react';
import { Calendar, MapPin, Luggage, X } from 'lucide-react';
import Navbar from '../components/Navbar';

const TripPlanner = () => {
  const [tripData, setTripData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    tripType: 'vacation',
    activities: []
  });
  const [tripPlan, setTripPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trips, setTrips] = useState([]);
  const [showAllOutfits, setShowAllOutfits] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [generatingOutfit, setGeneratingOutfit] = useState(null);

  const generateOutfitForDay = async (dayOutfit, dayIndex) => {
    setGeneratingOutfit(dayIndex);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/recommendations/recommend-outfit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        credentials: 'include',
        body: JSON.stringify({
          occasion: dayOutfit.occasion || 'casual',
          city: selectedTrip.destination
        })
      });

      const data = await response.json();
      if (response.ok && data.recommendations && data.recommendations.length > 0) {
        const outfit = data.recommendations[0];
        const updatedTrip = { ...selectedTrip };
        updatedTrip.outfits[dayIndex].items = outfit.items;
        setSelectedTrip(updatedTrip);
      } else {
        alert('No recommendations available. Please add more items to your wardrobe.');
      }
    } catch (error) {
      console.error('Failed to generate outfit:', error);
      alert('Failed to generate outfit. Please try again.');
    } finally {
      setGeneratingOutfit(null);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setTrips(data.tripPlans || []);
      }
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    }
  };

  const createTripPlan = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/trips/trip-planner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(tripData)
      });

      const data = await response.json();
      if (response.ok) {
        setTripPlan(data.tripPlan);
        fetchTrips(); // Refresh trips list
      } else {
        alert(data.message || 'Failed to create trip plan');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const tripTypes = ['vacation', 'business', 'weekend', 'adventure'];
  const commonActivities = ['sightseeing', 'dining', 'shopping', 'meetings', 'outdoor', 'nightlife'];

  const toggleActivity = (activity) => {
    setTripData(prev => ({
      ...prev,
      activities: prev.activities.includes(activity)
        ? prev.activities.filter(a => a !== activity)
        : [...prev.activities, activity]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Trip Planner</h1>
          <p className="text-gray-600">Plan your outfits for upcoming trips with AI assistance</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trip Input Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Plan New Trip</h3>
              
              <form onSubmit={createTripPlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={tripData.destination}
                      onChange={(e) => setTripData({...tripData, destination: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      placeholder="Paris, France"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={tripData.startDate}
                      onChange={(e) => setTripData({...tripData, startDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={tripData.endDate}
                      onChange={(e) => setTripData({...tripData, endDate: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trip Type
                  </label>
                  <select
                    value={tripData.tripType}
                    onChange={(e) => setTripData({...tripData, tripType: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  >
                    {tripTypes.map(type => (
                      <option key={type} value={type} className="capitalize">{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activities
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {commonActivities.map(activity => (
                      <button
                        key={activity}
                        type="button"
                        onClick={() => toggleActivity(activity)}
                        className={`px-3 py-2 text-sm rounded-lg border transition ${
                          tripData.activities.includes(activity)
                            ? 'bg-purple-100 border-purple-300 text-purple-700'
                            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {activity}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition duration-200 disabled:opacity-50"
                >
                  {loading ? 'Creating Plan...' : 'Create Trip Plan'}
                </button>
              </form>
            </div>
          </div>

          {/* Trip Plan Results */}
          <div className="lg:col-span-2">
            {tripPlan ? (
              <div className="space-y-6">
                {/* Trip Overview */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {tripPlan.destination} Trip Plan
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <Calendar size={24} className="mx-auto text-blue-600 mb-2" />
                      <p className="text-sm text-gray-600">Duration</p>
                      <p className="font-semibold">
                        {Math.ceil((new Date(tripPlan.endDate) - new Date(tripPlan.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                      </p>
                    </div>
                    
                    <div className="text-center">
                      <Luggage size={24} className="mx-auto text-green-600 mb-2" />
                      <p className="text-sm text-gray-600">Items to Pack</p>
                      <p className="font-semibold">{tripPlan.packingList?.length || 0}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌤️</div>
                      <p className="text-sm text-gray-600">Avg Temp</p>
                      <p className="font-semibold">{tripPlan.weather?.avgTemp || 22}°C</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl mb-2">👔</div>
                      <p className="text-sm text-gray-600">Outfits</p>
                      <p className="font-semibold">{tripPlan.outfits?.length || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Daily Outfits */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Daily Outfit Plan</h4>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => setShowAllOutfits(true)}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 transition duration-200 shadow-lg hover:shadow-xl"
                    >
                      View All Daily Outfits with Photos →
                    </button>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tripPlan.outfits?.map((dayOutfit, index) => (
                        <div 
                          key={index} 
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900">Day {dayOutfit.day}</h5>
                            <span className="text-sm bg-purple-100 text-purple-700 px-2 py-1 rounded-full capitalize">
                              {dayOutfit.occasion}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            {dayOutfit.items?.map((itemId, itemIndex) => (
                              <div key={itemIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                <span>Clothing Item {itemIndex + 1}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Packing List */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Packing Checklist</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tripPlan.packingList?.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          defaultChecked={item.packed}
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="text-gray-700">Packing Item {index + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Previous Trips */
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900">Your Trip Plans</h3>
                
                {trips.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">✈️</div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">No trips planned yet</h4>
                    <p className="text-gray-600">Create your first trip plan to get started!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {trips.map((trip) => (
                      <div key={trip._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900">{trip.destination}</h4>
                          <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full capitalize">
                            {trip.tripType}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <p>📅 {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</p>
                          <p>👔 {trip.outfits?.length || 0} outfits planned</p>
                          <p>🧳 {trip.packingList?.length || 0} items to pack</p>
                        </div>
                        
                        <button
                          onClick={() => setSelectedTrip(trip)}
                          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition duration-200"
                        >
                          View Details
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selected Trip Details Modal */}
      {selectedTrip && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedTrip.destination} - Daily Outfits</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedTrip.outfits?.length || 0} days planned • {new Date(selectedTrip.startDate).toLocaleDateString()} - {new Date(selectedTrip.endDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setSelectedTrip(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {selectedTrip.outfits?.map((dayOutfit, dayIndex) => (
                <div key={dayIndex} className="border-b border-gray-200 last:border-b-0 pb-8 last:pb-0">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">Day {dayOutfit.day}</h4>
                      <p className="text-sm text-gray-600 capitalize mt-1">
                        Occasion: <span className="font-medium text-purple-600">{dayOutfit.occasion}</span>
                      </p>
                    </div>
                    <div className="text-sm bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium">
                      {dayOutfit.items?.length || 0} items
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dayOutfit.items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
                        <div className="aspect-square bg-white rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`}
                              alt={item.name || 'Clothing item'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full flex items-center justify-center text-6xl" style={{display: item.imageUrl ? 'none' : 'flex'}}>
                            {item.category === 'tops' ? '👕' : 
                             item.category === 'bottoms' ? '👖' : 
                             item.category === 'shoes' ? '👟' : 
                             item.category === 'outerwear' ? '🧥' : '👔'}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h5 className="font-semibold text-gray-900 text-lg capitalize">
                            {item.name || item.type || 'Clothing Item'}
                          </h5>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 capitalize">Category:</span>
                            <span className="font-medium text-gray-900 capitalize">{item.category}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium text-gray-900 capitalize">{item.type}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Color:</span>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.color?.primary || item.color }}
                              ></div>
                              <span className="font-medium text-gray-900 capitalize">
                                {item.color?.primary || item.color}
                              </span>
                            </div>
                          </div>
                          
                          {item.fabric && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Fabric:</span>
                              <span className="font-medium text-gray-900 capitalize">{item.fabric}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {(!dayOutfit.items || dayOutfit.items?.length === 0) && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <div className="text-6xl mb-4">👔</div>
                      <p className="text-gray-600 mb-4">No items planned for this day</p>
                      <button
                        onClick={() => generateOutfitForDay(dayOutfit, dayIndex)}
                        disabled={generatingOutfit === dayIndex}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition duration-200 disabled:opacity-50"
                      >
                        {generatingOutfit === dayIndex ? 'Generating...' : 'Generate Outfit Recommendation'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Outfits Modal for Current Trip Plan */}
      {showAllOutfits && tripPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-3xl">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{tripPlan.destination} - Daily Outfits</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {tripPlan.outfits?.length || 0} days planned
                </p>
              </div>
              <button
                onClick={() => setShowAllOutfits(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              {tripPlan.outfits?.map((dayOutfit, dayIndex) => (
                <div key={dayIndex} className="border-b border-gray-200 last:border-b-0 pb-8 last:pb-0">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">Day {dayOutfit.day}</h4>
                      <p className="text-sm text-gray-600 capitalize mt-1">
                        Occasion: <span className="font-medium text-purple-600">{dayOutfit.occasion}</span>
                      </p>
                    </div>
                    <div className="text-sm bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium">
                      {dayOutfit.items?.length || 0} items
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dayOutfit.items?.map((item, itemIndex) => (
                      <div key={itemIndex} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-200">
                        <div className="aspect-square bg-white rounded-xl mb-4 flex items-center justify-center overflow-hidden">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`}
                              alt={item.name || 'Clothing item'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full flex items-center justify-center text-6xl" style={{display: item.imageUrl ? 'none' : 'flex'}}>
                            {item.category === 'tops' ? '👕' : 
                             item.category === 'bottoms' ? '👖' : 
                             item.category === 'shoes' ? '👟' : 
                             item.category === 'outerwear' ? '🧥' : '👔'}
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h5 className="font-semibold text-gray-900 text-lg capitalize">
                            {item.name || item.type || 'Clothing Item'}
                          </h5>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 capitalize">Category:</span>
                            <span className="font-medium text-gray-900 capitalize">{item.category}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Type:</span>
                            <span className="font-medium text-gray-900 capitalize">{item.type}</span>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Color:</span>
                            <div className="flex items-center space-x-2">
                              <div 
                                className="w-4 h-4 rounded-full border border-gray-300"
                                style={{ backgroundColor: item.color?.primary || item.color }}
                              ></div>
                              <span className="font-medium text-gray-900 capitalize">
                                {item.color?.primary || item.color}
                              </span>
                            </div>
                          </div>
                          
                          {item.fabric && (
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">Fabric:</span>
                              <span className="font-medium text-gray-900 capitalize">{item.fabric}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {dayOutfit.items?.length === 0 && (
                    <div className="text-center py-12 bg-gray-50 rounded-xl">
                      <div className="text-6xl mb-4">👔</div>
                      <p className="text-gray-600">No items planned for this day</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TripPlanner;