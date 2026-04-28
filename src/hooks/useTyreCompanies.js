// ── hooks/useTyreCompanies.js ────────────────────────────────────────────────
// Fetch tyre companies for tyre filters.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useState } from "react";
import ApiProvider from "../api/ApiProvider";

const useTyreCompanies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await ApiProvider.tyreCompanies.getList();

      // Backend examples: { success: true, data: [...] }
      if (response?.success) {
        setCompanies(Array.isArray(response.data) ? response.data : []);
        return;
      }

      // Some APIs in this repo use { status: true, data: [...] }
      if (response?.status) {
        setCompanies(Array.isArray(response.data) ? response.data : []);
        return;
      }

      throw new Error(response?.message || "Failed to fetch tyre companies");
    } catch (err) {
      setCompanies([]);
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  return { companies, loading, error, fetchCompanies };
};

export default useTyreCompanies;
