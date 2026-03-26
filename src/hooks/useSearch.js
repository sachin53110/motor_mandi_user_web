import { useState, useCallback } from "react";
import ApiProvider from "../api/ApiProvider";

const useSearch = () => {
  const [results, setResults] = useState({
    vehicles: [],
    tyres: [],
    wheels: [],
    rims: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const performSearch = useCallback(async (searchQuery = "") => {
    setLoading(true);
    setError(null);
    setQuery(searchQuery);

    try {
      const response = await ApiProvider.search.search({
        type: "all",
        search: searchQuery,
      });

      if (response.status && response.data) {
        setResults({
          vehicles: response.data.vehicles || [],
          tyres: response.data.tyres || [],
          wheels: response.data.wheels || [],
          rims: response.data.rims || [],
        });
      } else {
        throw new Error(response.message || "Search failed");
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
      setResults({ vehicles: [], tyres: [], wheels: [], rims: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResults({ vehicles: [], tyres: [], wheels: [], rims: [] });
    setError(null);
    setQuery("");
  }, []);

  return { results, loading, error, query, performSearch, reset };
};

export default useSearch;
