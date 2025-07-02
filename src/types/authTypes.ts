export interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar?: string;
}

export type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: (token?: string) => Promise<User | null>;
  tokenExpiresAt?: Date | null;
  canRenew: boolean;
  setCanRenew: React.Dispatch<React.SetStateAction<boolean>>;
};

export interface UserRegister {
  name: string;
  email: string;
  password: string;
}
