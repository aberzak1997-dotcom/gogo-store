"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Instagram, Twitter, Facebook, Youtube, Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { showSuccess, showError } from "../../utils/toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const existing = JSON.parse(localStorage.getItem("newsletter_subscribers") || "[]");
    if (existing.includes(email)) {
      showError("You're already subscribed!");
    } else {
      existing.push(email);
      localStorage.setItem("newsletter_subscribers", JSON.stringify(existing));
      showSuccess("Subscribed! Welcome to WIVITEC.");
    }
    setEmail("");
  };

  const shopLinks = [
    { label: "All Products", path: "/products" },
    { label: "New Arrivals", path: "/new-arrivals" },
    { label: "Best Sellers", path: "/best-sellers" },
    { label: "Deals", path: "/deals" },
  ];

  const supportLinks = [
    { label: "Contact Us", path: "/contact" },
    { label: "Track My Order", path: "/track-order" },
    { label: "Shipping & Delivery", path: "/shipping" },
    { label: "Returns & Refunds", path: "/returns" },
    { label: "Warranty Policy", path: "/warranty" },
    { label: "FAQ", path: "/faq" },
  ];

  const companyLinks = [
    { label: "About Us", path: "/about" },
    { label: "Careers", path: "/careers" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Service", path: "/terms" },
  ];

  return (
    <>
      {/* ── Pre-footer CTA Band ── */}
      <section className="bg-[#1528A1] py-16">
        <div className="section-container flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-h2 text-white mb-2">Ready to upgrade your setup?</h2>
            <p className="text-[15px] text-white/70 max-w-md">
              Morocco's premier destination for premium electronics. Fast delivery, 1-year warranty.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link to="/products">
              <Button className="bg-white text-[#1528A1] hover:bg-[#F0F2F8] rounded-[8px] px-7 h-12 text-[15px] font-semibold transition-all">
                Shop Now <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="ghost" className="border border-white/30 text-white hover:bg-white/10 rounded-[8px] px-7 h-12 text-[15px] font-semibold">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Main Footer ── */}
      <footer className="bg-[#0C0D10] border-t border-white/[0.06] pt-20 pb-10">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

            {/* Brand & newsletter */}
            <div className="lg:col-span-2 space-y-8">
              <Logo width={130} variant="dark" />

              <div className="space-y-4 max-w-sm">
                <p className="text-caption text-white/30">Stay in the loop</p>
                <p className="text-[15px] text-white/50 leading-relaxed">
                  Exclusive offers, tech news, and early access to new arrivals.
                </p>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-grow h-11 rounded-[8px] border border-white/10 bg-white/[0.04] px-4 text-[14px] text-white placeholder:text-white/30 outline-none focus:border-[#1160CB] transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <Button
                    type="submit"
                    className="h-11 w-11 rounded-[8px] p-0 bg-[#1160CB] hover:bg-[#479BF7] transition-colors flex-shrink-0"
                  >
                    <Send size={16} />
                  </Button>
                </form>
              </div>

              <div className="flex items-center gap-3">
                {[
                  { Icon: Instagram, href: "https://instagram.com/wivitec" },
                  { Icon: Twitter, href: "https://twitter.com/wivitec" },
                  { Icon: Facebook, href: "https://facebook.com/wivitec" },
                  { Icon: Youtube, href: "https://youtube.com/@wivitec" },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-[8px] bg-white/[0.06] border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-[#479BF7] hover:border-[#479BF7]/30 transition-all"
                  >
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-caption text-white mb-6">Shop</h4>
              <ul className="space-y-3">
                {shopLinks.map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="text-[14px] text-white/50 hover:text-[#479BF7] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-caption text-white mb-6">Support</h4>
              <ul className="space-y-3">
                {supportLinks.map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="text-[14px] text-white/50 hover:text-[#479BF7] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-caption text-white mb-6">Company</h4>
              <ul className="space-y-3">
                {companyLinks.map((l) => (
                  <li key={l.path}>
                    <Link to={l.path} className="text-[14px] text-white/50 hover:text-[#479BF7] transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6 text-[11px] text-white/30">
              <span>© 2025 WIVITEC. All rights reserved.</span>
              <Link to="/privacy-policy" className="hover:text-white/60 transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white/60 transition-colors">Terms</Link>
              <Link to="/faq" className="hover:text-white/60 transition-colors">Cookies</Link>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-white/30">
              <Mail size={13} />
              <a href="mailto:support@wivitec.com" className="hover:text-[#479BF7] transition-colors">
                support@wivitec.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
