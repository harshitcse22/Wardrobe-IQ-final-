# WardrobeIQ Backend API

## Overview
Backend API for WardrobeIQ - AI-powered wardrobe management system with outfit recommendations and trip planning.

## Features Implemented ✅

### Core API Endpoints
- **Authentication**: `/api/auth`
  - POST `/register` - User registration
  - POST `/login` - User login
  - POST `/logout` - User logout
  - GET `/profile` - Get user profile
  - PUT `/profile` - Update user profile

- **Wardrobe Management**: `/api/wardrobe`
  - POST `/upload-image` - Upload clothing images
  - POST `/detect-clothes` - AI clothing detection
  - POST `/add-to-wardrobe` - Add items to wardrobe
  - GET `/` - Get wardrobe items (with filters)
  - PUT `/:id` - Update wardrobe item
  - DELETE `/:id` - Delete wardrobe item

- **Recommendations**: `/api/recommendations`
  - POST `/recommend-outfit` - Get daily outfit suggestions
  - POST `/save-outfit` - Save outfit combinations
  - GET `/outfits` - Get saved outfits

- **Trip Planning**: `/api/trips`
  - POST `/trip-planner` - Create trip plans
  - GET `/` - Get trip plans
  - PUT `/:id` - Update trip plan
  - DELETE `/:id` - Delete trip plan

### Database Collections
- **users** - User accounts and preferences
- **wardrobe_items** - Clothing items with AI-detected attributes
- **outfits** - Saved outfit combinations
- **trip_plans** - Trip planning with outfits and packing lists

### AI Integration ✅
- **Hugging Face AI** - Free image classification (primary)
- **Replicate AI** - Alternative free service (backup)
- **Smart Fallback** - Always works even without API keys
- Clothing detection: type, color, fabric, category
- Confidence scoring and source tracking
- Auto-selection between AI services

### External APIs
- **Cloudinary** - Image storage and processing
- **OpenWeather API** - Weather data for recommendations
- **Hugging Face** - Free AI image classification
- **Replicate** - Alternative AI service (optional)

## Environment Variables Required
```
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
OPENWEATHER_API_KEY=your_openweather_key
REPLICATE_API_TOKEN=your_replicate_token_here
NODE_ENV=development
```

## Installation & Setup
```bash
npm install
npm run dev
```

## API Usage Examples

### Register User
```bash
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Upload & Detect Clothing
```bash
POST /api/wardrobe/upload-image
Content-Type: multipart/form-data
image: [file]
```

### Get Outfit Recommendations
```bash
POST /api/recommendations/recommend-outfit
{
  "occasion": "casual",
  "city": "New York"
}
```

### Create Trip Plan
```bash
POST /api/trips/trip-planner
{
  "destination": "Paris",
  "startDate": "2024-06-01",
  "endDate": "2024-06-07",
  "tripType": "vacation",
  "activities": ["sightseeing", "dining"]
}
```

## AI Services Setup (Optional)

### Free Options Available:
1. **Hugging Face** (Recommended)
   - Sign up at https://huggingface.co
   - No API key needed for basic usage
   - Works out of the box

2. **Replicate** (Alternative)
   - Sign up at https://replicate.com
   - Add REPLICATE_API_TOKEN to .env
   - Free tier available

3. **Fallback System**
   - Always works without any setup
   - Smart mock detection
   - No external dependencies

## Testing AI
```bash
npm run test-config  # Test all configurations
node test-ai.js      # Test AI specifically
```

## Status: ✅ COMPLETE WITH REAL AI
All backend features implemented with working AI integration and multiple fallback options.