"use client";

import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Smartphone, ShieldCheck, Zap, Headphones, Users, Globe } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-slate-900 py-24 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070')] bg-cover bg-center opacity-10" />
          <div className="section-container relative z-10 text-center max-w-3xl mx-auto space-y-6">
            <h1 className="text-6xl font-black tracking-tight">Our Mission</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              We believe that high-quality technology should be accessible to everyone. Our mission is to provide premium electronics and accessories that enhance your digital life.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24">
          <div className="section-container grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">The ElectroStore Story</h2>
              <p className="text-slate-600 text-lg leading-relaxed">
                Founded in 2024, ElectroStore started with a simple idea: why is it so hard to find reliable, high-quality tech accessories without paying a fortune?
              </p>
              <p className="text-slate-600 text-lg leading-relaxed">
                We spent months sourcing the best components and testing hundreds of products to build a collection we're proud of. Today, we serve thousands of tech enthusiasts worldwide.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-3xl font-black text-primary">10k+</p>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Customers</p>
                </div>
                <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <p className="text-3xl font-black text-primary">500+</p>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Products</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070" 
                alt="Tech Setup" 
                className="rounded-[3rem] shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-primary p-8 rounded-[2rem] text-white shadow-xl hidden lg:block">
                <Zap size={48} className="mb-4" />
                <p className="font-black text-xl">Innovation First</p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-white">
          <div className="section-container">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Our Core Values</h2>
              <p className="text-slate-500 mt-4">What drives us every single day.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: ShieldCheck, title: "Quality Guaranteed", desc: "Every product undergoes rigorous testing before it reaches your hands." },
                { icon: Headphones, title: "Customer Obsessed", desc: "Our support team is composed of tech experts who actually care." },
                { icon: Globe, title: "Global Reach", desc: "We ship our premium tech to enthusiasts in over 50 countries." },
              ].map((value, i) => (
                <div key={i} className="p-10 rounded-[2.5rem] bg-slate-50 border border-slate-100 text-center space-y-4">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-primary shadow-sm">
                    <value.icon size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">{value.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;