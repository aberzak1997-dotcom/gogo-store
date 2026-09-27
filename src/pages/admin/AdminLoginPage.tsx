"use client";

import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { ArrowLeft, Lock, ShieldCheck, Smartphone, AlertTriangle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showSuccess } from "../../utils/toast";

// Set before the Google redirect so we can tell, on return, that this
// session was started from the admin login (and sign it out if not an admin).
const OAUTH_FLAG = "admin_oauth_pending";

const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const inputClass =
  "h-12 rounded-[10px] bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#1160CB]";
const primaryBtn =
  "w-full h-12 rounded-[10px] bg-[#1528A1] hover:bg-[#1160CB] text-white text-[14px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2";

const AdminLoginPage = () => {
  const { status, email: sessionEmail, login, loginWithGoogle, verifyMfa, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  // True once a sign-in happens on this page (including the Google return)
  const signedInHere = useRef(Boolean(sessionStorage.getItem(OAUTH_FLAG)));

  // Route by auth status (covers the return from Google and page reloads)
  useEffect(() => {
    if (status === "authenticated") {
      sessionStorage.removeItem(OAUTH_FLAG);
      // Full load after a fresh sign-in so the store re-fetches admin data
      // with the new session instead of what it loaded while signed out.
      if (signedInHere.current) window.location.replace(from);
      else navigate(from, { replace: true });
    } else if (status === "not_admin" && sessionStorage.getItem(OAUTH_FLAG)) {
      sessionStorage.removeItem(OAUTH_FLAG);
      logout();
      setErrorMsg("That Google account doesn't have admin access.");
    } else if (status === "mfa_required") {
      sessionStorage.removeItem(OAUTH_FLAG);
    }
  }, [status, from, navigate, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrorMsg("");
    setInfoMsg("");
    signedInHere.current = true;
    const result = await login(email, password);
    if (result.success) showSuccess("Welcome back!");
    else if (!result.mfaRequired) setErrorMsg(result.error || "Invalid email or password.");
    setBusy(false);
  };

  const handleGoogle = async () => {
    setErrorMsg("");
    sessionStorage.setItem(OAUTH_FLAG, "1");
    const { error } = await loginWithGoogle();
    if (error) {
      sessionStorage.removeItem(OAUTH_FLAG);
      setErrorMsg(error);
    }
  };

  const handleForgot = async () => {
    setErrorMsg("");
    setInfoMsg("");
    const target = email.trim().toLowerCase();
    if (!target) {
      setErrorMsg("Enter your admin email above, then click Forgot? again.");
      return;
    }
    if (!supabase) return;
    await supabase.auth.resetPasswordForEmail(target, {
      redirectTo: `${window.location.origin}/admin/security/reset-password`,
    });
    // Same message whether or not the account exists
    setInfoMsg(`If ${target} is an admin account, a reset link is on its way.`);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setErrorMsg("");
    signedInHere.current = true;
    const result = await verifyMfa(code);
    if (result.success) showSuccess("Welcome back!");
    else {
      setErrorMsg(result.error || "Verification failed.");
      setCode("");
    }
    setBusy(false);
  };

  const showMfa = status === "mfa_required";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "#0E121A" }}>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#1528A1]/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#1160CB]/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="inline-flex items-center text-white/40 hover:text-white mb-8 transition-colors group text-[14px]">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Store
        </Link>

        <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3.5 bg-[#1528A1] rounded-[14px] shadow-lg shadow-[#1528A1]/30 mb-4">
              {showMfa ? <Smartphone className="h-7 w-7 text-white" /> : <Lock className="h-7 w-7 text-white" />}
            </div>
            <h1 className="text-[24px] font-bold text-white tracking-[-0.5px]">
              {showMfa ? "Two-Factor Verification" : "Admin Access"}
            </h1>
            <p className="text-[14px] text-white/50 mt-1">
              {showMfa
                ? `Enter the 6-digit code from your authenticator app${sessionEmail ? ` for ${sessionEmail}` : ""}.`
                : "Sign in to manage the WIVITEC store"}
            </p>
          </div>

          {!isSupabaseConfigured && (
            <div className="mb-5 flex items-start gap-3 bg-amber-500/10 border border-amber-500/20 text-amber-200 rounded-[10px] px-4 py-3 text-[13px]">
              <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
              Supabase is not configured, so admin sign-in is unavailable.
            </div>
          )}

          {errorMsg && (
            <div role="alert" className="mb-5 flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-[10px] px-4 py-3 text-[13px]">
              <ShieldCheck size={16} className="flex-shrink-0 mt-0.5" />
              {errorMsg}
            </div>
          )}
          {infoMsg && (
            <div role="status" className="mb-5 flex items-start gap-3 bg-[#1160CB]/10 border border-[#1160CB]/25 text-[#9CC4FA] rounded-[10px] px-4 py-3 text-[13px]">
              {infoMsg}
            </div>
          )}

          {status === "loading" ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-[#1160CB] border-t-transparent rounded-full" />
            </div>
          ) : showMfa ? (
            <form onSubmit={handleVerify} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="totp" className="text-[13px] font-semibold text-white/80">Authentication code</Label>
                <Input
                  id="totp"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  autoFocus
                  className={`${inputClass} text-center text-[22px] font-semibold tracking-[0.5em] tabular-nums`}
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                />
              </div>
              <button type="submit" className={primaryBtn} disabled={busy || code.length !== 6}>
                {busy ? "Verifying..." : "Verify"}
              </button>
              <button
                type="button"
                onClick={() => { setCode(""); setErrorMsg(""); logout(); }}
                className="w-full text-[13px] text-white/40 hover:text-white transition-colors"
              >
                Use a different account
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <button
                type="button"
                onClick={handleGoogle}
                disabled={!isSupabaseConfigured}
                className="w-full h-12 rounded-[10px] bg-white hover:bg-white/90 text-[#0C0D10] text-[14px] font-semibold transition-colors flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GoogleMark /> Continue with Google
              </button>

              <div className="flex items-center gap-3 text-[12px] text-white/30">
                <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[13px] font-semibold text-white/80">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="username"
                    className={inputClass}
                    placeholder="you@wivitec.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[13px] font-semibold text-white/80">Password</Label>
                    <button type="button" onClick={handleForgot} className="text-[12px] font-semibold text-[#479BF7] hover:text-white transition-colors">
                      Forgot?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    className={inputClass}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={primaryBtn} disabled={busy || !isSupabaseConfigured}>
                  {busy ? "Signing in..." : <>Sign In <Lock size={16} /></>}
                </button>
              </form>
            </div>
          )}
        </div>

        <p className="text-center mt-8 text-white/30 text-[13px]">
          Authorized Personnel Only • © {new Date().getFullYear()} WIVITEC
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;
