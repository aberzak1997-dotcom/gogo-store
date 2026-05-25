"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Smartphone, Mail, Instagram, Twitter, Facebook, Youtube, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { showSuccess, showError } from "../../utils/toast";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const existing = JSON.parse(localStorage.getItem("newsletter_subscribers") || "[]");
    if (existing.includes(email)) {
      showError(t("footer.newsletter_exists"));
    } else {
      existing.push(email);
      localStorage.setItem("newsletter_subscribers", JSON.stringify(existing));
      showSuccess(t("footer.newsletter_success"));
    }
    setEmail("");
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
              <h4 className="font-black text-sm uppercase tracking-widest text-slate-900">{t("footer.newsletter_title")}</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                {t("footer.newsletter_desc")}
              </p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  placeholder={t("footer.newsletter_placeholder")}
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
              {[
                { Icon: Instagram, href: "https://instagram.com" },
                { Icon: Twitter, href: "https://twitter.com" },
                { Icon: Facebook, href: "https://facebook.com" },
                { Icon: Youtube, href: "https://youtube.com" },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">{t("footer.shop")}</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link to="/products" className="hover:text-primary transition-colors">{t("nav.products")}</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-primary transition-colors">{t("nav.new_arrivals")}</Link></li>
              <li><Link to="/best-sellers" className="hover:text-primary transition-colors">{t("nav.best_sellers")}</Link></li>
              <li><Link to="/deals" className="hover:text-primary transition-colors">{t("nav.deals")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">{t("footer.support")}</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link to="/contact" className="hover:text-primary transition-colors">{t("nav.contact")}</Link></li>
              <li><Link to="/track-order" className="hover:text-primary transition-colors">{t("nav.track_order")}</Link></li>
              <li><Link to="/shipping" className="hover:text-primary transition-colors">{t("footer.shipping")}</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-colors">{t("footer.returns")}</Link></li>
              <li><Link to="/warranty" className="hover:text-primary transition-colors">{t("footer.warranty")}</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">{t("footer.faq")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 mb-8">{t("footer.company")}</h4>
            <ul className="space-y-4 text-sm font-bold text-slate-500">
              <li><Link to="/about" className="hover:text-primary transition-colors">{t("footer.about")}</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">{t("footer.careers")}</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">{t("footer.privacy")}</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">{t("footer.terms")}</Link></li>
              <li className="pt-4 border-t border-slate-50">
                <Link to="/admin/login" className="text-xs font-black text-slate-400 hover:text-primary transition-colors">ADMIN LOGIN</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>© 2026 ELECTROSTORE. {t("footer.rights")}</span>
            <Link to="/privacy-policy" className="hover:text-slate-900">{t("footer.privacy")}</Link>
            <Link to="/terms" className="hover:text-slate-900">{t("footer.terms")}</Link>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <Mail size={14} /> support@electrostore.com
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
