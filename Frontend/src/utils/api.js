const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  async getProfile() {
    return this.request('/api/auth/profile');
  }

  async updateProfile(updates) {
    return this.request('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  }

  // Wardrobe endpoints
  async uploadImage(formData) {
    const token = localStorage.getItem('token');
    return fetch(`${this.baseURL}/api/wardrobe/upload-image`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    }).then(res => res.json());
  }

  async addToWardrobe(itemData) {
    return this.request('/api/wardrobe/add-to-wardrobe', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  }

  async getWardrobe(filters = {}) {
    const queryParams = new URLSearchParams(filters);
    return this.request(`/api/wardrobe?${queryParams}`);
  }

  async deleteWardrobeItem(itemId) {
    return this.request(`/api/wardrobe/${itemId}`, {
      method: 'DELETE'
    });
  }

  // Recommendations endpoints
  async getRecommendations(data) {
    return this.request('/api/recommendations/recommend-outfit', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async saveOutfit(outfitData) {
    return this.request('/api/recommendations/save-outfit', {
      method: 'POST',
      body: JSON.stringify(outfitData)
    });
  }

  // Trip planner endpoints
  async createTripPlan(tripData) {
    return this.request('/api/trips/trip-planner', {
      method: 'POST',
      body: JSON.stringify(tripData)
    });
  }

  async getTripPlans() {
    return this.request('/api/trips');
  }
}

export default new ApiService();