import axios from "axios";
import { isAuthenticated, userData } from "../auth-services/auth";

const api = axios.create({
  baseURL: "http://localhost:3000/",
});

api.interceptors.request.use((config) => {
  if (isAuthenticated()) {
    const token = userData().token;
    config.headers.Authorization = token;
    return config;
  }

  return config;
});

export default api;
