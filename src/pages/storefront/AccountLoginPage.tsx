"use client";

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { showSuccess, showError } from "../../utils/toast";
import { useTranslation } from 'react-i18next';

const AccountLoginPage = () => {
  const { customerLogin, customerRegister, customer, isCustomerLoading } = useCustomerAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [tab, setTab] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in (after loading is done)
  React.useEffect(() => {
    if (!isCustomerLoading && customer) {
      navigate("/account");
    }
  }, [isCustomerLoading, customer, navigate]);

  if (isCustomerLoading || customer) return null;

  const reset = () => { setError(""); setName(""); setEmail(""); setPassword(""); setConfirmPassword(""); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (tab === "register") {
      if (password !== confirmPassword) {
        setError(t('auth.passwordsDontMatch'));
        setIsLoading(false);
        return;
      }
      if (password.length < 6) {
        setError(t('auth.passwordTooShort'));
        setIsLoading(false);
        return;
      }
      const result = await customerRegister(name.trim(), email.trim(), password);
      if (result.success) {
        if (result.needsEmailConfirmation) {
          // Navigate to the dedicated "check your inbox" page
          navigate(`/account/confirm-email?email=${encodeURIComponent(email.trim())}`);
        } else {
          showSuccess(`Welcome, ${name.trim()}! Your account has been created.`);
          navigate("/account");
        }
      } else {
        setError(result.error || t('auth.registrationFailed'));
      }
    } else {
      const result = await customerLogin(email.trim(), password);
      if (result.success) {
        showSuccess("Welcome back! You're now logged in.");
        navigate("/account");
      } else {
        // "Invalid login credentials" from Supabase often means unconfirmed email
        const hint = result.error?.toLowerCase().includes("invalid") || result.error?.toLowerCase().includes("credentials")
          ? t('auth.invalidCredentials')
          : result.error || t('auth.invalidCredentials');
        setError(hint);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      <main className="flex-grow flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-slate-900/20">
              <Zap size={28} fill="currentColor" className="text-[#0033CC]" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              {tab === "login" ? t('auth.welcomeBack') : t('auth.createAccount')}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-2">
              {tab === "login"
                ? t('auth.signInDesc')
                : t('auth.registerDesc')}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
            {(["login", "register"] as const).map(tabKey => (
              <button
                key={tabKey}
                onClick={() => { setTab(tabKey); reset(); }}
                className={cn(
                  "flex-1 py-2.5 text-xs font-black uppercase tracking-widest rounded-xl transition-all",
                  tab === tabKey ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {tabKey === "login" ? t('auth.signIn') : t('auth.register')}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name — Register only */}
              {tab === "register" && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('auth.fullName')}</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-medium"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('auth.email')}</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-medium"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('auth.password')}</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <Input
                    type={showPw ? "text" : "password"}
                    placeholder={tab === "register" ? t('auth.minPassword') : t('auth.yourPassword')}
                    className="pl-11 pr-11 h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-medium"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password — Register only */}
              {tab === "register" && (
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t('auth.confirmPassword')}</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <Input
                      type={showPw ? "text" : "password"}
                      placeholder="Repeat your password"
                      className="pl-11 h-12 rounded-2xl border-slate-200 bg-slate-50 focus:bg-white font-medium"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold rounded-2xl px-4 py-3">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                className="w-full h-13 rounded-2xl font-black uppercase tracking-widest text-xs gap-2 h-12 shadow-lg shadow-primary/20"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {t('auth.processing')}</span>
                ) : (
                  <span className="flex items-center gap-2">{tab === "login" ? t('auth.signIn') : t('auth.createAccount')} <ArrowRight size={15} /></span>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex-1 h-px bg-slate-100" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">or</span>
              <div className="flex-1 h-px bg-slate-100" />
            </div>

            {/* Switch mode */}
            <p className="text-center text-xs text-slate-500 font-medium">
              {tab === "login" ? (
                <>{t('auth.dontHaveAccount')}{" "}
                  <button onClick={() => { setTab("register"); reset(); }} className="font-black text-primary hover:underline">{t('auth.createFree')}</button>
                </>
              ) : (
                <>{t('auth.alreadyHaveAccount')}{" "}
                  <button onClick={() => { setTab("login"); reset(); }} className="font-black text-primary hover:underline">{t('auth.signIn')}</button>
                </>
              )}
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /> {t('auth.secure')}</div>
            <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /> {t('auth.encrypted')}</div>
            <div className="flex items-center gap-1.5"><ShieldCheck size={12} className="text-emerald-500" /> {t('auth.private')}</div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AccountLoginPage;
