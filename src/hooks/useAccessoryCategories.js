import { useCallback, useEffect, useState } from "react";
import ApiProvider from "../api/ApiProvider";

const normalizeCategories = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

export default function useAccessoryCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await ApiProvider.accessoryCategories.getList();
      const ok = res?.success === true || res?.status === true;
      if (!ok) throw new Error(res?.message || "Failed to load accessory categories");
      setCategories(normalizeCategories(res));
    } catch (err) {
      setCategories([]);
      setError(err?.message || "Failed to load accessory categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
}
