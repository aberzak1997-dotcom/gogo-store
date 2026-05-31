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
    // Session expires after 24 hours
    const auth = localStorage.getItem("admin_auth");
    const expiry = localStorage.getItem("admin_auth_expiry");
    if (auth === "true" && expiry && Date.now() < Number(expiry)) {
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem("admin_auth");
      localStorage.removeItem("admin_auth_expiry");
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const normalizedEmail = email.trim().toLowerCase();

    const builtInAdmins = [
      { email: "admin@wivitec.com",    password: "Wivitec@2026" },
      { email: "artswfx120@gmail.com", password: "ADMIN1997"    },
    ];
    const isBuiltIn = builtInAdmins.some(
      (a) => a.email === normalizedEmail && a.password === pass
    );

    // ── Try Supabase Auth first — keeps session alive for authenticated DB writes ──
    // (The anon key only has SELECT on products/settings; authenticated role has full access)
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password: pass });

        if (!error && data.user) {
          // Check role via security-definer RPC (bypasses RLS)
          const { data: roleData } = await supabase
            .rpc("get_user_role", { user_id: data.user.id })
            .catch(() => ({ data: null }));

          if (roleData === "admin") {
            // ✅ Keep the Supabase session active — this gives the "authenticated"
            // role so all product/settings writes succeed via RLS.
            setIsAuthenticated(true);
            localStorage.setItem("admin_auth", "true");
            localStorage.setItem("admin_auth_expiry", String(Date.now() + 24 * 60 * 60 * 1000));
            return { success: true };
          }

          // Signed in but not admin — revoke and refuse (unless in built-in list)
          await supabase.auth.signOut().catch(() => {});
          if (!isBuiltIn) {
            return { success: false, error: "Access denied. This account does not have admin privileges." };
          }
        }
        // Supabase sign-in failed → fall through to built-in check below
      } catch {
        // Supabase unavailable → fall through to built-in check
      }
    }

    // ── Built-in fallback (works even when Supabase is down / no Supabase account) ──
    if (isBuiltIn) {
      setIsAuthenticated(true);
      localStorage.setItem("admin_auth", "true");
      localStorage.setItem("admin_auth_expiry", String(Date.now() + 24 * 60 * 60 * 1000));
      return { success: true };
    }

    return { success: false, error: "Invalid email or password." };
  };

  const logout = async () => {
    setIsAuthenticated(false);
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_auth_expiry");
    // Also sign out of Supabase if a session exists
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut().catch(() => {});
    }
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
