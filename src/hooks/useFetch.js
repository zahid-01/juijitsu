import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useFetch = (url, options = {}) => {
  const { method = "GET", body = null, headers = {} } = options;
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await axios({
        method,
        url,
        data: body,
        headers,
      });
      setData(response.data);
      setError("");
    } catch (error) {
      setError(error);
      setData();
    } finally {
      setIsLoading(false);
    }
  }, [url, method, body, headers]);

  useEffect(() => {
  
    fetchData();
  }, [url]);


  return { data, isLoading, error, refetch: fetchData };
};

export default useFetch;
