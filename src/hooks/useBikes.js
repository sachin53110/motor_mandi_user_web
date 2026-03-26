import { useState, useCallback } from "react";
import ApiProvider from "../api/ApiProvider";

const useBikes = () => {
  const [bikes, setBikes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchBikes = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiProvider.bikes.getList(params);
      if (response.status) {
        setBikes(response.data || []);
        setPagination(response.pagination || null);
      } else {
        throw new Error(response.message || "Failed to fetch bikes");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setBikes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setBikes([]);
    setError(null);
    setPagination(null);
  }, []);

  return { bikes, loading, error, pagination, fetchBikes, reset };
};

export default useBikes;
