import axios from "axios";

const api = axios.create({
  baseURL:  "https://iitm-education.onrender.com/iitm", // automatically picks env
  withCredentials: true, // cookies/auth
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
