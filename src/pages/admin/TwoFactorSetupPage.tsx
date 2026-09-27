"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ShieldOff, Smartphone, Trash2, Plus, Copy, ArrowLeft, AlertTriangle } from "lucide-react";
import type { Factor } from "@supabase/supabase-js";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { showError, showSuccess } from "../../utils/toast";
import { cn } from "@/lib/utils";

type Enrollment = { factorId: string; qrCode: string; secret: string };

const primaryBtn =
  "h-11 px-5 rounded-[8px] bg-[#1528A1] hover:bg-[#1160CB] text-white text-[14px] font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2";
const secondaryBtn =
  "h-11 px-5 rounded-[8px] border border-[#E4E7F0] bg-white hover:bg-[#F0F2F8] text-[#0C0D10] text-[14px] font-semibold transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2";

/**
 * Two-factor authentication management, backed by Supabase Auth MFA (TOTP).
 * The secret is stored by Supabase, never in our tables. Backup access =
 * a second authenticator enrolled on another device.
 */
export const TwoFactorPanel: React.FC = () => {
  const { refresh } = useAuth();
  const [factors, setFactors] = useState<Factor[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return setLoading(false);
    const { data, error } = await supabase.auth.mfa.listFactors();
    if (error) showError(error.message);
    setFactors(data?.totp ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEnrollment = async () => {
    if (!supabase) return;
    setBusy(true);
    try {
      // Clear abandoned, never-verified setups first
      const { data: all } = await supabase.auth.mfa.listFactors();
      for (const f of all?.all ?? []) {
        if (f.status === "unverified") await supabase.auth.mfa.unenroll({ factorId: f.id });
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: `Authenticator ${new Date().toLocaleDateString()} ${Date.now().toString().slice(-4)}`,
      });
      if (error || !data) {
        showError(error?.message || "Could not start 2FA setup.");
        return;
      }
      setEnrollment({ factorId: data.id, qrCode: data.totp.qr_code, secret: data.totp.secret });
      setCode("");
    } finally {
      setBusy(false);
    }
  };

  const cancelEnrollment = async () => {
    if (supabase && enrollment) await supabase.auth.mfa.unenroll({ factorId: enrollment.factorId }).catch(() => {});
    setEnrollment(null);
    setCode("");
  };

  const confirmEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase || !enrollment) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: enrollment.factorId, code });
      if (error) {
        showError("That code didn't work. Wait for a fresh code and try again.");
        setCode("");
        return;
      }
      showSuccess(factors.length ? "Backup authenticator added." : "Two-factor authentication is on.");
      setEnrollment(null);
      setCode("");
      await load();
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const removeFactor = async (factor: Factor) => {
    if (!supabase) return;
    const last = factors.length === 1;
    const ok = window.confirm(
      last
        ? "Turn off two-factor authentication? Your admin account will be protected by password only."
        : `Remove "${factor.friendly_name ?? "this authenticator"}"?`
    );
    if (!ok) return;
    setBusy(true);
    try {
      const { error } = await supabase.auth.mfa.unenroll({ factorId: factor.id });
      if (error) {
        showError(error.message);
        return;
      }
      showSuccess(last ? "Two-factor authentication is off." : "Authenticator removed.");
      await load();
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-[10px] px-4 py-3 text-[13px]">
        <AlertTriangle size={16} className="flex-shrink-0 mt-0.5" />
        Supabase is not configured, so two-factor authentication is unavailable.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-[12px] border border-[#E4E7F0] p-10 flex justify-center">
        <div className="animate-spin h-7 w-7 border-4 border-[#1160CB] border-t-transparent rounded-full" />
      </div>
    );
  }

  const enabled = factors.length > 0;

  return (
    <div className="space-y-4">
      {/* ── Status ── */}
      <div className="bg-white rounded-[12px] border border-[#E4E7F0] p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0",
              enabled ? "bg-emerald-50 text-emerald-600" : "bg-[#F0F2F8] text-[#0C0D10]/40"
            )}
          >
            {enabled ? <ShieldCheck size={20} /> : <ShieldOff size={20} />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-semibold text-[#0C0D10]">
              Two-factor authentication is {enabled ? "on" : "off"}
            </p>
            <p className="text-[13px] text-[#0C0D10]/50 mt-0.5">
              {enabled
                ? "Signing in requires a 6-digit code from your authenticator app."
                : "Add a code from an authenticator app (Google Authenticator, 1Password, Authy) to every admin sign-in."}
            </p>
          </div>
          {!enabled && !enrollment && (
            <button type="button" className={primaryBtn} onClick={startEnrollment} disabled={busy}>
              Turn on
            </button>
          )}
        </div>

        {enabled && (
          <ul className="mt-5 divide-y divide-[#F0F2F8] border-t border-[#F0F2F8]">
            {factors.map((f) => (
              <li key={f.id} className="flex items-center gap-3 py-3">
                <Smartphone size={16} className="text-[#1160CB]" />
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-[#0C0D10] truncate">{f.friendly_name || "Authenticator app"}</p>
                  <p className="text-[12px] text-[#0C0D10]/40">Added {new Date(f.created_at).toLocaleDateString()}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFactor(f)}
                  disabled={busy}
                  className="p-2 rounded-[8px] text-[#0C0D10]/40 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  aria-label={`Remove ${f.friendly_name || "authenticator"}`}
                >
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ── Backup ── */}
      {enabled && !enrollment && (
        <div className="bg-white rounded-[12px] border border-[#E4E7F0] p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-[#0C0D10]">Backup authenticator</p>
            <p className="text-[13px] text-[#0C0D10]/50 mt-0.5">
              {factors.length > 1
                ? "You have a backup. Either device can sign you in."
                : "Add a second device (another phone or a password manager) so losing one phone doesn't lock you out."}
            </p>
          </div>
          <button type="button" className={secondaryBtn} onClick={startEnrollment} disabled={busy}>
            <Plus size={15} /> Add backup
          </button>
        </div>
      )}

      {/* ── Enrollment ── */}
      {enrollment && (
        <div className="bg-white rounded-[12px] border border-[#E4E7F0] p-6 space-y-5">
          <div>
            <p className="text-[15px] font-semibold text-[#0C0D10]">
              {enabled ? "Add a backup authenticator" : "Set up your authenticator"}
            </p>
            <p className="text-[13px] text-[#0C0D10]/50 mt-0.5">
              1. Scan this QR code with your authenticator app. 2. Enter the 6-digit code it shows.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <div className="p-3 bg-white border border-[#E4E7F0] rounded-[12px] flex-shrink-0">
              <img src={enrollment.qrCode} alt="QR code for your authenticator app" width={180} height={180} />
            </div>
            <div className="flex-1 w-full space-y-4">
              <div className="space-y-1.5">
                <p className="text-[12px] font-semibold text-[#0C0D10]/60">Can't scan? Enter this key instead:</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 min-w-0 break-all text-[12px] bg-[#F0F2F8] rounded-[8px] px-3 py-2 font-mono text-[#0C0D10]">
                    {enrollment.secret}
                  </code>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(enrollment.secret).then(() => showSuccess("Key copied."))}
                    className="p-2 rounded-[8px] text-[#0C0D10]/50 hover:text-[#1160CB] hover:bg-[#F0F2F8]"
                    aria-label="Copy setup key"
                  >
                    <Copy size={15} />
                  </button>
                </div>
              </div>

              <form onSubmit={confirmEnrollment} className="space-y-3">
                <Label htmlFor="enroll-code" className="text-[13px] font-semibold">6-digit code</Label>
                <Input
                  id="enroll-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  className="h-12 rounded-[8px] text-center text-[20px] font-semibold tracking-[0.4em] tabular-nums"
                  placeholder="000000"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  required
                />
                <div className="flex gap-2">
                  <button type="submit" className={cn(primaryBtn, "flex-1")} disabled={busy || code.length !== 6}>
                    {busy ? "Verifying..." : "Verify & turn on"}
                  </button>
                  <button type="button" className={secondaryBtn} onClick={cancelEnrollment} disabled={busy}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TwoFactorSetupPage = () => (
  <div className="space-y-6 max-w-2xl">
    <div>
      <Link to="/admin/security" className="inline-flex items-center gap-1.5 text-[13px] text-[#0C0D10]/50 hover:text-[#1160CB] mb-3">
        <ArrowLeft size={14} /> Security
      </Link>
      <h1 className="text-[24px] font-bold text-[#0C0D10] tracking-[-0.5px] flex items-center gap-2">
        <Smartphone className="text-[#1528A1]" size={24} /> Two-Factor Authentication
      </h1>
      <p className="text-[14px] text-[#0C0D10]/50 mt-1">Protect admin sign-ins with a code from your phone.</p>
    </div>
    <TwoFactorPanel />
  </div>
);

export default TwoFactorSetupPage;
