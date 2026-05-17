"use client";

import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { RotateCcw, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ReturnsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow section-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Returns & Refunds</h1>
            <p className="text-slate-500 text-lg">
              Not satisfied with your purchase? We've made returns simple and stress-free.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { icon: Clock, title: "30 Days", desc: "Return window for all items" },
              { icon: CheckCircle2, title: "Easy Process", desc: "Online return portal" },
              { icon: RotateCcw, title: "Fast Refunds", desc: "Processed in 3-5 days" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto text-primary">
                  <item.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="text-slate-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="space-y-12">
            <section className="space-y-6">
              <h2 className="text-3xl font-black text-slate-900">Return Conditions</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  "Item must be in original packaging",
                  "All accessories must be included",
                  "No signs of physical damage",
                  "Proof of purchase required",
                  "Security seals must be intact",
                  "Software must be unactivated"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-100">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <span className="text-slate-600 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900">How to Start a Return</h2>
              <ol className="space-y-6">
                {[
                  { step: "1", title: "Contact Support", desc: "Email us with your order number and reason for return." },
                  { step: "2", title: "Receive Label", desc: "We'll send you a prepaid shipping label if the item is defective." },
                  { step: "3", title: "Pack & Ship", desc: "Securely pack the item and drop it off at any authorized carrier location." },
                  { step: "4", title: "Get Refunded", desc: "Once received and inspected, your refund will be issued to your original payment method." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-6">
                    <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg">{item.title}</h4>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 flex gap-6">
              <AlertTriangle className="text-amber-600 flex-shrink-0" size={32} />
              <div>
                <h4 className="text-xl font-black text-amber-900 mb-2">Non-Returnable Items</h4>
                <p className="text-amber-800/70 leading-relaxed">
                  Please note that personalized items, opened software, and items marked as "Final Sale" cannot be returned unless they arrive defective.
                </p>
              </div>
            </div>

            <div className="text-center pt-8">
              <Link to="/contact">
                <Button size="lg" className="rounded-2xl h-14 px-10 font-black">Start a Return Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReturnsPage;