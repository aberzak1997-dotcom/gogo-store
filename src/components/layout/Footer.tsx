"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Smartphone, Mail, Phone, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Footer = () => {
  return (
    <footer className="bg-white border-t pt-20 pb-10">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-primary p-1.5 rounded-lg">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">ElectroStore</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your premier destination for high-end electronics and accessories. Quality tech, delivered to your door.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Mail size={16} className="text-primary" />
                <span>support@techstore.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <Phone size={16} className="text-primary" />
                <span>+1 555 123 4567</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Shop</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/products" className="hover:text-primary transition-colors">All Products</Link></li>
              <li><Link to="/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link></li>
              <li><Link to="/best-sellers" className="hover:text-primary transition-colors">Best Sellers</Link></li>
              <li><Link to="/deals" className="hover:text-primary transition-colors">Deals</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Customer Support</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/shipping" className="hover:text-primary transition-colors">Shipping & Delivery</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/warranty" className="hover:text-primary transition-colors">Warranty Policy</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li className="pt-4 border-t">
                <Link to="/admin/login" className="text-xs font-bold text-slate-400 hover:text-primary transition-colors">Admin Login</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-slate-500">© 2024 ElectroStore. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="text-xs text-slate-400 hover:text-slate-600">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-slate-400 hover:text-slate-600">Terms of Service</Link>
            <MadeWithDyad />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;