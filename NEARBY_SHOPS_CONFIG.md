# Environment & Configuration Setup

## API Base URL

The app uses an environment variable for the API base URL. Currently it's set to:
```
https://scaredrealm.com/speedy_fix_node_backend/api/v1/
```

Located in: `src/api/ApiProvider.js` (line 1)

To change it, modify:
```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://scaredrealm.com/speedy_fix_node_backend/api/v1/";
```

### Using Environment Variables

Create a `.env` file in the project root:
```
VITE_API_BASE_URL=http://localhost:3001/api/v1/
VITE_GOOGLE_MAPS_API_KEY=AIzaSyByWZryRtT2dQJCMX8yOVtvNrWICobwZzo
```

Then reference in code:
```javascript
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const GOOGLE_MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
```

## Google Maps API Configuration

### Current Setup
- **Key**: `AIzaSyByWZryRtT2dQJCMX8yOVtvNrWICobwZzo`
- **Location**: `src/components/NearbyShopsMap.jsx` (line 7)

### To Get Your Own Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com

2. **Create a New Project**
   - Click "Select a Project" → "NEW PROJECT"
   - Enter a project name
   - Click "CREATE"

3. **Enable Maps JavaScript API**
   - Go to APIs & Services → Library
   - Search for "Maps JavaScript API"
   - Click it and press "ENABLE"

4. **Create API Key**
   - Go to APIs & Services → Credentials
   - Click "Create Credentials" → "API Key"
   - Copy the API key

5. **Restrict Your Key (Optional but Recommended)**
   - In Credentials, click on your key
   - Under "Key restrictions"
   - Application restrictions: Select "HTTP referrers (web sites)"
   - Website restrictions: Add your domain (e.g., `localhost:5173`, `yourdomain.com`)
   - Click "SAVE"

6. **Update in Your App**
   ```javascript
   // src/components/NearbyShopsMap.jsx
   const GOOGLE_MAP_KEY = "YOUR_NEW_API_KEY";
   ```

## API Endpoints

### Nearby Shops Endpoint
```
GET /user/near-shops
```

**Query Parameters:**
- `lat` (required): User latitude
- `lng` (required): User longitude  
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Example Request:**
```
GET https://api.example.com/v1/user/near-shops?lat=30.6928&lng=76.7079&page=1&limit=20
```

**Example Response:**
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
        "name": "new name",
        "shopName": "new",
        "email": "new@yopmail.com",
        "phone": "8634834864",
        "lat": 30.6928,
        "lng": 76.7079,
        "address": "Shop Address",
        "shopStatus": "open",
        "hours": "8AM-8PM",
        "rating": 4.8,
        "reviews": 312,
        "distance": 707.16,
        "tags": ["Service1", "Service2"],
        "status": "active"
      }
    ]
  }
}
```

## Browser Requirements

### Required APIs
- **Geolocation API**: For getting user's current location
- **Fetch API**: For making HTTP requests
- **ES6+ JavaScript**: Modern JavaScript features

### Browser Support
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Full support

### Important Notes
- **HTTPS Required**: Geolocation only works on HTTPS (except localhost)
- **User Permissions**: User must grant location permission
- **CORS**: Backend must allow CORS requests from your domain

## Development Setup

### 1. Clone the Project
```bash
cd /Users/sachinkumar/Documents/Archive/motor_mandi_user_web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
- Opens at: http://localhost:5173

### 4. Build for Production
```bash
npm run build
```
- Output in: `dist/` directory

## Testing the Nearby Shops Feature

### Manual Testing Checklist

1. **Location Permission**
   - [ ] Open the app
   - [ ] Go to "NEAREST REPAIR SHOPS" section
   - [ ] Click "🧭 Nearby Shops" button
   - [ ] Grant location permission when prompted

2. **List View**
   - [ ] Shops list appears with loading spinner
   - [ ] All shop details display correctly (name, rating, distance, address, phone, hours)
   - [ ] Open/Closed status shows correctly
   - [ ] Service tags are visible
   - [ ] List scrolls smoothly

3. **Map View**
   - [ ] Toggle to Map View works
   - [ ] Map loads with user location marker (blue)
   - [ ] Shop markers appear (green)
   - [ ] Click on marker shows info window
   - [ ] Map zoom/pan works smoothly

4. **Info Window**
   - [ ] Shows shop details
   - [ ] Click "View Details" button works
   - [ ] Phone number is clickable (tel: link)
   - [ ] Close button works

5. **Error Handling**
   - [ ] Deny location permission shows error
   - [ ] API error displays error message
   - [ ] Loading states show spinner
   - [ ] Empty state shows appropriate message

## Common Issues & Solutions

### Issue: "Geolocation is not supported"
- **Cause**: Browser doesn't support Geolocation API
- **Solution**: Use a modern browser (Chrome, Firefox, Safari, Edge)

### Issue: "Map not showing"
- **Cause**: Invalid Google Maps API key
- **Solution**: Verify API key and ensure Maps JavaScript API is enabled

### Issue: Shops not loading
- **Cause**: API endpoint not working
- **Solution**: Check browser console, verify lat/lng values, check API response

### Issue: Location permission denied
- **Cause**: User blocked location access
- **Solution**: Check browser settings, allow location permission, refresh page

### Issue: CORS errors
- **Cause**: Backend doesn't allow requests from frontend domain
- **Solution**: Configure CORS in backend, add frontend URL to allowed origins

## Performance Tips

1. **Pagination**: Use `limit` parameter to reduce data transferred
```javascript
fetchNearbyShops({ lat: 30.6928, lng: 76.7079, page: 1, limit: 10 })
```

2. **Caching**: Consider caching results for same location
3. **Debouncing**: Debounce search/filter operations
4. **Lazy Loading**: Load images only when needed

## Security Considerations

1. **API Key Restrictions**
   - Restrict Google Maps API key to your domain
   - Use environment variables, don't hardcode keys

2. **HTTPS Only**
   - Always use HTTPS in production
   - Geolocation requires secure context

3. **Rate Limiting**
   - Implement rate limiting on backend
   - Protect against abuse of location API

4. **User Privacy**
   - Never store location without consent
   - Clear location on user logout
   - Only request permissions when needed

## Deployment Checklist

Before deploying to production:
- [ ] Update Google Maps API key
- [ ] Update API base URL
- [ ] Set environment variables
- [ ] Enable HTTPS
- [ ] Test location permission flow
- [ ] Test all modals and views
- [ ] Check mobile responsiveness
- [ ] Verify error handling
- [ ] Test with real GPS data
- [ ] Check browser console for errors

## Support & Debugging

### Enable Debug Mode
Add to browser console:
```javascript
localStorage.debug = '*'; // Shows all logs
```

### Check API Calls
1. Open DevTools (F12)
2. Go to Network tab
3. Make a request (click "Nearby Shops")
4. Check the request URL and response

### Check Geolocation
```javascript
navigator.geolocation.getCurrentPosition(
  pos => console.log('Location:', pos.coords),
  err => console.log('Error:', err)
);
```

### Check Google Maps
```javascript
console.log('Google Maps loaded:', typeof window.google !== 'undefined');
```

## Additional Resources

- [Google Maps JavaScript API Docs](https://developers.google.com/maps/documentation/javascript)
- [Geolocation API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
- [React Google Maps Docs](https://react-google-maps-api-docs.netlify.app/)
- [Vite Documentation](https://vitejs.dev/)
