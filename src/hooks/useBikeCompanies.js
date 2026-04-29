import { useCallback, useEffect, useState } from "react";
import ApiProvider from "../api/ApiProvider";

const normalizeCompanies = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

export default function useBikeCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ApiProvider.bikeCompanies.getList();
      const ok = res?.success === true || res?.status === true;
      if (!ok) throw new Error(res?.message || "Failed to load bike companies");
      setCompanies(normalizeCompanies(res));
    } catch (err) {
      setCompanies([]);
      setError(err?.message || "Failed to load bike companies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return { companies, loading, error, refetch: fetchCompanies };
}
