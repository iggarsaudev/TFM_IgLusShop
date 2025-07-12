import axios from "axios";

const api = axios.create({
  //baseURL: "http://localhost:8000", // ajusta si es necesario
  baseURL: "https://iglusshop.rf.gd/api"
  withCredentials: false, // no usamos cookies ahora, sino token
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
