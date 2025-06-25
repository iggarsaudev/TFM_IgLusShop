export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
}

export type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

export interface UserRegister {
  name: string;
  email: string;
  password: string;
}
