import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url, dependencies = []) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchData(url);
  }, [url, ...dependencies]);

  return { error, data };
};

export default useFetch;
