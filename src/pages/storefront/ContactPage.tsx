"use client";

import React, { useState } from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Clock, MapPin, Send, CheckCircle2 } from "lucide-react";
import { showSuccess } from "../../utils/toast";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) return;

    // Save to localStorage so admin can view messages
    const existing = JSON.parse(localStorage.getItem("contact_messages") || "[]");
    existing.push({ ...formData, date: new Date().toISOString(), status: "unread" });
    localStorage.setItem("contact_messages", JSON.stringify(existing));

    showSuccess("Message sent! We'll get back to you within 24 hours.");
    setIsSubmitted(true);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow section-container py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h1 className="text-5xl font-black text-slate-900 tracking-tight">Contact Us</h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Have a question about a product or an order? Our tech experts are here to help you.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-5 space-y-8">
              <div className="grid gap-6">
                {[
                  { icon: Mail, title: "Email Us", value: "support@electrostore.com", desc: "We'll respond within 24 hours" },
                  { icon: Phone, title: "Call Us", value: "Available via email", desc: "Mon-Fri, 9am-6pm" },
                  { icon: Clock, title: "Business Hours", value: "9:00 AM - 6:00 PM", desc: "Monday to Friday" },
                  { icon: MapPin, title: "Location", value: "Online Store", desc: "Shipping worldwide" },
                ].map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-none border border-slate-100 shadow-sm flex gap-4">
                    <div className="p-3 bg-primary/10 rounded-none text-primary h-fit">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{item.title}</h4>
                      <p className="text-primary font-black text-lg">{item.value}</p>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-slate-900 rounded-none text-white relative overflow-hidden">
                <h4 className="font-black text-xl mb-4">Quick Support</h4>
                <p className="text-slate-400 text-sm mb-6">
                  Check our FAQ for instant answers to common questions about shipping, returns, and warranty.
                </p>
                <Button variant="secondary" className="w-full rounded-xl font-bold">View FAQ</Button>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-10 rounded-none border border-slate-100 shadow-xl">
                {isSubmitted ? (
                  <div className="py-20 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500">
                      <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900">Message Sent!</h2>
                    <p className="text-slate-500">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                    <Button onClick={() => setIsSubmitted(false)} variant="outline" className="rounded-xl">Send Another Message</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="font-bold text-slate-700">Full Name</Label>
                        <Input 
                          id="name" 
                          placeholder="John Doe" 
                          className="h-12 rounded-none"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="font-bold text-slate-700">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="john@example.com" 
                          className="h-12 rounded-none"
                          value={formData.email}
                          onChange={e => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="font-bold text-slate-700">Subject</Label>
                      <Input 
                        id="subject" 
                        placeholder="How can we help?" 
                        className="h-12 rounded-none"
                        value={formData.subject}
                        onChange={e => setFormData({...formData, subject: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-bold text-slate-700">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Tell us more about your inquiry..." 
                        className="min-h-[150px] rounded-none"
                        value={formData.message}
                        onChange={e => setFormData({...formData, message: e.target.value})}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full h-14 rounded-none text-lg font-black gap-3 shadow-lg shadow-primary/20">
                      Send Message <Send size={20} />
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