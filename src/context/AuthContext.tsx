import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Admin auth is localStorage-only to avoid conflict with customer Supabase sessions.
// Credentials: admin@demo.com / admin123
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("admin_auth") === "true");
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    if (email === "admin@demo.com" && pass === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      return true;
    }
    return false;
  };

  const logout = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
