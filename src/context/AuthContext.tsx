import { createContext, useState, type ReactNode } from "react";
import { api, csrf } from "../services/api";

export interface User {
  id: number;
  name: string;
  email: string;
  // añade más campos si los tienes en tu modelo de usuario
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

  const fetchUser = async () => {
    try {
      const { data } = await api.get("user");
      setUser(data);
    } catch {
      setUser(null);
    }
  };

  const login = async (email: string, password: string) => {
    await csrf.get("/sanctum/csrf-cookie");
    await api.post("/login", { email, password });
    await fetchUser();
  };

  const logout = async () => {
    await api.post("/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, fetchUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
