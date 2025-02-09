import { useState } from 'react';
import axios, { AxiosRequestConfig } from 'axios';

type Method = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH';
type ErrorType = any;
type Payload = { [key: string]: any };
type Headers = { [key: string]: string };

/**
 * A custom hook that handles multiple HTTP requests using axios.
 */
const useRequest = () => {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<ErrorType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * The request function to make different HTTP requests.
   * @param {string} url - The API URL.
   * @param {Method} [method='GET'] - The HTTP method (GET, POST, PUT, etc.).
   * @param {Payload} [payload] - The request body for POST, PUT, PATCH methods.
   * @param {Headers} [headers] - Optional headers for the request.
   * @param {number} [timeout=30000] - Request timeout in milliseconds.
   * @returns {Promise<void>}
   */
  const request = async (
    url: string,
    method: Method = 'GET',
    payload?: Payload,
    headers?: Headers,
    timeout: number = 30000
  ) => {
    // Reset states before setting loading to ensure clean state
    setData(null);
    setError(null);
    setLoading(true);

    const config: AxiosRequestConfig = {
      url,
      method,
      timeout,
      headers: {
        ...headers,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      data: method !== 'GET' ? payload : undefined, // Send payload for non-GET requests
    };

    try {
      const response = await axios(config);
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, request };
};

export default useRequest;
