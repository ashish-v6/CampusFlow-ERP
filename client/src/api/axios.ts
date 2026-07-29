import axios from "axios";
import "dotenv/config";

const api = axios.create({
  baseURL: import.meta.env.BASE_URL ?? "http://localhost:5000/",
  withCredentials: true,
});

export default api;
