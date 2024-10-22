// custom useRequest hook with axios
import { useState, useEffect } from "react";
import axios from "axios";

type methodProp = 'GET' | 'POST' | 'DELETE' | 'PUT'
type ErrorType = any
type payloadProp = {
  [key: string]: any
}

/**
 * The `useRequest` function in TypeScript is a custom hook that handles making HTTP requests with
 * optional method and payload parameters.
 * @param {string} url - The `url` parameter in the `useRequest` function is a string that represents
 * the URL to which the request will be made. This URL specifies the location of the resource that the
 * function will fetch data from.
 * @param {methodProp} [method] - The `method` parameter in the `useRequest` function is optional and
 * represents the HTTP method to be used for the request (e.g., 'GET', 'POST', 'PUT', 'DELETE', etc.).
 * If no method is provided, it defaults to 'GET'.
 * @param {payloadProp} [payload] - The `payload` parameter in the `useRequest` function is an optional
 * object that contains data to be sent with the request. It is used when making requests that require
 * additional data to be sent to the server, such as POST or PUT requests. If no payload is provided,
 * the default value is
 * @returns The `useRequest` function returns an object with three properties: `data`, `error`, and
 * `loading`.
 */
const useRequest = (url: string, method?: methodProp, payload?: payloadProp) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState<ErrorType>();
  const [loading, setLoading] = useState(true);

  if (!method) {
    method = 'GET';
  }
  if (!payload) {
    payload = {};
  }
  // verify that when there's payload, there must also be a method other than 'GET'
  if (payload && method === 'GET') {
    throw new Error('payload must be used with a method other than GET');
  }
  if (payload && !method) {
    throw new Error('method must be used with payload');
  }

  const fetchData = async () => {
    try {
      const response = await axios({ method, url, data: payload });
      setData(response.data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);
  return { data, error, loading };
};

export default useRequest;