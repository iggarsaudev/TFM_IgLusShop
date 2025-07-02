import { useState, useEffect, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/authTypes";
import api from "../services/api";
import toast from "react-hot-toast";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;
  const navigate = useNavigate();
  const [tokenExpiresAt, setTokenExpiresAt] = useState<Date | null>(null);
  const [canRenew, setCanRenew] = useState(false);

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
    const storedExpiry = localStorage.getItem("token_expires_at");

    if (storedToken) {
      refreshUser(storedToken);
      if (storedExpiry) {
        setTokenExpiresAt(new Date(storedExpiry));
      }
    }
  }, []);

  useEffect(() => {
    if (!tokenExpiresAt) {
      setCanRenew(false);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const diff = tokenExpiresAt.getTime() - now;
      const minutesLeft = Math.floor(diff / 60000);

      setCanRenew(diff > 0 && diff <= 5 * 60 * 1000);

      if (minutesLeft > 0 && minutesLeft <= 5) {
        toast(
          `⚠️ Your session expires in ${minutesLeft} minutes. Go to your profile and renew it.`
        );
      }

      if (diff <= 0) {
        clearInterval(interval);
        setCanRenew(false);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [tokenExpiresAt]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/login", { email, password });

      const token = response.data.token;
      const expiresAt = response.data.expires_at;

      localStorage.setItem("token", token);
      localStorage.setItem("token_expires_at", expiresAt);

      setTokenExpiresAt(new Date(expiresAt));

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
      localStorage.removeItem("token_expires_at");
      setUser(null);
      setTokenExpiresAt(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        login,
        logout,
        refreshUser,
        canRenew,
        setCanRenew,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
