"use client";

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, ArrowLeft, Check, X, AlertTriangle } from "lucide-react";
import { supabase } from "../../lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "../../utils/toast";
import { cn } from "@/lib/utils";
import { PasswordStrength, isPasswordStrong } from "./SecurityPage";

type Status = "checking" | "ready" | "invalid";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("checking");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setStatus("invalid");
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setStatus("ready");
      }
    });

    // The recovery token in the URL may already have been processed before this
    // component mounted, so also check for an existing session.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setStatus("ready");
    });

    // If no session appears, the link is invalid or expired
    const timeout = setTimeout(() => {
      setStatus((s) => (s === "checking" ? "invalid" : s));
    }, 4000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    if (!isPasswordStrong(password)) {
      showError("Password does not meet all requirements.");
      return;
    }
    if (!passwordsMatch) {
      showError("Passwords do not match.");
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        showError(error.message);
        return;
      }
      await supabase.auth.signOut().catch(() => {});
      showSuccess("Password reset. Please sign in with your new password.");
      navigate("/admin/login", { replace: true });
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "h-12 rounded-[10px] bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:ring-[#1160CB]";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden" style={{ background: "#0E121A" }}>
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#1528A1]/20 rounded-full blur-[100px]" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#1160CB]/20 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/admin/login" className="inline-flex items-center text-white/40 hover:text-white mb-8 transition-colors group text-[14px]">
          <ArrowLeft size={18} className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Login
        </Link>

        <div className="rounded-[20px] border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="p-3.5 bg-[#1528A1] rounded-[14px] shadow-lg shadow-[#1528A1]/30 mb-4">
              <KeyRound className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-[24px] font-bold text-white tracking-[-0.5px]">Reset Password</h1>
            <p className="text-[14px] text-white/50 mt-1">Choose a new password for your admin account</p>
          </div>

          {status === "checking" && (
            <div className="flex justify-center py-8">
              <div className="animate-spin h-8 w-8 border-4 border-[#1160CB] border-t-transparent rounded-full" />
            </div>
          )}

          {status === "invalid" && (
            <div className="space-y-5">
              <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-[10px] px-4 py-3 text-[13px]">
                <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
                This reset link is invalid or has expired. Please request a new one.
              </div>
              <Link
                to="/admin/login"
                className="flex items-center justify-center w-full h-12 rounded-[10px] bg-[#1528A1] hover:bg-[#1160CB] text-white text-[14px] font-semibold transition-colors"
              >
                Go to Login
              </Link>
            </div>
          )}

          {status === "ready" && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-[13px] font-semibold text-white/80">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  className={inputClass}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <PasswordStrength password={password} dark />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-[13px] font-semibold text-white/80">Confirm password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  className={inputClass}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {confirmPassword && (
                  <p className={cn("text-[12px] flex items-center gap-1.5", passwordsMatch ? "text-emerald-400" : "text-rose-400")}>
                    {passwordsMatch ? <Check size={13} /> : <X size={13} />}
                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </p>
                )}
              </div>
              <button
                type="submit"
                disabled={saving || !isPasswordStrong(password) || !passwordsMatch}
                className="w-full h-12 rounded-[10px] bg-[#1528A1] hover:bg-[#1160CB] text-white text-[14px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : "Set New Password"}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-8 text-white/30 text-[13px]">
          Authorized Personnel Only • © 2025 WIVITEC
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
