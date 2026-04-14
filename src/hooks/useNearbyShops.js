import { useState, useCallback } from "react";
import ApiProvider from "../api/ApiProvider";

const normalizeShop = (shop = {}) => {
  const rawImage = shop?.image?.media || shop?.image?.url || shop?.media || null;
  const imageUrl = typeof rawImage === "string" && rawImage.trim() ? rawImage.trim() : null;
  const fallbackAddress = [shop?.city, shop?.state, shop?.country].filter(Boolean).join(", ");

  return {
    ...shop,
    imageUrl,
    shopName: shop?.shopName || shop?.name || "Shop",
    phone: shop?.phone || "N/A",
    address: shop?.address || fallbackAddress || "Address not available",
  };
};

const useNearbyShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationEnabled, setLocationEnabled] = useState(false);

  const fetchNearbyShops = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      // Always call the same endpoint, but only include lat/lng if location is enabled
      const apiParams = {
        page: params.page || 1,
        limit: params.limit || 20,
      };

      // Only add lat/lng if location permission is granted and coordinates exist
      if (locationEnabled && params.lat && params.lng) {
        apiParams.lat = params.lat;
        apiParams.lng = params.lng;
      }

      const response = await ApiProvider.shops.getNearby(apiParams);
      
      if (response.status) {
        const rawShops = response.data?.result || response.data || [];
        const normalizedShops = Array.isArray(rawShops)
          ? rawShops.map(normalizeShop)
          : [];

        setShops(normalizedShops);
        setPagination(response.data?.pagination || null);
      } else {
        throw new Error(response.message || "Failed to fetch shops");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setShops([]);
    } finally {
      setLoading(false);
    }
  }, [locationEnabled]);

  const getUserLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setLocationEnabled(true);
            resolve({ lat: latitude, lng: longitude });
          },
          (error) => {
            setLocationEnabled(false);
            setUserLocation(null);
            reject(error);
          }
        );
      } else {
        setLocationEnabled(false);
        const err = new Error("Geolocation is not supported by this browser");
        reject(err);
      }
    });
  }, []);

  const requestLocationPermission = useCallback(() => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            setLocationEnabled(true);
            resolve(true);
          },
          (error) => {
            setLocationEnabled(false);
            setUserLocation(null);
            resolve(false);
          }
        );
      } else {
        setLocationEnabled(false);
        resolve(false);
      }
    });
  }, []);

  const fetchShops = useCallback(async (params = {}) => {
    await fetchNearbyShops({
      lat: locationEnabled && userLocation ? userLocation.lat : undefined,
      lng: locationEnabled && userLocation ? userLocation.lng : undefined,
      page: params.page || 1,
      limit: params.limit || 20,
    });
  }, [fetchNearbyShops, locationEnabled, userLocation]);

  const reset = useCallback(() => {
    setShops([]);
    setError(null);
    setPagination(null);
    setUserLocation(null);
    setLocationEnabled(false);
  }, []);

  return {
    shops,
    loading,
    error,
    pagination,
    userLocation,
    locationEnabled,
    getUserLocation,
    requestLocationPermission,
    fetchShops,
    reset,
  };
};

export default useNearbyShops;
