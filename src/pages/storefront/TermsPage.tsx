"use client";

import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const TermsPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow section-container py-12">
        <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-[3rem] border border-slate-100 shadow-sm">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-12">Terms & Conditions</h1>
          
          <div className="prose prose-slate max-w-none space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">1. Website Use</h2>
              <p className="text-slate-600 leading-relaxed">
                By accessing this website, you agree to be bound by these Terms and Conditions. You must be at least 18 years old to make a purchase on this site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">2. Product Information</h2>
              <p className="text-slate-600 leading-relaxed">
                We strive to provide accurate product descriptions and pricing. However, we do not warrant that product descriptions or other content are error-free. We reserve the right to correct any errors and cancel orders if necessary.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">3. Orders and Payments</h2>
              <p className="text-slate-600 leading-relaxed">
                All orders are subject to acceptance and availability. Payment must be made in full at the time of purchase. We use secure payment processors to handle your transactions.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">4. Limitation of Liability</h2>
              <p className="text-slate-600 leading-relaxed">
                ElectroStore shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">5. Governing Law</h2>
              <p className="text-slate-600 leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ElectroStore operates.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TermsPage;