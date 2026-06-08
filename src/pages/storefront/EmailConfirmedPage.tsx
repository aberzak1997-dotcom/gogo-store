"use client";

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { CheckCircle, Loader2, XCircle, ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from 'react-i18next';

type Status = "verifying" | "success" | "error";

const EmailConfirmedPage = () => {
  const { customer, isCustomerLoading } = useCustomerAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [status, setStatus] = useState<Status>("verifying");
  const [customerName, setCustomerName] = useState("");
  const [countdown, setCountdown] = useState(5);

  // ── Handle Supabase hash-based auth callback ────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      // No Supabase — nothing to confirm
      setStatus("error");
      return;
    }

    // Supabase embeds tokens in the URL hash.
    // The client processes them automatically; we just listen for the result.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        const name = session?.user?.user_metadata?.full_name
          || session?.user?.email?.split("@")[0]
          || "there";
        setCustomerName(name);
        setStatus("success");
      }
    });

    // Also check if user is already confirmed (e.g. they revisit the page)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const name = session.user.user_metadata?.full_name
          || session.user.email?.split("@")[0]
          || "there";
        setCustomerName(name);
        setStatus("success");
      } else {
        // Give the hash a moment to be processed, then mark error if still no session
        setTimeout(() => {
          setStatus(prev => prev === "verifying" ? "error" : prev);
        }, 4000);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Auto-redirect countdown after success ───────────────────────────────────
  useEffect(() => {
    if (status !== "success") return;
    if (countdown <= 0) {
      navigate("/account");
      return;
    }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [status, countdown, navigate]);

  // ── Also react to CustomerAuthContext updating customer ─────────────────────
  useEffect(() => {
    if (!isCustomerLoading && customer && status === "verifying") {
      setCustomerName(customer.name);
      setStatus("success");
    }
  }, [customer, isCustomerLoading, status]);

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md text-center">

          {/* ── Verifying ── */}
          {status === "verifying" && (
            <>
              <div className="w-24 h-24 bg-[#EEF4FF] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-[#1160CB]/10">
                <Loader2 size={40} className="text-[#1160CB] animate-spin" />
              </div>
              <h1 className="text-[26px] font-black text-slate-900 mb-3">{t('auth.confirmed.verifying')}</h1>
              <p className="text-slate-400 text-[14px] font-medium">{t('auth.confirmed.verifyingDesc')}</p>
            </>
          )}

          {/* ── Success ── */}
          {status === "success" && (
            <>
              {/* Animated checkmark */}
              <div className="relative inline-flex mb-8">
                <div className="w-28 h-28 bg-emerald-50 rounded-3xl flex items-center justify-center shadow-xl shadow-emerald-500/15 animate-bounce-once">
                  <CheckCircle size={56} className="text-emerald-500" strokeWidth={1.5} />
                </div>
                <div className="absolute inset-0 rounded-3xl bg-emerald-400/10 animate-ping" style={{ animationDuration: "2s" }} />
              </div>

              <div className="mb-2">
                <span className="inline-block text-[11px] font-black uppercase tracking-[3px] text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full mb-4">
                  ✓ {t('auth.confirmed.confirmed')}
                </span>
              </div>

              <h1 className="text-[30px] font-black text-slate-900 tracking-tight mb-3">
                {t('auth.confirmed.welcome', { name: customerName ? `, ${customerName.split(" ")[0]}` : "" })}
              </h1>
              <p className="text-slate-500 text-[14px] font-medium leading-relaxed mb-10">
                {t('auth.confirmed.welcomeDesc')}
              </p>

              {/* Countdown CTA */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-6">
                <p className="text-[13px] text-slate-400 font-medium mb-4">
                  {t('auth.confirmed.redirecting')}{" "}
                  <span className="font-black text-[#1160CB] text-[18px]">{countdown}</span>s…
                </p>
                <Button
                  className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[12px] bg-[#1160CB] hover:bg-[#1528A1] text-white gap-2 shadow-lg shadow-[#1160CB]/20"
                  onClick={() => navigate("/account")}
                >
                  {t('auth.confirmed.goToAccount')} <ArrowRight size={15} />
                </Button>
              </div>

              <Button
                variant="outline"
                className="w-full h-11 rounded-2xl font-bold text-[13px] border-slate-200 text-slate-500 hover:text-[#1160CB] gap-2"
                onClick={() => navigate("/products")}
              >
                <ShoppingBag size={14} /> {t('auth.confirmed.startShopping')}
              </Button>
            </>
          )}

          {/* ── Error ── */}
          {status === "error" && (
            <>
              <div className="w-24 h-24 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-rose-500/10">
                <XCircle size={44} className="text-rose-400" strokeWidth={1.5} />
              </div>
              <h1 className="text-[26px] font-black text-slate-900 mb-3">{t('auth.confirmed.errorTitle')}</h1>
              <p className="text-slate-500 text-[14px] font-medium leading-relaxed mb-8">
                {t('auth.confirmed.errorDesc')}
              </p>
              <div className="space-y-3">
                <Button
                  className="w-full h-12 rounded-2xl font-black uppercase tracking-widest text-[12px] bg-[#1160CB] hover:bg-[#1528A1] text-white gap-2"
                  onClick={() => navigate("/account/login")}
                >
                  {t('auth.confirmed.backToSignIn')} <ArrowRight size={15} />
                </Button>
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EmailConfirmedPage;
