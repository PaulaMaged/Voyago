import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState([]);

  const fetchData = async (url) => {
    try {
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  };

  useEffect(() => {
    fetchData(url);
  }, [url]);

  return { data };
};

export default useFetch;
