"use client";

import React, { useEffect, useState } from "react";
import { KeyRound, Mail, ShieldCheck, Smartphone, Eye, EyeOff, Check, X, AlertTriangle } from "lucide-react";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "../../utils/toast";
import { cn } from "@/lib/utils";
import { TwoFactorPanel } from "./TwoFactorSetupPage";

export const passwordRules = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
  { label: "One number", test: (p: string) => /\d/.test(p) },
  { label: "One special character", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

const strengthLevels = [
  { label: "Very weak", color: "bg-rose-500", text: "text-rose-500" },
  { label: "Weak", color: "bg-orange-500", text: "text-orange-500" },
  { label: "Fair", color: "bg-amber-500", text: "text-amber-500" },
  { label: "Good", color: "bg-[#1160CB]", text: "text-[#1160CB]" },
  { label: "Strong", color: "bg-emerald-500", text: "text-emerald-500" },
];

export const PasswordStrength: React.FC<{ password: string; dark?: boolean }> = ({ password, dark }) => {
  if (!password) return null;
  const score = passwordRules.filter((r) => r.test(password)).length;
  const level = strengthLevels[Math.max(0, score - 1)];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex-1 flex gap-1">
          {passwordRules.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                i < score ? level.color : dark ? "bg-white/10" : "bg-[#F0F2F8]"
              )}
            />
          ))}
        </div>
        <span className={cn("text-[12px] font-semibold", level.text)}>{level.label}</span>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
        {passwordRules.map((rule) => {
          const ok = rule.test(password);
          return (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-2 text-[12px]",
                ok ? "text-emerald-500" : dark ? "text-white/40" : "text-[#0C0D10]/40"
              )}
            >
              {ok ? <Check size={13} /> : <X size={13} />}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export const isPasswordStrong = (p: string) => passwordRules.every((r) => r.test(p));

const PasswordInput: React.FC<{
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}> = ({ id, value, onChange, placeholder, autoComplete }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="h-11 rounded-[8px] pr-10"
        required
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0C0D10]/40 hover:text-[#0C0D10]"
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

const primaryBtn =
  "w-full h-11 rounded-[8px] bg-[#1528A1] hover:bg-[#1160CB] text-white text-[14px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed";

const SecurityPage = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Change password
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changing, setChanging] = useState(false);

  // Email recovery
  const [recoveryTarget, setRecoveryTarget] = useState<"current" | "backup">("current");
  const [backupEmail, setBackupEmail] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  const hasSession = Boolean(supabase && userEmail);
  const passwordsMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !userEmail) return;

    if (!isPasswordStrong(newPassword)) {
      showError("New password does not meet all requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("Passwords do not match.");
      return;
    }
    setChanging(true);
    try {
      // No re-login to check the current password: signing in again would
      // replace this 2FA-verified session. The admin session itself is the proof.
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        showError(error.message);
        return;
      }

      showSuccess("Password updated successfully.");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setChanging(false);
    }
  };

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    const email = (recoveryTarget === "current" ? userEmail : backupEmail)?.trim().toLowerCase();
    if (!email) {
      showError("Please enter an email address.");
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/security/reset-password`,
      });
      if (error) {
        showError(error.message);
        return;
      }
      showSuccess(`Reset link sent to ${email}. Check your inbox.`);
      setBackupEmail("");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-[24px] font-bold text-[#0C0D10] tracking-[-0.5px] flex items-center gap-2">
          <ShieldCheck className="text-[#1528A1]" size={24} /> Security
        </h1>
        <p className="text-[14px] text-[#0C0D10]/50 mt-1">
          Manage your admin password, account recovery and two-factor authentication.
        </p>
      </div>

      {!isSupabaseConfigured && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-[10px] px-4 py-3 text-[13px]">
          <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
          Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable security features.
        </div>
      )}

      <Tabs defaultValue="password" className="w-full">
        <TabsList className="grid grid-cols-3 w-full h-11 bg-white border border-[#E4E7F0] rounded-[10px] p-1">
          <TabsTrigger
            value="password"
            className="rounded-[7px] text-[13px] font-semibold gap-2 data-[state=active]:bg-[#1528A1] data-[state=active]:text-white"
          >
            <KeyRound size={15} /> Change Password
          </TabsTrigger>
          <TabsTrigger
            value="recovery"
            className="rounded-[7px] text-[13px] font-semibold gap-2 data-[state=active]:bg-[#1528A1] data-[state=active]:text-white"
          >
            <Mail size={15} /> Email Recovery
          </TabsTrigger>
          <TabsTrigger
            value="2fa"
            className="rounded-[7px] text-[13px] font-semibold gap-2 data-[state=active]:bg-[#1528A1] data-[state=active]:text-white"
          >
            <Smartphone size={15} /> Two-Factor
          </TabsTrigger>
        </TabsList>

        {/* ── Change Password ── */}
        <TabsContent value="password" className="mt-4">
          <div className="bg-white rounded-[12px] border border-[#E4E7F0] p-6">
            <form onSubmit={handleChangePassword} className="space-y-5">
              {userEmail && (
                <p className="text-[13px] text-[#0C0D10]/50">
                  Signed in as <span className="font-semibold text-[#0C0D10]">{userEmail}</span>
                </p>
              )}
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-[13px] font-semibold">New password</Label>
                <PasswordInput
                  id="new-password"
                  value={newPassword}
                  onChange={setNewPassword}
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
                <PasswordStrength password={newPassword} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-[13px] font-semibold">Confirm new password</Label>
                <PasswordInput
                  id="confirm-password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
                {confirmPassword && (
                  <p className={cn("text-[12px] flex items-center gap-1.5", passwordsMatch ? "text-emerald-500" : "text-rose-500")}>
                    {passwordsMatch ? <Check size={13} /> : <X size={13} />}
                    {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                  </p>
                )}
              </div>
              <button
                type="submit"
                className={primaryBtn}
                disabled={!hasSession || changing || !isPasswordStrong(newPassword) || !passwordsMatch}
              >
                {changing ? "Updating..." : "Update Password"}
              </button>
            </form>
          </div>
        </TabsContent>

        {/* ── Email Recovery ── */}
        <TabsContent value="recovery" className="mt-4">
          <div className="bg-white rounded-[12px] border border-[#E4E7F0] p-6">
            <form onSubmit={handleSendReset} className="space-y-5">
              <p className="text-[13px] text-[#0C0D10]/60">
                Send a password reset link by email. The link opens a secure page where you can set a new password.
              </p>

              <div className="space-y-2">
                <label
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-[10px] border cursor-pointer transition-colors",
                    recoveryTarget === "current" ? "border-[#1528A1] bg-[#1528A1]/[0.04]" : "border-[#E4E7F0]",
                    !userEmail && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <input
                    type="radio"
                    name="recovery-target"
                    className="mt-1 accent-[#1528A1]"
                    checked={recoveryTarget === "current"}
                    disabled={!userEmail}
                    onChange={() => setRecoveryTarget("current")}
                  />
                  <div>
                    <p className="text-[13px] font-semibold text-[#0C0D10]">Current email</p>
                    <p className="text-[12px] text-[#0C0D10]/50">{userEmail ?? "No Supabase session"}</p>
                  </div>
                </label>

                <label
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-[10px] border cursor-pointer transition-colors",
                    recoveryTarget === "backup" ? "border-[#1528A1] bg-[#1528A1]/[0.04]" : "border-[#E4E7F0]"
                  )}
                >
                  <input
                    type="radio"
                    name="recovery-target"
                    className="mt-1 accent-[#1528A1]"
                    checked={recoveryTarget === "backup"}
                    onChange={() => setRecoveryTarget("backup")}
                  />
                  <div className="flex-1 space-y-2">
                    <p className="text-[13px] font-semibold text-[#0C0D10]">Another email</p>
                    <p className="text-[12px] text-[#0C0D10]/50">
                      Must belong to a registered admin account.
                    </p>
                    {recoveryTarget === "backup" && (
                      <Input
                        type="email"
                        value={backupEmail}
                        onChange={(e) => setBackupEmail(e.target.value)}
                        placeholder="backup@example.com"
                        className="h-11 rounded-[8px]"
                        required
                      />
                    )}
                  </div>
                </label>
              </div>

              <button
                type="submit"
                className={primaryBtn}
                disabled={!isSupabaseConfigured || sending || (recoveryTarget === "current" && !userEmail)}
              >
                {sending ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        </TabsContent>

        {/* ── Two-Factor ── */}
        <TabsContent value="2fa" className="mt-4">
          <TwoFactorPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityPage;
