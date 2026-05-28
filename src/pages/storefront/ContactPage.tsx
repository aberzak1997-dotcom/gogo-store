"use client";

import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Clock, MapPin, Send, CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { showSuccess } from "../../utils/toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return;

    const existing = JSON.parse(localStorage.getItem("contact_messages") || "[]");
    existing.push({ ...formData, date: new Date().toISOString(), status: "unread" });
    localStorage.setItem("contact_messages", JSON.stringify(existing));

    showSuccess("Message sent! We'll get back to you within 24 hours.");
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const infoItems = [
    { icon: Mail,    title: "Email Us",        value: "support@wivitec.com",  desc: "We'll respond within 24 hours" },
    { icon: Phone,   title: "Call Us",         value: "Available via email",  desc: "Mon-Fri, 9am-6pm"              },
    { icon: Clock,   title: "Business Hours",  value: "9:00 AM – 6:00 PM",    desc: "Monday to Friday"              },
    { icon: MapPin,  title: "Location",        value: "Online Store",          desc: "Shipping worldwide"            },
  ];

  const cardStyle = {
    borderRadius: 12,
    border: "1px solid #F0F2F8",
    boxShadow: "0 2px 12px rgba(21,40,161,0.05)",
  };

  const inputStyle = {
    border: "1.5px solid #F0F2F8",
    borderRadius: 8,
    height: 44,
    fontSize: 14,
    background: "#fff",
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F2F8]">
      <Header />

      <main className="flex-grow py-10">
        <div className="section-container max-w-5xl mx-auto">

          {/* Page header */}
          <div className="mb-10">
            <p className="text-caption text-[#1160CB] mb-2">Support</p>
            <h1 className="text-[#0C0D10] font-bold" style={{ fontSize: "clamp(28px,4vw,40px)", letterSpacing: "-0.5px" }}>
              Contact Us
            </h1>
            <p className="text-[#0C0D10]/50 text-[15px] mt-2 max-w-xl">
              Have a question about a product or an order? Our tech experts are here to help you.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-6">

            {/* ── Left: info cards ── */}
            <div className="lg:col-span-5 space-y-4">
              {infoItems.map((item, i) => (
                <div key={i} className="bg-white flex items-start gap-4 p-5" style={cardStyle}>
                  <div
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: 40, height: 40,
                      borderRadius: 8,
                      background: "rgba(17,96,203,0.08)",
                      color: "#1160CB",
                    }}
                  >
                    <item.icon size={18} />
                  </div>
                  <div>
                    <p className="text-caption text-[#1160CB] mb-0.5">{item.title}</p>
                    <p className="text-[#0C0D10] font-medium text-[15px]">{item.value}</p>
                    <p className="text-[#0C0D10]/40 text-[12px] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}

              {/* Quick Support card */}
              <div
                className="p-6 text-white"
                style={{ borderRadius: 12, background: "#0E121A" }}
              >
                <p className="text-caption text-white/50 mb-1">Need quick answers?</p>
                <h4 className="text-white font-semibold text-[17px] mb-2">Check our FAQ</h4>
                <p className="text-white/50 text-[13px] mb-5 leading-relaxed">
                  Instant answers on shipping, returns, and warranty — no waiting required.
                </p>
                <Link to="/faq">
                  <Button
                    className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 rounded-[8px] h-10 text-[13px] font-semibold gap-2 transition-all"
                  >
                    View FAQ <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* ── Right: form ── */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8" style={cardStyle}>
                {isSubmitted ? (
                  <div className="py-16 text-center space-y-5">
                    <div
                      className="w-16 h-16 flex items-center justify-center mx-auto"
                      style={{ borderRadius: "50%", background: "rgba(5,177,105,0.1)", color: "#05b169" }}
                    >
                      <CheckCircle2 size={36} />
                    </div>
                    <h2 className="text-[#0C0D10] font-bold text-[24px]">Message Sent!</h2>
                    <p className="text-[#0C0D10]/50 text-[15px] max-w-sm mx-auto">
                      Thank you for reaching out. We'll get back to you as soon as possible.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-[#1160CB] hover:bg-[#1528A1] text-white rounded-[8px] h-11 px-8 text-[14px] font-semibold transition-all mt-2"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <label htmlFor="name" className="text-caption text-[#1160CB]">Full Name</label>
                        <Input
                          id="name"
                          placeholder="John Doe"
                          style={inputStyle}
                          className="focus-visible:ring-1 focus-visible:ring-[#1160CB] focus-visible:border-[#1160CB]"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="email" className="text-caption text-[#1160CB]">Email Address</label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          style={inputStyle}
                          className="focus-visible:ring-1 focus-visible:ring-[#1160CB] focus-visible:border-[#1160CB]"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="subject" className="text-caption text-[#1160CB]">Subject</label>
                      <Input
                        id="subject"
                        placeholder="How can we help?"
                        style={inputStyle}
                        className="focus-visible:ring-1 focus-visible:ring-[#1160CB] focus-visible:border-[#1160CB]"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="message" className="text-caption text-[#1160CB]">Message</label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        style={{
                          border: "1.5px solid #F0F2F8",
                          borderRadius: 8,
                          minHeight: 140,
                          fontSize: 14,
                          background: "#fff",
                        }}
                        className="focus-visible:ring-1 focus-visible:ring-[#1160CB] focus-visible:border-[#1160CB] resize-none"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#1160CB] hover:bg-[#1528A1] text-white rounded-[8px] h-12 text-[15px] font-semibold gap-2 transition-all duration-200 shadow-lg shadow-[#1160CB]/15 mt-1"
                    >
                      Send Message <Send size={16} />
                    </Button>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
