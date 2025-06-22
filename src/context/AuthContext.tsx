import { createContext, useState, useContext, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../components/api";

interface User {
  name: string;
  role: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const getInitialState = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      return { isAuthenticated: false, user: null };
    }
    try {
      const decoded: { sub: string; role: string } = jwtDecode(token);
      return {
        isAuthenticated: true,
        user: { name: decoded.sub, role: decoded.role },
      };
    } catch (e) {
      localStorage.removeItem("accessToken");
      return { isAuthenticated: false, user: null };
    }
  };

  const initialState = getInitialState();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    initialState.isAuthenticated
  );
  const [user, setUser] = useState<User | null>(initialState.user);

  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    const decoded: { sub: string; role: string } = jwtDecode(token);
    setUser({ name: decoded.sub, role: decoded.role });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/"; // Redireciona para a home pública
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
