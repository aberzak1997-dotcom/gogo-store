"use client";

import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";
import { Mail, RefreshCw, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const ConfirmEmailPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";

  const [resendStatus, setResendStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleResend = async () => {
    if (!email || !isSupabaseConfigured || !supabase) return;
    setResendStatus("sending");
    try {
      const { error } = await supabase.auth.resend({ type: "signup", email });
      setResendStatus(error ? "error" : "sent");
    } catch {
      setResendStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />

      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md text-center">

          {/* Icon */}
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 bg-[#EEF4FF] rounded-3xl flex items-center justify-center shadow-lg shadow-[#1160CB]/10">
              <Mail size={42} className="text-[#1160CB]" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-black text-[14px]">1</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight mb-3">
            Check your inbox
          </h1>
          <p className="text-slate-500 text-[14px] font-medium leading-relaxed mb-2">
            We sent a confirmation link to
          </p>
          {email && (
            <p className="text-[#1160CB] font-black text-[15px] mb-6 break-all">{email}</p>
          )}
          <p className="text-slate-400 text-[13px] font-medium leading-relaxed mb-10">
            Click the link in that email to verify your account.
            The link expires in <span className="font-bold text-slate-600">24 hours</span>.
          </p>

          {/* Steps */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 mb-8 text-left space-y-4">
            {[
              { step: "1", text: "Open your email app" },
              { step: "2", text: `Look for an email from WIVITEC` },
              { step: "3", text: "Click \"Confirm your email\"" },
              { step: "4", text: "You'll be redirected back to sign in" },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-[#EEF4FF] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#1160CB] font-black text-[12px]">{step}</span>
                </div>
                <p className="text-[13px] font-medium text-slate-600">{text}</p>
              </div>
            ))}
          </div>

          {/* Resend */}
          <div className="space-y-3 mb-8">
            {resendStatus === "sent" ? (
              <div className="flex items-center justify-center gap-2 text-emerald-600 text-[13px] font-bold bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
                <CheckCircle size={15} /> Email resent successfully!
              </div>
            ) : resendStatus === "error" ? (
              <p className="text-rose-600 text-[12px] font-medium">
                Failed to resend. Please try again in a moment.
              </p>
            ) : (
              <Button
                variant="outline"
                className="w-full h-11 rounded-2xl text-[13px] font-bold border-slate-200 text-slate-600 hover:text-[#1160CB] hover:border-[#1160CB]/30 gap-2"
                onClick={handleResend}
                disabled={resendStatus === "sending" || !isSupabaseConfigured}
              >
                {resendStatus === "sending"
                  ? <><RefreshCw size={14} className="animate-spin" /> Sending...</>
                  : <><RefreshCw size={14} /> Resend confirmation email</>
                }
              </Button>
            )}
          </div>

          {/* Back to sign in */}
          <Link
            to="/account/login"
            className="inline-flex items-center gap-2 text-[13px] font-bold text-slate-400 hover:text-[#1160CB] transition-colors"
          >
            <ArrowLeft size={14} /> Back to Sign In
          </Link>

          {/* Spam note */}
          <p className="text-slate-300 text-[11px] font-medium mt-8">
            Can't find the email? Check your spam or junk folder.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ConfirmEmailPage;
