import axios from "axios";

// 1. Get the API URL from the environment
const apiUrl = import.meta.env.VITE_API_URL;

// 2. Safety Check: If we are in production but the URL is missing, warn the developer
if (import.meta.env.MODE === 'production' && !apiUrl) {
  console.error("🚨 VITE_API_URL is missing! The app is trying to connect to localhost which will fail on other users' devices.");
}

const api = axios.create({
  baseURL: apiUrl || "http://localhost:5000", // Fallback only for local dev
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;