// ── hooks/useTyres.js ─────────────────────────────────────────────────────────
// Custom hook to fetch tyre listings from the API.
// ──────────────────────────────────────────────────────────────────────────────

import { useState, useCallback } from "react";
import ApiProvider from "../api/ApiProvider";

const normalizeTyres = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.result)) return payload.result;
  if (Array.isArray(payload.data)) return payload.data;
  if (Array.isArray(payload.data?.result)) return payload.data.result;
  return [];
};

const normalizePagination = (payload, fallbackPage = 1, fallbackLimit = 20) => {
  const pagination = payload?.pagination || payload?.data?.pagination || payload || {};

  return {
    page: pagination.page || fallbackPage,
    limit: pagination.limit || fallbackLimit,
    total: pagination.total ?? pagination.totalRecords ?? 0,
    totalPages: pagination.totalPages || 1,
    totalRecords: pagination.totalRecords ?? pagination.total ?? 0,
  };
};

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
        const normalizedTyres = normalizeTyres(response);
        setTyres(normalizedTyres);
        setPagination(normalizePagination(response, params.page || 1, params.limit || 20));
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