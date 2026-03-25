import { useState, useCallback } from "react";
import ApiProvider from "../api/ApiProvider";

const useCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchCars = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiProvider.cars.getList(params);
      if (response.status) {
        setCars(response.data || []);
        setPagination(response.pagination || null);
      } else {
        throw new Error(response.message || "Failed to fetch cars");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setCars([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCars([]);
    setError(null);
    setPagination(null);
  }, []);

  return { cars, loading, error, pagination, fetchCars, reset };
};

export default useCars;