import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // automatically picks env
  withCredentials: true, // cookies/auth
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
