import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useState } from "react";
import { Phone, MapPin, Star, Clock } from "lucide-react";

const NearbyShopsMap = ({ shops = [], userLocation = null, onShopSelect = null }) => {
  const [selectedShop, setSelectedShop] = useState(null);
  const GOOGLE_MAP_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const mapContainerStyle = {
    width: "100%",
    height: "500px",
    borderRadius: "12px",
  };

  const defaultCenter = {
    lat: userLocation?.lat || 30.6928,
    lng: userLocation?.lng || 76.7079,
  };

  const mapOptions = {
    zoom: 14,
    styles: [
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ color: "#333333" }],
      },
      {
        featureType: "water",
        elementType: "geometry.fill",
        stylers: [{ color: "#d3d3d3" }],
      },
    ],
  };

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAP_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={14}
        options={mapOptions}
      >
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={{
              lat: userLocation.lat,
              lng: userLocation.lng,
            }}
            title="Your Location"
            icon={{
              path: "M12 0C6.48 0 2 4.48 2 10c0 5.27 3.93 9.64 9 9.99h1v-9h2v3h2v-2h1v-2h-1V9c0-.55-.45-1-1-1s-1 .45-1 1v1h-1V7h2V5h-2V4h-2v1h-2v2h1c.55 0 1 .45 1 1v2h-2V9h1v2h-2v1h3V12H7v-1h2v-2h-1v-1h2z",
              fillColor: "#4285F4",
              fillOpacity: 1,
              strokeColor: "#fff",
              strokeWeight: 2,
              scale: 1,
            }}
          />
        )}

        {/* Shop Markers */}
        {shops.map((shop) => (
          <Marker
            key={shop.id}
            position={{
              lat: shop.lat,
              lng: shop.lng,
            }}
            title={shop.name}
            onClick={() => setSelectedShop(shop)}
            icon={{
              path: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.98l2.04 2.71h4.49L14.96 12.29z",
              fillColor: "#059669",
              fillOpacity: 1,
              strokeColor: "#10b981",
              strokeWeight: 2,
              scale: 1.5,
            }}
          />
        ))}

        {/* Info Window for Selected Shop */}
        {selectedShop && (
          <InfoWindow
            position={{
              lat: selectedShop.lat,
              lng: selectedShop.lng,
            }}
            onCloseClick={() => setSelectedShop(null)}
          >
            <div
              className="bg-white p-3 rounded-lg shadow-lg"
              style={{ minWidth: "250px" }}
            >
              <h3 className="font-bold text-gray-800">{selectedShop.name}</h3>
              <div className="flex items-center gap-2 my-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                <span className="text-sm text-gray-700">
                  {selectedShop.rating?.toFixed(1) || "N/A"} 
                  {selectedShop.reviews && ` (${selectedShop.reviews} reviews)`}
                </span>
              </div>
              
              <div className="flex items-start gap-2 my-2">
                <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-600">{selectedShop.address}</span>
              </div>

              <div className="flex items-center gap-2 my-2">
                <Phone className="w-4 h-4 text-blue-500" />
                <a
                  href={`tel:${selectedShop.phone}`}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {selectedShop.phone}
                </a>
              </div>

              {selectedShop.hours && (
                <div className="flex items-center gap-2 my-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600">{selectedShop.hours}</span>
                </div>
              )}

              {selectedShop.distance && (
                <div className="mt-2 text-sm text-gray-500">
                  Distance: {(selectedShop.distance / 1000).toFixed(1)} km
                </div>
              )}

              {selectedShop.shopStatus && (
                <div className="mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      selectedShop.shopStatus === "open"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {selectedShop.shopStatus === "open" ? "🟢 Open" : "🔴 Closed"}
                  </span>
                </div>
              )}

              {onShopSelect && (
                <button
                  onClick={() => onShopSelect(selectedShop)}
                  className="mt-3 w-full bg-blue-600 text-white text-sm font-medium py-2 rounded-lg hover:bg-blue-700"
                >
                  View Details
                </button>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default NearbyShopsMap;
