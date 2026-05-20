"use client";

import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ShieldCheck, CheckCircle2, XCircle, Info } from "lucide-react";

const WarrantyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow section-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Warranty Policy</h1>
            <p className="text-slate-500 text-lg">
              Peace of mind with every purchase. We stand behind our tech.
            </p>
          </div>

          <div className="bg-primary rounded-none p-12 text-white mb-16 flex flex-col md:flex-row items-center gap-12">
            <div className="p-6 bg-white/10 rounded-none">
              <ShieldCheck size={64} className="text-white" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black">1-Year Standard Warranty</h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed">
                All electronics and accessories purchased from ElectroStore come with a standard 1-year manufacturer warranty covering defects in materials and workmanship.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <CheckCircle2 className="text-emerald-500" /> What's Covered
              </h3>
              <ul className="space-y-4">
                {[
                  "Manufacturing defects",
                  "Hardware failure under normal use",
                  "Battery degradation exceeding 20% in first year",
                  "Connectivity issues (Bluetooth/Wi-Fi)",
                  "Dead pixels on displays"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <XCircle className="text-red-500" /> What's Not Covered
              </h3>
              <ul className="space-y-4">
                {[
                  "Accidental damage (drops, spills)",
                  "Unauthorized repairs or modifications",
                  "Normal wear and tear",
                  "Theft or loss",
                  "Software issues caused by 3rd party apps"
                ].map((text, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-600">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <section className="bg-white p-10 rounded-none border border-slate-100 shadow-sm space-y-4">
              <h2 className="text-3xl font-black text-slate-900">How to Claim</h2>
              <p className="text-slate-600 leading-relaxed">
                To initiate a warranty claim, please contact our support team with your order number and a detailed description of the issue. Photos or videos of the defect may be required to process your claim efficiently.
              </p>
              <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-none text-sm text-slate-500">
                <Info size={18} className="text-primary" />
                <span>Warranty claims are typically processed within 7-10 business days.</span>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WarrantyPage;