"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Smartphone, Mail, Phone, Instagram, Twitter, Facebook, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { showSuccess } from "../../utils/toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      showSuccess("Thank you for subscribing!");
      setEmail("");
    }
  };

  return (
    <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          {/* Brand & Newsletter */}
          <div className="lg:col-span-2 space-y-8">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-slate-900 p-1.5 rounded-lg">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-slate-900 uppercase">ELECTROSTORE</span>
            </Link>
            <div className="space-y-4 max-w-sm">
              <h4 className="font-black text-sm uppercase tracking-widest text-slate-900">Stay in the loop</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Subscribe to receive exclusive offers, tech news, and early access to new arrivals.
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  type="email"
                  placeholder="Email address"
                  className="flex-grow h-12 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none focus:border-primary transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="submit" className="h-12 w-12 rounded-xl p-0">
                  <Send size={18} />
                </Button>
              </form>
            </div>
            <div className="flex items-center gap-4">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">Shop</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link to="/best-sellers" className="hover:text-primary transition-colors">Best Sellers</Link></li>
              <li><Link to="/deals" className="hover:text-primary transition-colors">Deals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">Support</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-primary transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/warranty" className="hover:text-primary transition-colors">Warranty Policy</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">Company</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li className="pt-4 border-t border-slate-50">
                <Link to="/admin/login" className="text-xs font-black text-slate-400 hover:text-primary transition-colors">ADMIN LOGIN</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>© 2024 ELECTROSTORE</span>
            <Link to="/privacy-policy" className="hover:text-slate-900">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-900">Terms</Link>
            <Link to="/faq" className="hover:text-slate-900">Cookies</Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <Phone size={14} /> +1 555 123 4567
            </div>
            <MadeWithDyad />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;