import { useCallback, useState } from "react";
import ApiProvider from "../api/ApiProvider";

const normalizeBrands = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

export default function useAccessoryBrandsByCategory() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBrands = useCallback(async (categoryId) => {
    const id = String(categoryId || "").trim();
    if (!id) {
      setBrands([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await ApiProvider.accessoryBrands.getByCategory(id);
      const ok = res?.success === true || res?.status === true;
      if (!ok) throw new Error(res?.message || "Failed to load accessory brands");
      setBrands(normalizeBrands(res));
    } catch (err) {
      setBrands([]);
      setError(err?.message || "Failed to load accessory brands");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setBrands([]);
    setError(null);
    setLoading(false);
  }, []);

  return { brands, loading, error, fetchBrands, reset };
}
