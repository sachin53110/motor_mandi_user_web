// ── hooks/useRims.js ─────────────────────────────────────────────────────────
// Custom hook to fetch rim listings from the API.
// Mirrors hooks/userWheel.js pattern.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import ApiProvider from "../api/ApiProvider";

const useRims = () => {
  const [rims, setRims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchRims = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiProvider.rims.getList(params);
      if (response.status) {
        setRims(response.data || []);
        setPagination(response.pagination || null);
      } else {
        throw new Error(response.message || "Failed to fetch rims");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setRims([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setRims([]);
    setError(null);
    setPagination(null);
  }, []);

  return { rims, loading, error, pagination, fetchRims, reset };
};

export default useRims;
