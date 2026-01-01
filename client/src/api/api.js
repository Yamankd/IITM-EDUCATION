import axios from "axios";

const api = axios.create({
  baseURL:  import.meta.env.VITE_API_URL, // automatically picks env
  withCredentials: true, // cookies/auth
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
