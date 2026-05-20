"use client";

import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow section-container py-12">
        <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-none border border-slate-100 shadow-sm">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-12">Privacy Policy</h1>
          
          <div className="prose prose-slate max-w-none space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">1. Information We Collect</h2>
              <p className="text-slate-600 leading-relaxed">
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact support. This may include your name, email address, shipping address, and payment information.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">2. How We Use Your Information</h2>
              <p className="text-slate-600 leading-relaxed">
                We use the information we collect to process your orders, communicate with you about your purchase, and improve our services. We do not sell your personal information to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">3. Cookies and Local Storage</h2>
              <p className="text-slate-600 leading-relaxed">
                We use cookies and local storage to enhance your browsing experience, remember your cart items, and analyze site traffic. You can manage your cookie preferences through your browser settings.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">4. Data Security</h2>
              <p className="text-slate-600 leading-relaxed">
                We implement industry-standard security measures to protect your personal information. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-black text-slate-900">5. Contact Us</h2>
              <p className="text-slate-600 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at privacy@techstore.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;