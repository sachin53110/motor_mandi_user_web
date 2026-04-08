import { useState, useCallback } from "react";
import ApiProvider from "../api/ApiProvider";

const useNearbyShops = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  const fetchNearbyShops = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiProvider.shops.getNearby(params);
      if (response.status) {
        setShops(response.data?.result || []);
        setPagination(response.data?.pagination || null);
      } else {
        throw new Error(response.message || "Failed to fetch nearby shops");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setShops([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ lat: latitude, lng: longitude });
            resolve({ lat: latitude, lng: longitude });
          },
          (error) => {
            setError(`Geolocation error: ${error.message}`);
            reject(error);
          }
        );
      } else {
        const err = new Error("Geolocation is not supported by this browser");
        setError(err.message);
        reject(err);
      }
    });
  }, []);

  const fetchAndDisplay = useCallback(async (locationParams) => {
    try {
      await fetchNearbyShops({
        lat: locationParams.lat,
        lng: locationParams.lng,
        page: 1,
        limit: 20,
      });
    } catch (err) {
      setError(err.message || "Failed to fetch shops");
    }
  }, [fetchNearbyShops]);

  const reset = useCallback(() => {
    setShops([]);
    setError(null);
    setPagination(null);
    setUserLocation(null);
  }, []);

  return {
    shops,
    loading,
    error,
    pagination,
    userLocation,
    fetchNearbyShops,
    getUserLocation,
    fetchAndDisplay,
    reset,
  };
};

export default useNearbyShops;
