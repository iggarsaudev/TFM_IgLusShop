import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8000/api", // Dirección del backend
  withCredentials: true, // Necesario para Sanctum (cookies)
});

export const csrf = axios.create({
  baseURL: "http://localhost:8000", // Se usa para llamar a CSRF en AuthContext.tsx
  withCredentials: true,
});
