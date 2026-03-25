// ── hooks/useWheels.js ────────────────────────────────────────────────────────
// Custom hook to fetch wheel listings from the API.
// Mirrors useTyres.js pattern exactly.
// ──────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import ApiProvider from "../api/ApiProvider";

const useWheels = () => {
  const [wheels,     setWheels]     = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchWheels = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiProvider.wheels.getList(params);
      if (response.status) {
        setWheels(response.data || []);
        setPagination(response.pagination || null);
      } else {
        throw new Error(response.message || "Failed to fetch wheels");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setWheels([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setWheels([]);
    setError(null);
    setPagination(null);
  }, []);

  return { wheels, loading, error, pagination, fetchWheels, reset };
};

export default useWheels;