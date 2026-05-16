import { useState, useCallback } from "react";
import ApiProvider from "../api/ApiProvider";

const useParts = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const fetchParts = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiProvider.parts.getList(params);
      if (response.status) {
        setParts(response.data || []);
        setPagination(response.pagination || null);
      } else {
        throw new Error(response.message || "Failed to fetch parts");
      }
    } catch (err) {
      setError(err?.message || "Something went wrong");
      setParts([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setParts([]);
    setError(null);
    setPagination(null);
  }, []);

  return { parts, loading, error, pagination, fetchParts, reset };
};

export default useParts;
