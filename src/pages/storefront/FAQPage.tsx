"use client";

import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { HelpCircle, ShoppingBag, Truck, RotateCcw, ShieldCheck, CreditCard } from "lucide-react";

const FAQPage = () => {
  const faqs = [
    {
      category: "Orders",
      icon: ShoppingBag,
      questions: [
        { q: "How do I track my order?", a: "Once your order ships, you'll receive an email with a tracking number and a link to track your package." },
        { q: "Can I change or cancel my order?", a: "Orders can be changed or cancelled within 2 hours of placement. Please contact support immediately." },
        { q: "Do you offer bulk discounts?", a: "Yes, for orders of 10+ units of the same item, please contact our sales team for a custom quote." }
      ]
    },
    {
      category: "Shipping",
      icon: Truck,
      questions: [
        { q: "What are your shipping rates?", a: "We offer free standard shipping on orders over $100. For orders under $100, a flat rate of $9.99 applies." },
        { q: "How long does delivery take?", a: "Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available at checkout." },
        { q: "Do you ship internationally?", a: "Currently, we ship to the US, Canada, and select European countries. Check checkout for availability." }
      ]
    },
    {
      category: "Returns & Warranty",
      icon: RotateCcw,
      questions: [
        { q: "What is your return policy?", a: "We offer a 30-day return window for all items in original packaging and condition." },
        { q: "How do I start a return?", a: "Visit our Returns page or contact support with your order number to receive a return label." },
        { q: "What does the warranty cover?", a: "Our standard 1-year warranty covers manufacturing defects. It does not cover accidental damage or wear and tear." }
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/30">
      <Header />
      
      <main className="flex-grow section-container py-12">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h1>
          <p className="text-slate-500 text-lg">
            Find quick answers to common questions about our products and services.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-12">
          {faqs.map((section, i) => (
            <div key={i} className="space-y-6">
              <div className="flex items-center gap-3 text-primary">
                <section.icon size={24} />
                <h2 className="text-2xl font-black text-slate-900">{section.category}</h2>
              </div>
              <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <Accordion type="single" collapsible className="w-full">
                  {section.questions.map((faq, j) => (
                    <AccordionItem key={j} value={`item-${i}-${j}`} className="border-b last:border-0 px-8">
                      <AccordionTrigger className="text-left font-bold text-slate-700 hover:text-primary py-6">
                        {faq.q}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-500 pb-6 leading-relaxed">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FAQPage;