import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Admin auth strategy:
 *  - Credentials are validated against Supabase (user must have user_metadata.role === "admin").
 *  - The admin session is stored in localStorage only ("admin_auth": "true") so it never
 *    conflicts with the customer's Supabase session in the same browser.
 *  - After validating the role we immediately sign out of Supabase to keep sessions clean.
 *  - Fallback: if Supabase is not configured, accepts hardcoded demo credentials.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsAuthenticated(localStorage.getItem("admin_auth") === "true");
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    // ── Environment-variable fallback (credentials never in source code) ───────
    const envEmail = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;
    const envPass  = import.meta.env.VITE_ADMIN_PASSWORD as string | undefined;
    if (
      envEmail && envPass &&
      email.trim().toLowerCase() === envEmail.toLowerCase() &&
      pass === envPass
    ) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      return { success: true };
    }

    // ── Supabase path ──────────────────────────────────────────────────────────
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });

      if (error || !data.user) {
        return { success: false, error: "Invalid email or password." };
      }

      // Check role via security-definer RPC (bypasses RLS, always works)
      const { data: roleData } = await supabase
        .rpc("get_user_role", { user_id: data.user.id });

      // Immediately sign out of Supabase — admin session lives in localStorage only,
      // so it won't interfere with any customer Supabase session.
      await supabase.auth.signOut();

      if (roleData !== "admin") {
        return { success: false, error: "Access denied. This account does not have admin privileges." };
      }

      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      return { success: true };
    }

    // ── No match ──────────────────────────────────────────────────────────────
    return { success: false, error: "Invalid email or password." };
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
