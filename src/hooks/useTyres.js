// ── hooks/useTyres.js ─────────────────────────────────────────────────────────
// Custom hook to fetch tyre listings from the API.
// ──────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import ApiProvider from "../api/ApiProvider";

const useTyres = () => {
  const [tyres,      setTyres]      = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchTyres = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiProvider.tyres.getList(params);
      if (response.status) {
        setTyres(response.data || []);
        setPagination(response.pagination || null);
      } else {
        throw new Error(response.message || "Failed to fetch tyres");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setTyres([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTyres([]);
    setError(null);
    setPagination(null);
  }, []);

  return { tyres, loading, error, pagination, fetchTyres, reset };
};

export default useTyres;