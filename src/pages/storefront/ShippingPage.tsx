"use client";

import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Truck, Globe, Clock, ShieldCheck } from "lucide-react";

const ShippingPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow section-container py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Shipping & Delivery</h1>
            <p className="text-slate-500 text-lg">
              Fast, reliable, and secure shipping for all your tech gear.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white p-8 rounded-none border border-slate-100 shadow-sm space-y-6">
              <div className="w-14 h-14 bg-primary/10 rounded-none flex items-center justify-center text-primary">
                <Truck size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">Domestic Shipping</h3>
              <ul className="space-y-4 text-slate-600">
                <li className="flex justify-between border-b pb-2">
                  <span className="font-bold">Standard (3-5 days)</span>
                  <span className="text-primary font-black">$9.99</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="font-bold">Express (1-2 days)</span>
                  <span className="text-primary font-black">$19.99</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="font-bold">Orders over $100</span>
                  <span className="text-emerald-500 font-black">FREE</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-none border border-slate-100 shadow-sm space-y-6">
              <div className="w-14 h-14 bg-primary/10 rounded-none flex items-center justify-center text-primary">
                <Globe size={28} />
              </div>
              <h3 className="text-2xl font-black text-slate-900">International Shipping</h3>
              <p className="text-slate-600 leading-relaxed">
                We ship to Canada, UK, and most of Europe. International rates are calculated at checkout based on weight and destination.
              </p>
              <p className="text-sm text-slate-400 italic">
                * Customs duties and taxes are the responsibility of the customer.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            <section className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900">Order Tracking</h2>
              <p className="text-slate-600 leading-relaxed">
                Once your order is dispatched, you will receive a confirmation email with a tracking number. You can use this number on our carrier's website to monitor your delivery progress in real-time.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-3xl font-black text-slate-900">Processing Times</h2>
              <p className="text-slate-600 leading-relaxed">
                Orders placed before 2:00 PM EST are typically processed and shipped the same business day. Orders placed on weekends or holidays will be processed the next business day.
              </p>
            </section>

            <div className="bg-slate-900 p-10 rounded-none text-white flex flex-col md:flex-row items-center gap-8">
              <div className="p-4 bg-white/10 rounded-none">
                <ShieldCheck size={48} className="text-primary" />
              </div>
              <div>
                <h4 className="text-2xl font-black mb-2">Secure Packaging</h4>
                <p className="text-slate-400">
                  All electronics are shipped in anti-static, shock-absorbent packaging to ensure they arrive in perfect condition.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ShippingPage;