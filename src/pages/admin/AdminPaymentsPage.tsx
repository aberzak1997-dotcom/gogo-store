"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CreditCard, Banknote, Smartphone, CheckCircle2, AlertTriangle,
  Eye, EyeOff, ExternalLink, Info, Shield, ChevronDown, ChevronUp, Truck
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentConfig {
  stripeEnabled: boolean;
  stripePublicKey: string;
  stripeSecretKey: string;
  paypalEnabled: boolean;
  paypalClientId: string;
  paypalSecret: string;
  codEnabled: boolean;
  bankEnabled: boolean;
  bankName: string;
  bankAccount: string;
  bankRouting: string;
  bankHolder: string;
}

const DEFAULT_CONFIG: PaymentConfig = JSON.parse(
  localStorage.getItem("payment_config") ||
  JSON.stringify({
    stripeEnabled: false, stripePublicKey: "", stripeSecretKey: "",
    paypalEnabled: false, paypalClientId: "", paypalSecret: "",
    codEnabled: true,
    bankEnabled: false, bankName: "", bankAccount: "", bankRouting: "", bankHolder: "",
  })
);

const AdminPaymentsPage = () => {
  const [config, setConfig] = useState<PaymentConfig>(DEFAULT_CONFIG);
  const [showStripeSecret, setShowStripeSecret] = useState(false);
  const [showPaypalSecret, setShowPaypalSecret] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("stripe");
  const [saved, setSaved] = useState(false);

  const set = (key: keyof PaymentConfig, value: string | boolean) =>
    setConfig(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    localStorage.setItem("payment_config", JSON.stringify(config));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggle = (section: string) =>
    setExpandedSection(expandedSection === section ? null : section);

  const isStripeConfigured = config.stripePublicKey.startsWith("pk_") && config.stripeSecretKey.startsWith("sk_");
  const isPaypalConfigured = config.paypalClientId.length > 10 && config.paypalSecret.length > 10;

  const methods = [
    {
      id: "stripe",
      name: "Stripe",
      desc: "Accept credit/debit cards, Apple Pay, Google Pay",
      icon: <CreditCard size={22} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      enabled: config.stripeEnabled,
      configured: isStripeConfigured,
      toggle: () => set("stripeEnabled", !config.stripeEnabled),
      recommended: true,
    },
    {
      id: "paypal",
      name: "PayPal",
      desc: "Accept PayPal, Venmo, and Pay Later",
      icon: <Smartphone size={22} />,
      color: "text-blue-600",
      bg: "bg-blue-50",
      enabled: config.paypalEnabled,
      configured: isPaypalConfigured,
      toggle: () => set("paypalEnabled", !config.paypalEnabled),
    },
    {
      id: "bank",
      name: "Bank Transfer",
      desc: "Customers pay directly to your bank account",
      icon: <Banknote size={22} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      enabled: config.bankEnabled,
      configured: config.bankName.length > 0,
      toggle: () => set("bankEnabled", !config.bankEnabled),
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      desc: "Customers pay when their order arrives",
      icon: <Truck size={22} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
      enabled: config.codEnabled,
      configured: true,
      toggle: () => set("codEnabled", !config.codEnabled),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Payments</h1>
          <p className="text-slate-500 mt-2 font-medium">Configure payment methods for your storefront checkout.</p>
        </div>
        <Button
          onClick={handleSave}
          className={cn("rounded-xl font-black uppercase tracking-widest text-[10px] h-12 px-8 transition-all", saved && "bg-emerald-500 hover:bg-emerald-600")}
        >
          {saved ? <><CheckCircle2 size={14} className="mr-2" /> Saved!</> : "Save Changes"}
        </Button>
      </div>

      <Alert className="rounded-2xl border-amber-200 bg-amber-50">
        <Info size={16} className="text-amber-600" />
        <AlertDescription className="text-amber-800 text-sm font-medium ml-2">
          <strong>Production note:</strong> Stripe and PayPal require a backend server to securely process payments and handle webhooks. Keys saved here are stored locally for configuration — wire them to your backend before going live.{" "}
          <a href="https://stripe.com/docs" target="_blank" rel="noopener noreferrer" className="underline font-black">Stripe docs →</a>
        </AlertDescription>
      </Alert>

      {/* Payment Method Cards */}
      <div className="space-y-4">
        {methods.map(method => (
          <Card key={method.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden">
            {/* Header row */}
            <div
              className="flex items-center gap-4 p-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
              onClick={() => toggle(method.id)}
            >
              <div className={`w-12 h-12 ${method.bg} ${method.color} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                {method.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-black text-slate-900">{method.name}</h3>
                  {method.recommended && (
                    <Badge className="bg-[#0096D6]/10 text-[#0096D6] border-transparent shadow-none text-[9px] font-black">Recommended</Badge>
                  )}
                  {method.enabled && method.configured && (
                    <Badge className="bg-emerald-50 text-emerald-600 border-transparent shadow-none text-[9px] font-black flex items-center gap-1">
                      <CheckCircle2 size={10} /> Live
                    </Badge>
                  )}
                  {method.enabled && !method.configured && (
                    <Badge className="bg-amber-50 text-amber-600 border-transparent shadow-none text-[9px] font-black flex items-center gap-1">
                      <AlertTriangle size={10} /> Needs config
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{method.desc}</p>
              </div>
              <div className="flex items-center gap-4">
                <Switch
                  checked={method.enabled}
                  onCheckedChange={method.toggle}
                  onClick={e => e.stopPropagation()}
                />
                {expandedSection === method.id
                  ? <ChevronUp size={16} className="text-slate-400" />
                  : <ChevronDown size={16} className="text-slate-400" />
                }
              </div>
            </div>

            {/* Expandable config */}
            {expandedSection === method.id && (
              <div className="px-6 pb-6 border-t border-slate-50">
                {method.id === "stripe" && (
                  <div className="pt-5 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield size={14} className="text-slate-400" />
                      <p className="text-[11px] text-slate-500 font-medium">Get your keys from the <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-black underline">Stripe Dashboard <ExternalLink size={10} className="inline" /></a></p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Publishable Key (pk_...)</Label>
                        <Input
                          value={config.stripePublicKey}
                          onChange={e => set("stripePublicKey", e.target.value)}
                          placeholder="pk_test_..."
                          className="rounded-xl h-12 font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secret Key (sk_...)</Label>
                        <div className="relative">
                          <Input
                            type={showStripeSecret ? "text" : "password"}
                            value={config.stripeSecretKey}
                            onChange={e => set("stripeSecretKey", e.target.value)}
                            placeholder="sk_test_..."
                            className="rounded-xl h-12 font-mono text-sm pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowStripeSecret(!showStripeSecret)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showStripeSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-indigo-50 rounded-xl text-xs text-indigo-700 font-medium leading-relaxed">
                      <strong>Integration steps:</strong> Install <code className="bg-indigo-100 px-1 rounded">@stripe/stripe-js</code> and <code className="bg-indigo-100 px-1 rounded">@stripe/react-stripe-js</code>, create a payment intent on your backend using the secret key, then render Stripe Elements in checkout using the publishable key.
                    </div>
                  </div>
                )}

                {method.id === "paypal" && (
                  <div className="pt-5 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Shield size={14} className="text-slate-400" />
                      <p className="text-[11px] text-slate-500 font-medium">Get credentials from <a href="https://developer.paypal.com/dashboard/" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-black underline">PayPal Developer <ExternalLink size={10} className="inline" /></a></p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Client ID</Label>
                        <Input
                          value={config.paypalClientId}
                          onChange={e => set("paypalClientId", e.target.value)}
                          placeholder="AaBbCc..."
                          className="rounded-xl h-12 font-mono text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Secret</Label>
                        <div className="relative">
                          <Input
                            type={showPaypalSecret ? "text" : "password"}
                            value={config.paypalSecret}
                            onChange={e => set("paypalSecret", e.target.value)}
                            placeholder="••••••••"
                            className="rounded-xl h-12 font-mono text-sm pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPaypalSecret(!showPaypalSecret)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          >
                            {showPaypalSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl text-xs text-blue-700 font-medium leading-relaxed">
                      <strong>Integration steps:</strong> Install <code className="bg-blue-100 px-1 rounded">@paypal/react-paypal-js</code>, wrap your app in <code className="bg-blue-100 px-1 rounded">PayPalScriptProvider</code> with your Client ID, then add a <code className="bg-blue-100 px-1 rounded">PayPalButtons</code> component to checkout.
                    </div>
                  </div>
                )}

                {method.id === "bank" && (
                  <div className="pt-5 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bank Name</Label>
                        <Input value={config.bankName} onChange={e => set("bankName", e.target.value)} placeholder="e.g. Chase Bank" className="rounded-xl h-12" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Holder</Label>
                        <Input value={config.bankHolder} onChange={e => set("bankHolder", e.target.value)} placeholder="Your business name" className="rounded-xl h-12" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Number</Label>
                        <Input value={config.bankAccount} onChange={e => set("bankAccount", e.target.value)} placeholder="••••••••••" className="rounded-xl h-12 font-mono" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Routing Number</Label>
                        <Input value={config.bankRouting} onChange={e => set("bankRouting", e.target.value)} placeholder="••••••••" className="rounded-xl h-12 font-mono" />
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl text-xs text-emerald-700 font-medium">
                      These details will be shown to customers on the order confirmation page so they can complete the transfer manually.
                    </div>
                  </div>
                )}

                {method.id === "cod" && (
                  <div className="pt-5">
                    <div className="p-4 bg-amber-50 rounded-xl text-xs text-amber-700 font-medium">
                      Cash on Delivery is enabled — customers will see this option at checkout and pay when their order arrives. No configuration needed.
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
        <CardHeader className="p-6 border-b border-slate-50">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Active Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-3">
            {methods.filter(m => m.enabled).map(m => (
              <div key={m.id} className={`flex items-center gap-2 px-4 py-2 rounded-full ${m.bg} ${m.color}`}>
                {m.icon}
                <span className="text-xs font-black">{m.name}</span>
                {m.configured ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} className="text-amber-500" />}
              </div>
            ))}
            {methods.filter(m => m.enabled).length === 0 && (
              <p className="text-slate-400 text-sm font-medium">No payment methods enabled yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPaymentsPage;
