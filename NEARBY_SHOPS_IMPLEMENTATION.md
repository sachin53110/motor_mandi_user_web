# Nearby Shops Feature - Implementation Guide

## Overview
This feature enables users to discover and view nearby repair shops, tire dealers, and automotive service centers on an interactive map and in a list view. It integrates with your backend API and uses Google Maps for visualization.

## Features Implemented

### 1. **API Integration** (`src/api/ApiProvider.js`)
Added a new `shopApi` module that provides:
- `getNearby(params)` - Fetches nearby shops based on latitude, longitude, page, and limit
- `getDetail(id)` - Gets shop details
- `getById(id)` - Gets shop by ID

**Usage:**
```javascript
const response = await ApiProvider.shops.getNearby({
  lat: 30.6928,
  lng: 76.7079,
  page: 1,
  limit: 20
});
```

### 2. **Custom Hook** (`src/hooks/useNearbyShops.js`)
A React hook that manages nearby shops state and API calls:
- `fetchNearbyShops(params)` - Fetches shops from the API
- `getUserLocation()` - Gets user's current location using Geolocation API
- `fetchAndDisplay(location)` - Convenience function to fetch shops for a location
- `shops` - Array of nearby shops
- `loading` - Loading state
- `error` - Error message
- `pagination` - Pagination info
- `userLocation` - User's current coordinates

**Usage:**
```javascript
const { shops, loading, error, fetchAndDisplay, getUserLocation } = useNearbyShops();

// Get location and fetch shops
const location = await getUserLocation();
await fetchAndDisplay(location);
```

### 3. **Google Maps Component** (`src/components/NearbyShopsMap.jsx`)
Interactive Google Map displaying:
- User's current location (blue marker)
- Nearby shops (green markers)
- Click on any marker to see shop details in an info window
- Customizable map styling

**Features:**
- Responsive map container
- Custom markers with colored icons
- Info window with shop details (rating, address, phone, hours, distance)
- Click handler for shop selection

**Usage:**
```javascript
<NearbyShopsMap
  shops={shops}
  userLocation={userLocation}
  onShopSelect={(shop) => console.log(shop)}
/>
```

### 4. **Nearby Shops Modal** (`src/components/NearbyShopsListingsModal.jsx`)
A modal dialog with two views:

**List View:**
- Shows all nearby shops in a scrollable list
- Displays: name, rating, reviews, address, phone, hours, status, distance
- Service tags showing what services the shop offers
- Open/Closed status indicator

**Map View:**
- Interactive Google Map
- Markers for all shops
- Click markers to see info windows
- User location shown

**Features:**
- View toggle between List and Map
- Automatic geolocation request
- Loading states with spinner
- Error handling with user feedback
- Empty state messaging
- "Use My Location" functionality

### 5. **Home Page Integration** (`src/pages/homePage.jsx`)
Added a new button "Nearby Shops" in the Nearest Shops section that:
- Opens the `NearbyShopsListingsModal`
- Integrates seamlessly with existing UI
- Calls `getUserLocation()` on modal open
- Automatically fetches shops for user's location

## How to Use

### 1. **Access the Feature**
- Go to the home page
- Scroll to "NEAREST REPAIR SHOPS" section
- Click the new "🧭 Nearby Shops" button

### 2. **Grant Location Permission**
- Browser will ask for permission to access your location
- Click "Allow" to share your location
- Shops near you will load automatically

### 3. **View Shops**
- **List View**: Browse shops in a list format with all details
- **Map View**: See shops plotted on an interactive Google Map
- Click shop name/marker to see more details
- Call, get directions, or view services

### 4. **Shop Information**
Each shop displays:
- **Name & Type**: (e.g., "SpeedZone Auto Works" - Car Repair)
- **Rating**: Star rating and number of reviews
- **Distance**: How far the shop is from you in km
- **Address**: Full shop location
- **Phone**: Click to call
- **Hours**: Operating hours
- **Status**: Open/Closed indicator
- **Services**: Tags showing what services are offered

## API Endpoint

The feature uses this endpoint:
```
GET /user/near-shops?lat=YOUR_LAT&lng=YOUR_LNG&page=1&limit=20
```

**Parameters:**
- `lat` (required): User's latitude
- `lng` (required): User's longitude
- `page` (optional): Page number (default: 1)
- `limit` (optional): Results per page (default: 10)

**Response Format:**
```json
{
  "status": true,
  "message": "Nearby shop list",
  "data": {
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 12,
      "totalPages": 1
    },
    "result": [
      {
        "id": 42,
        "name": "Shop Name",
        "phone": "8634834864",
        "address": "Address here",
        "lat": 30.6928,
        "lng": 76.7079,
        "rating": 4.8,
        "reviews": 312,
        "distance": 707.16,
        "shopStatus": "open",
        "hours": "8AM–8PM",
        "tags": ["AC Repair", "Engine", "Painting"],
        "status": "active"
      }
    ]
  }
}
```

## Configuration

### Google Maps API Key
Located in: `src/components/NearbyShopsMap.jsx` (line ~7)

```javascript
const GOOGLE_MAP_KEY = "AIzaSyByWZryRtT2dQJCMX8yOVtvNrWICobwZzo";
```

**To use your own key:**
1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable Maps JavaScript API
3. Create an API key
4. Replace the key in `NearbyShopsMap.jsx`

## Installation & Setup

### Dependencies Installed
```
@react-google-maps/api - Google Maps integration for React
```

### Build & Run
```bash
# Install dependencies (already done)
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Error Handling

The feature includes comprehensive error handling for:
- **Geolocation denied**: Shows error message with advice
- **API failures**: Displays error state with retry suggestion
- **No shops found**: Shows empty state message
- **Loading states**: Spinner during API calls

## Browser Compatibility
- Works on all modern browsers supporting:
  - Geolocation API
  - Fetch API
  - ES6+
  
**Note:** HTTPS is required for geolocation to work (except on localhost)

## File Structure
```
src/
├── api/
│   └── ApiProvider.js (added shopApi)
├── hooks/
│   └── useNearbyShops.js (new)
├── components/
│   ├── NearbyShopsMap.jsx (new)
│   └── NearbyShopsListingsModal.jsx (new)
└── pages/
    └── homePage.jsx (modified)
```

## What's Next?

To enhance this feature, consider:
1. **Add filters**: Filter shops by service type, rating, distance
2. **Sort options**: Sort by distance, rating, or hours
3. **Search**: Search shops by name
4. **Booking**: Add ability to book appointment
5. **Reviews**: Show and post reviews
6. **Favorites**: Save favorite shops
7. **Real-time availability**: Check real-time shop status
8. **Multilingual support**: Translate to regional languages

## Troubleshooting

### Shops not loading?
- Check browser console for API errors
- Verify API endpoint is correct
- Ensure `lat` and `lng` are in valid range

### Map not showing?
- Check Google Maps API key is valid
- Verify the key has Maps JavaScript API enabled
- Check browser console for CORS errors

### Geolocation not working?
- Ensure page is served over HTTPS (except localhost)
- Check browser permissions for location access
- Try allow permission and refresh page

### Build errors?
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Support
For issues or questions, check:
- Browser console for error messages
- Network tab to verify API calls
- Google Maps API documentation
