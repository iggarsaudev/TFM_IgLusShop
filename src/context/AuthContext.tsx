import { createContext, useState, useEffect, type ReactNode } from "react";
import api from "../services/api";

export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  // puedes añadir más campos si los necesitas
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  const fetchUser = async (token?: string) => {
    try {
      const authHeader = token || localStorage.getItem("token");
      const { data } = await api.get("/api/user", {
        headers: {
          Authorization: `Bearer ${authHeader}`,
        },
      });
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      fetchUser(storedToken);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/api/login", { email, password });
      const token = response.data.token;
      localStorage.setItem("token", token);
      await fetchUser(token);
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const logout = async () => {
    try {
      await api.post("/api/logout");
    } catch (error) {
      console.warn("Error during logout");
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
