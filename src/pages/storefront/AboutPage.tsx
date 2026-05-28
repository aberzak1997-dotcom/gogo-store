"use client";

import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { ShieldCheck, Zap, Headphones, Globe, ArrowRight, Package, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const AboutPage = () => {
  const cardStyle = {
    borderRadius: 12,
    border: "1px solid #F0F2F8",
    boxShadow: "0 2px 12px rgba(21,40,161,0.05)",
  };

  const stats = [
    { value: "10k+",   label: "Happy Customers" },
    { value: "500+",   label: "Products"         },
    { value: "1-Year", label: "Warranty"          },
    { value: "50+",    label: "Countries Shipped" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Quality Guaranteed",
      desc: "Every product undergoes rigorous testing before it reaches your hands.",
    },
    {
      icon: Headphones,
      title: "Customer Obsessed",
      desc: "Our support team is composed of tech experts who actually care about your experience.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      desc: "We ship our premium tech to enthusiasts in over 50 countries worldwide.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F2F8]">
      <Header />

      <main className="flex-grow py-10">
        <div className="section-container">

          {/* ── Page header ── */}
          <div className="mb-10">
            <p className="text-caption text-[#1160CB] mb-2">About Us</p>
            <h1
              className="text-[#0C0D10] font-bold"
              style={{ fontSize: "clamp(28px,4vw,40px)", letterSpacing: "-0.5px" }}
            >
              The WIVITEC Story
            </h1>
            <p className="text-[#0C0D10]/50 text-[15px] mt-2 max-w-xl">
              We believe that high-quality technology should be accessible to everyone in Morocco and beyond.
            </p>
          </div>

          {/* ── Story + Image ── */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Text + Stats */}
            <div className="bg-white p-8" style={cardStyle}>
              <p className="text-caption text-[#1160CB] mb-4">Our Mission</p>
              <p className="text-[#0C0D10]/65 text-[15px] leading-relaxed mb-4">
                WIVITEC brings you the latest in technology — from laptops and smartphones to
                accessories and smart home devices, all delivered to your door across Morocco.
              </p>
              <p className="text-[#0C0D10]/65 text-[15px] leading-relaxed">
                We spent months sourcing the best products and testing hundreds of items to build a
                collection we're proud of. Today, we serve thousands of tech enthusiasts and continue
                to grow every day.
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-4 mt-8 pt-6" style={{ borderTop: "1px solid #F0F2F8" }}>
                {stats.map((stat, i) => (
                  <div key={i}>
                    <p className="text-[#1528A1] font-bold text-[28px] leading-none">{stat.value}</p>
                    <p className="text-caption text-[#0C0D10]/40 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className="overflow-hidden" style={{ ...cardStyle, minHeight: 320 }}>
              <img
                src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070"
                alt="Tech Setup"
                className="w-full h-full object-cover"
                style={{ minHeight: 320 }}
              />
            </div>
          </div>

          {/* ── Core Values ── */}
          <div className="mb-6">
            <p className="text-caption text-[#1160CB] mb-2">What drives us</p>
            <h2
              className="text-[#0C0D10] font-bold mb-6"
              style={{ fontSize: "clamp(20px,3vw,28px)", letterSpacing: "-0.3px" }}
            >
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {values.map((v, i) => (
                <div key={i} className="bg-white p-7" style={cardStyle}>
                  <div
                    className="flex items-center justify-center mb-5"
                    style={{
                      width: 44, height: 44,
                      borderRadius: 10,
                      background: "rgba(17,96,203,0.08)",
                      color: "#1160CB",
                    }}
                  >
                    <v.icon size={20} />
                  </div>
                  <h3 className="text-[#0C0D10] font-semibold text-[16px] mb-2">{v.title}</h3>
                  <p className="text-[#0C0D10]/50 text-[14px] leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Innovation banner ── */}
          <div
            className="p-8 md:p-10 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            style={{ borderRadius: 12, background: "#0E121A" }}
          >
            <div className="space-y-2">
              <p className="text-caption text-white/40">Innovation First</p>
              <h3 className="text-white font-semibold text-[22px] leading-snug">
                Ready to upgrade your setup?
              </h3>
              <p className="text-white/50 text-[14px] max-w-md leading-relaxed">
                Explore our full catalogue of premium electronics and find the perfect tech for your lifestyle.
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Link to="/products">
                <Button className="bg-[#1160CB] hover:bg-[#479BF7] text-white rounded-[8px] h-11 px-7 text-[14px] font-semibold gap-2 transition-all">
                  Shop Now <ArrowRight size={15} />
                </Button>
              </Link>
              <Link to="/contact">
                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-[8px] h-11 px-7 text-[14px] font-semibold transition-all">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
