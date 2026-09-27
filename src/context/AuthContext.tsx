import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

/**
 * Admin auth strategy:
 *  - Admin access requires a live Supabase session whose user is listed in
 *    public.admin_users (checked server-side via the is_admin() RPC).
 *  - If the admin has a verified authenticator, the session must be upgraded
 *    to aal2 with a TOTP code before the admin area unlocks. The database
 *    enforces the same rule through RLS (public.is_admin_mfa()).
 *  - Sign-in: email + password, or Google OAuth.
 */
export type AdminAuthStatus =
  | "loading"
  | "signed_out"
  | "not_admin"
  | "mfa_required"
  | "authenticated";

type Result = { success: boolean; error?: string; mfaRequired?: boolean };

interface AuthContextType {
  status: AdminAuthStatus;
  isAuthenticated: boolean;
  isLoading: boolean;
  email: string | null;
  login: (email: string, pass: string) => Promise<Result>;
  loginWithGoogle: () => Promise<{ error?: string }>;
  verifyMfa: (code: string) => Promise<Result>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function resolveStatus(session: Session | null): Promise<AdminAuthStatus> {
  if (!supabase || !session) return "signed_out";

  const { data: isAdmin, error } = await supabase.rpc("is_admin");
  if (error || isAdmin !== true) return "not_admin";

  const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aal && aal.nextLevel === "aal2" && aal.currentLevel !== "aal2") return "mfa_required";

  return "authenticated";
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<AdminAuthStatus>("loading");
  const [email, setEmail] = useState<string | null>(null);

  const evaluate = useCallback(async (session: Session | null) => {
    setEmail(session?.user.email ?? null);
    setStatus(await resolveStatus(session));
  }, []);

  const refresh = useCallback(async () => {
    if (!supabase) return setStatus("signed_out");
    const { data } = await supabase.auth.getSession();
    await evaluate(data.session);
  }, [evaluate]);

  useEffect(() => {
    if (!supabase) {
      setStatus("signed_out");
      return;
    }
    refresh();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      // Defer: calling other supabase methods inside this callback can deadlock
      setTimeout(() => evaluate(session), 0);
    });
    return () => subscription.unsubscribe();
  }, [evaluate, refresh]);

  const login = async (rawEmail: string, pass: string): Promise<Result> => {
    if (!supabase) return { success: false, error: "Supabase is not configured." };

    const { data, error } = await supabase.auth.signInWithPassword({
      email: rawEmail.trim().toLowerCase(),
      password: pass,
    });
    if (error || !data.session) return { success: false, error: "Invalid email or password." };

    const next = await resolveStatus(data.session);
    setEmail(data.session.user.email ?? null);
    setStatus(next);

    if (next === "not_admin") {
      await supabase.auth.signOut().catch(() => {});
      return { success: false, error: "Access denied. This account does not have admin privileges." };
    }
    if (next === "mfa_required") return { success: false, mfaRequired: true };
    return { success: true };
  };

  const loginWithGoogle = async () => {
    if (!supabase) return { error: "Supabase is not configured." };
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admin/login` },
    });
    return error ? { error: error.message } : {};
  };

  const verifyMfa = async (code: string): Promise<Result> => {
    if (!supabase) return { success: false, error: "Supabase is not configured." };

    const { data: factors, error: listError } = await supabase.auth.mfa.listFactors();
    const factor = factors?.totp[0];
    if (listError || !factor) return { success: false, error: "No authenticator is set up for this account." };

    const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: factor.id, code });
    if (error) return { success: false, error: "That code didn't work. Check your authenticator and try again." };

    await refresh();
    return { success: true };
  };

  const logout = async () => {
    if (supabase) await supabase.auth.signOut().catch(() => {});
    setEmail(null);
    setStatus("signed_out");
  };

  return (
    <AuthContext.Provider
      value={{
        status,
        isAuthenticated: status === "authenticated",
        isLoading: status === "loading",
        email,
        login,
        loginWithGoogle,
        verifyMfa,
        refresh,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
