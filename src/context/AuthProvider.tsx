import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/authTypes";
import api from "../services/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const refreshUser = async (token?: string): Promise<User | null> => {
    try {
      const authHeader = token || localStorage.getItem("token");
      const { data } = await api.get("/api/user", {
        headers: { Authorization: `Bearer ${authHeader}` },
      });
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) refreshUser(storedToken);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);
      const user = await refreshUser(token);
      if (user?.role === "admin") navigate("/dashboard");
      else if (user?.role === "user") navigate("/profile/orders");
    } catch {
      throw new Error("Login failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/logout");
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, isAuthenticated, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
