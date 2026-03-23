import axios from "axios";

const envBaseUrl = null;
const runtimeBaseUrl =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:3001`
    : "http://localhost:3001";

export const API_BASE_URL = envBaseUrl || runtimeBaseUrl;
console.info(`[api] Using API base URL: ${API_BASE_URL}`);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

if (import.meta.env.DEV) {
  apiClient.interceptors.request.use((config) => {
    const method = (config.method || "GET").toUpperCase();
    console.debug(`[api] ${method} ${config.baseURL}${config.url}`);
    return config;
  });
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Request failed";

    error.message = message;
    return Promise.reject(error);
  },
);

export default apiClient;
