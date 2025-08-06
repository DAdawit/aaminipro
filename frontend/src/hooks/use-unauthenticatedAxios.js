import { useState } from "react";
import { api, unauthenticatedApi } from "../lib/axios-instance";
export const useAxios = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendRequest = async (config) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await api(config);
      setData(response.data);
      return response.data;
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "An unexpected error occurred";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    sendRequest
  };
};