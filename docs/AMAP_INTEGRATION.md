# Amap (Gaode Maps / 高德地图) Integration

This document describes the Amap integration in the Itinavi application.

## Overview

### Current Integration: Web Service API

We use Amap's **Web Service API** to provide place autocomplete functionality when adding accommodation details. Users can search for hotels and other places, and the system will automatically fill in the address.

### Future Integration: JavaScript API

The **JavaScript API** (Web端 JS API) will be used in the future for:
- Interactive map displays
- Showing itinerary items on a map
- Route visualization
- Location picker with map interface

**Note**: These are two separate APIs requiring different API keys!

## Setup

### 1. Get Amap API Keys

#### Web Service API Key (Required Now)

1. Go to [Amap Console](https://console.amap.com/dev/key/app)
2. Create an account or log in
3. Create a new application (if you don't have one)
4. Click "添加" (Add) under "Key管理" (Key Management)
5. **Select platform: "Web服务" (Web Service)** ⚠️ Important!
6. Optionally add IP/domain whitelist for security
7. Copy your API key

#### JavaScript API Key (Optional - Future Use)

1. In the same Amap Console
2. Click "添加" (Add) to create another key
3. **Select platform: "Web端(JS API)"** for interactive maps
4. Optionally enable "数字签名验证" for security jscode
5. Copy your API key

### 2. Configure Environment Variables

Add your Amap keys to your `.env` or `.env.local` file:

```env
# Required: Web Service API Key for autocomplete
NEXT_PUBLIC_AMAP_WEB_SERVICE_KEY=your_web_service_key_here

# Optional: JavaScript API Key for maps (future)
NEXT_PUBLIC_AMAP_JS_API_KEY=your_js_api_key_here

# Optional: Security code for JS API only (NOT for Web Service)
NEXT_PUBLIC_AMAP_SECURITY_JSCODE=your_jscode_here
```

**Important**: 
- The `NEXT_PUBLIC_` prefix is required for client-side code
- Web Service and JS API require **different keys**
- Security jscode only works with JS API, not Web Service API

### 3. Verify Integration

1. Start the development server
2. Navigate to add/edit itinerary item
3. Select "Accommodation" type
4. Try searching for a hotel in the "Hotel Name" field
5. You should see autocomplete suggestions from Amap

## API Usage

### Input Tips API

We use Amap's Input Tips API for autocomplete suggestions:

**Endpoint**: `https://restapi.amap.com/v3/assistant/inputtips`

**Parameters**:
- `key`: Your Amap API key
- `keywords`: Search query
- `city`: Optional city parameter to limit results
- `type`: POI type filter (optional)
- `datatype`: Data type (default: 'all')

**Response**:
```json
{
  "status": "1",
  "info": "OK",
  "tips": [
    {
      "id": "B000A7BD6C",
      "name": "北京饭店",
      "address": "东城区东长安街33号",
      "location": "116.418261,39.914494",
      "district": "北京市东城区"
    }
  ]
}
```

## Component Usage

### AmapPlaceAutocomplete Component

```tsx
import { AmapPlaceAutocomplete } from '@/components/AmapPlaceAutocomplete';

<AmapPlaceAutocomplete
  label="Hotel Name"
  value={hotelName}
  onPlaceSelect={(place) => {
    setHotelName(place.name);
    setAddress(place.address);
  }}
  placeholder="Search for hotel..."
  city="北京" // Optional: limit results to specific city
/>
```

## Development Mode

If `NEXT_PUBLIC_AMAP_WEB_SERVICE_KEY` is not configured, the component will:
1. Log a warning to the console
2. Show mock data with Chinese hotel names
3. Allow testing without a real API key

## API Limits

Free tier limits (as of 2026):
- 300,000 calls/day for Web Service APIs
- Rate limit: 200 QPS per key

For production use with high traffic, consider:
- Caching frequent searches
- Implementing server-side proxy to hide API key
- Upgrading to a paid plan if needed

## API Keys: Web Service vs JavaScript API

### Web Service API (Currently Used)
**Environment Variable**: `NEXT_PUBLIC_AMAP_WEB_SERVICE_KEY`

**Use Cases**:
- ✅ Place search / autocomplete (current feature)
- ✅ Geocoding (address → coordinates)
- ✅ Reverse geocoding (coordinates → address)
- ✅ Route planning
- ✅ Distance calculations

**Platform**: Select "Web服务" when creating key

**Security**: Does NOT use jscode parameter

### JavaScript API (Future Use)
**Environment Variable**: `NEXT_PUBLIC_AMAP_JS_API_KEY`

**Use Cases**:
- 🗺️ Interactive map display
- 📍 Markers and overlays
- 🛣️ Route visualization on map
- 🖱️ Click to pick location
- 📐 Drawing tools

**Platform**: Select "Web端(JS API)" when creating key

**Security**: CAN use `NEXT_PUBLIC_AMAP_SECURITY_JSCODE` for enhanced security

## Security Notes

1. **API Key Exposure**: The API key is exposed in client-side code. This is required for Web Service API but poses a security risk.
   
2. **Recommended**: For production:
   - Set up IP whitelist restrictions in Amap console
   - Set up referer restrictions to your domain
   - Monitor API usage regularly
   - Consider implementing a server-side proxy

3. **Rate Limiting**: Implement client-side debouncing (already included in component) to reduce API calls

## Troubleshooting

### USERKEY_PLAT_NOMATCH Error

**Most Common Issue**: This error means your API key is not configured for Web Service API.

**Solution**:
1. Go to [Amap Console](https://console.amap.com/dev/key/app)
2. Click on "应用管理" (Application Management)
3. Find your application and key
4. Ensure "Web服务" (Web Service) is checked/enabled
5. If not available, create a new key:
   - Click "创建新应用" (Create New Application)
   - Name it (e.g., "ItinaviCN")
   - Click "添加" (Add) under "Key管理"
   - Select "Web服务" (Web Service) as the platform
   - Optionally add IP/domain whitelist for security
6. Copy the new key to your `.env` file

**Alternative**: Some keys require domain whitelisting. Add your domain (e.g., `localhost:3000` for development) in the key settings.

### No results appearing
- Check if API key is correctly set in `.env.local`
- Verify the key has "Web Service API" enabled (see above)
- Check browser console for error messages
- Test API key directly with curl:
  ```bash
  curl "https://restapi.amap.com/v3/assistant/inputtips?key=YOUR_KEY&keywords=北京饭店"
  ```

### CORS errors
- Amap Web Service API should not have CORS issues
- If you see CORS errors, verify you're using Web Service API, not JavaScript API

### Wrong results
- Use the `city` parameter to limit results to specific cities
- Adjust the `type` parameter to filter by POI category

## References

- [Amap Web Service API Documentation](https://lbs.amap.com/api/webservice/summary)
- [Input Tips API Reference](https://lbs.amap.com/api/webservice/guide/api/inputtips)
- [Amap Console](https://console.amap.com/)
