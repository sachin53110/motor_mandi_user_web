import { useState, useEffect } from "react";
import { X, MapPin, Phone, Star, Clock, Zap, AlertCircle } from "lucide-react";
import NearbyShopsMap from "./NearbyShopsMap";
import useNearbyShops from "../hooks/useNearbyShops";

const NearbyShopsListingsModal = ({ isOpen, onClose }) => {
  const { shops, loading, error, userLocation, fetchAndDisplay, getUserLocation } = useNearbyShops();
  const [isMapView, setIsMapView] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Get user location and fetch nearby shops
      getUserLocation()
        .then((location) => {
          fetchAndDisplay(location);
        })
        .catch((err) => {
          console.error("Location error:", err);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Nearby Shops</h2>
            <p className="text-sm text-gray-500 mt-1">
              {shops.length > 0 ? `${shops.length} shops found near you` : "Loading shops..."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 px-6 pt-4 border-b border-gray-200">
          <button
            onClick={() => setIsMapView(false)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              !isMapView
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setIsMapView(true)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isMapView
                ? "bg-emerald-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Map View
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
              <p className="text-gray-600">Finding nearby shops...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center gap-3 p-6 bg-red-50 border border-red-200 m-4 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Map View */}
          {isMapView && !loading && (
            <div className="p-4">
              <NearbyShopsMap
                shops={shops}
                userLocation={userLocation}
              />
            </div>
          )}

          {/* List View */}
          {!isMapView && !loading && shops.length > 0 && (
            <div className="divide-y divide-gray-200">
              {shops.map((shop) => (
                <div
                  key={shop.id}
                  className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800 text-lg group-hover:text-emerald-600 transition-colors">
                      {shop.name}
                    </h3>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        shop.status === "active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {shop.status}
                    </span>
                  </div>

                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-gray-700">
                        {shop.rating?.toFixed(1) || "N/A"}
                      </span>
                    </div>
                    {shop.reviews && (
                      <span className="text-xs text-gray-500">
                        ({shop.reviews} reviews)
                      </span>
                    )}
                    <Zap className="w-4 h-4 text-orange-500 ml-2" />
                    <span className="text-xs font-medium text-orange-600">
                      {shop.distance ? `${(shop.distance / 1000).toFixed(1)} km` : "N/A"}
                    </span>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{shop.address}</span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <a
                      href={`tel:${shop.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {shop.phone}
                    </a>
                  </div>

                  {/* Hours */}
                  {shop.hours && (
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-600">{shop.hours}</span>
                      <span
                        className={`text-xs font-medium ml-2 ${
                          shop.shopStatus === "open"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {shop.shopStatus === "open" ? "🟢 Open" : "🔴 Closed"}
                      </span>
                    </div>
                  )}

                  {/* Services Tags */}
                  {shop.tags && shop.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {shop.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && shops.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-300 mb-3" />
              <p className="text-gray-600 font-medium">No shops found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try expanding your search radius or check back later
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NearbyShopsListingsModal;
