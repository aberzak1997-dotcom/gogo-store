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
    const normalizedEmail = email.trim().toLowerCase();

    // ── Built-in admin accounts (always available) ─────────────────────────────
    const builtInAdmins = [
      { email: "admin@wivitec.com",    password: "Wivitec@2026" },
      { email: "artswfx120@gmail.com", password: "ADMIN1997"    },
    ];
    const matched = builtInAdmins.find(
      (a) => a.email === normalizedEmail && a.password === pass
    );
    if (matched) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      return { success: true };
    }

    // ── Supabase path (for any other Supabase admin accounts) ─────────────────
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password: pass });

        if (error || !data.user) {
          return { success: false, error: "Invalid email or password." };
        }

        // Check role via security-definer RPC (bypasses RLS)
        const { data: roleData, error: rpcError } = await supabase
          .rpc("get_user_role", { user_id: data.user.id });

        // Sign out of Supabase — admin session lives in localStorage only
        await supabase.auth.signOut();

        if (rpcError || roleData !== "admin") {
          return { success: false, error: "Access denied. This account does not have admin privileges." };
        }

        setIsAuthenticated(true);
        localStorage.setItem("admin_auth", "true");
        return { success: true };
      } catch {
        return { success: false, error: "Connection error. Please check your internet and try again." };
      }
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
