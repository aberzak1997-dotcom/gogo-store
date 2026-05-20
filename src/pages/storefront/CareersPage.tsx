"use client";

import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Briefcase, Users, Zap, Heart } from "lucide-react";

const CareersPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow">
        <section className="bg-slate-900 py-24 text-white text-center">
          <div className="section-container max-w-3xl mx-auto space-y-6">
            <h1 className="text-6xl font-black tracking-tight">Join the Team</h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Help us build the future of electronics retail. We're looking for passionate tech enthusiasts to join our growing team.
            </p>
          </div>
        </section>

        <section className="py-24 section-container">
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {[
              { icon: Zap, title: "Fast Paced", desc: "Work in a dynamic environment where innovation is celebrated." },
              { icon: Users, title: "Great Culture", desc: "Join a team of tech lovers who support each other." },
              { icon: Heart, title: "Benefits", desc: "Competitive salary, remote work options, and tech discounts." },
            ].map((item, i) => (
              <div key={i} className="p-10 rounded-none bg-white border border-slate-100 shadow-sm text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-none flex items-center justify-center mx-auto text-primary">
                  <item.icon size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto bg-white p-12 md:p-20 rounded-none border border-slate-100 shadow-xl text-center space-y-8">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
              <Briefcase size={40} />
            </div>
            <h2 className="text-4xl font-black text-slate-900">Current Openings</h2>
            <p className="text-slate-500 text-lg">
              We don't have any open roles right now, but we're always looking for talented people.
            </p>
            <div className="pt-4">
              <p className="text-slate-600 mb-6">
                Think you'd be a great fit? Send your CV and a short intro to our team.
              </p>
              <Link to="/contact">
                <Button size="lg" className="rounded-none h-14 px-10 font-black">Contact Us</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default CareersPage;