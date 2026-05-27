"use client";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Cookie, X, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Small delay so it doesn't flash immediately on load
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6",
        "animate-in slide-in-from-bottom duration-500"
      )}
    >
      <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        {/* Icon */}
        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Cookie size={20} className="text-amber-400" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-black text-sm uppercase tracking-widest text-slate-900 mb-1">
            We use cookies 🍪
          </p>
          <p className="text-slate-600 text-xs font-medium leading-relaxed">
            We use cookies to improve your experience, analyze traffic, and personalize content.
            By clicking "Accept", you agree to our{" "}
            <Link to="/privacy-policy" className="text-[#0033CC] hover:underline font-bold">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 flex-shrink-0 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={decline}
            className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 text-xs font-black uppercase tracking-widest rounded-xl flex-1 sm:flex-none"
          >
            Decline
          </Button>
          <Button
            size="sm"
            onClick={accept}
            className="bg-[#0033CC] hover:bg-[#002299] text-white text-xs font-black uppercase tracking-widest rounded-xl gap-2 flex-1 sm:flex-none"
          >
            <ShieldCheck size={14} /> Accept All
          </Button>
        </div>

        {/* Close */}
        <button
          onClick={decline}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 transition-colors sm:relative sm:top-auto sm:right-auto flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
