// ── hooks/useAccessories.js ─────────────────────────────────────────────────────────
// Custom hook to fetch accessories listings from the API.
// ──────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import ApiProvider from "../api/ApiProvider";

const useAccessories = () => {
  const [accessories, setAccessories] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState(null);
  const [pagination,  setPagination]  = useState(null);

  const fetchAccessories = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiProvider.accessories.getList(params);
      if (response.status) {
        setAccessories(response.data || []);
        setPagination(response.pagination || null);
      } else {
        throw new Error(response.message || "Failed to fetch accessories");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setAccessories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAccessories([]);
    setError(null);
    setPagination(null);
  }, []);

  return { accessories, loading, error, pagination, fetchAccessories, reset };
};

export default useAccessories;
