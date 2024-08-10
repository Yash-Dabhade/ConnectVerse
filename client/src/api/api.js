import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

// creating instance of the axios
const api = axios.create({
  baseURL: process.env.BACKEND_BASE_URL,
});

// embedding access token each time request is made for protected routes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
