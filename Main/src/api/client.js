import axios from "axios";

// central configuration for API requests
const envBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const runtimeBaseUrl =
  typeof window !== "undefined"
    ? `${window.location.protocol}//${window.location.hostname}:3001`
    : "http://localhost:3001";

export const API_BASE_URL = envBaseUrl || runtimeBaseUrl;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // include cookies if backend uses them
});

export default apiClient;
