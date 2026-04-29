import { useCallback, useState } from "react";
import ApiProvider from "../api/ApiProvider";

const normalizeModels = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload.data)) return payload.data;
  return [];
};

export default function useCarModelsByCompany() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchModels = useCallback(async (companyId) => {
    const id = String(companyId || "").trim();
    if (!id) {
      setModels([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await ApiProvider.carModels.getByCompany(id);
      const ok = res?.success === true || res?.status === true;
      if (!ok) throw new Error(res?.message || "Failed to load car models");
      setModels(normalizeModels(res));
    } catch (err) {
      setModels([]);
      setError(err?.message || "Failed to load car models");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setModels([]);
    setError(null);
    setLoading(false);
  }, []);

  return { models, loading, error, fetchModels, reset };
}
