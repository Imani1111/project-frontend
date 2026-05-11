import axios from "axios";

export const BASE_URL = "https://mybackend-uk1u.onrender.com";

const API = axios.create({
  baseURL: `${BASE_URL}/api`,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");

  if (adminToken) {
    req.headers.Authorization = `Bearer ${adminToken}`;
  } else if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
