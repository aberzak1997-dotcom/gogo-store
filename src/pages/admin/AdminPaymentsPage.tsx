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
  ExternalLink, Info, Shield, ChevronDown, ChevronUp, Truck,
  Link2, Unlink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { showSuccess, showError } from "../../utils/toast";
import { useStore } from "../../context/StoreContext";

interface PaymentConfig {
  stripeEnabled: boolean;
  stripePublishableKey: string;
  paypalEnabled: boolean;
  paypalClientId: string;
  codEnabled: boolean;
  bankEnabled: boolean;
  bankName: string;
  bankHolder: string;
  bankRib: string;
  bankIban: string;
  bankSwift: string;
  bankInstructions: string;
  bankQrUrl: string;
}

const DEFAULT_CONFIG: PaymentConfig = JSON.parse(
  localStorage.getItem("payment_config") ||
  JSON.stringify({
    stripeEnabled: false, stripePublishableKey: "",
    paypalEnabled: true, paypalClientId: "sb",
    codEnabled: true,
    bankEnabled: true,
    bankName: "CIH Bank", bankHolder: "WIVITEC S.A.R.L", bankRib: "230 810 0012345678901234 45", bankIban: "MA64 2308 1000 1234 5678 9012 3445",
    bankSwift: "CIHCMAMC", bankInstructions: "Please transfer the exact order total. Use your Order # as the reference. Send proof of payment to support@wivitec.com", bankQrUrl: "",
  })
);

const AdminPaymentsPage = () => {
  const { settings, updateSettings } = useStore();
  const [config, setConfig] = useState<PaymentConfig>(DEFAULT_CONFIG);
  const [stripeInput, setStripeInput] = useState(config.stripePublishableKey || "");
  const [stripeConnected, setStripeConnected] = useState(
    Boolean(config.stripeEnabled && config.stripePublishableKey?.startsWith("pk_"))
  );
  const [expandedSection, setExpandedSection] = useState<string | null>("paypal");
  const [saved, setSaved] = useState(false);
  const [paypalConnected, setPaypalConnected] = useState(
    Boolean(localStorage.getItem("paypal_client_id") && localStorage.getItem("paypal_client_id")!.length > 10) || config.paypalClientId === "sb"
  );
  const [paypalInput, setPaypalInput] = useState(
    localStorage.getItem("paypal_client_id") || config.paypalClientId || ""
  );

  const set = (key: keyof PaymentConfig, value: string | boolean) =>
    setConfig(prev => ({ ...prev, [key]: value }));

  const handleSave = () => {
    localStorage.setItem("payment_config", JSON.stringify(config));
    // Sync to Supabase so all customer devices get the updated config
    updateSettings({ ...settings, paymentConfig: config }, true);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggle = (section: string) =>
    setExpandedSection(expandedSection === section ? null : section);

  const handleConnectPayPal = () => {
    if (!paypalInput || paypalInput.trim().length < 2) {
      showError("Please enter a valid PayPal Client ID.");
      return;
    }
    const clientId = paypalInput.trim();
    localStorage.setItem("paypal_client_id", clientId);
    window.dispatchEvent(new CustomEvent("paypal-config-updated", { detail: clientId }));
    set("paypalClientId", clientId);
    set("paypalEnabled", true);
    setPaypalConnected(true);
    const updated = { ...config, paypalClientId: clientId, paypalEnabled: true };
    localStorage.setItem("payment_config", JSON.stringify(updated));
    updateSettings({ ...settings, paymentConfig: updated }, true);
    showSuccess("PayPal connected! Customers can now pay with PayPal at checkout.");
  };

  const handleDisconnectPayPal = () => {
    localStorage.removeItem("paypal_client_id");
    window.dispatchEvent(new CustomEvent("paypal-config-updated", { detail: "" }));
    set("paypalClientId", "");
    set("paypalEnabled", false);
    setPaypalConnected(false);
    setPaypalInput("");
    const updated = { ...config, paypalClientId: "", paypalEnabled: false };
    localStorage.setItem("payment_config", JSON.stringify(updated));
    updateSettings({ ...settings, paymentConfig: updated }, true);
    showSuccess("PayPal disconnected.");
  };

  const handleConnectStripe = () => {
    if (!stripeInput.trim().startsWith("pk_")) {
      showError("Please enter a valid Stripe Publishable Key (starts with pk_live_ or pk_test_).");
      return;
    }
    const pk = stripeInput.trim();
    set("stripePublishableKey", pk);
    set("stripeEnabled", true);
    setStripeConnected(true);
    const updated = { ...config, stripePublishableKey: pk, stripeEnabled: true };
    localStorage.setItem("payment_config", JSON.stringify(updated));
    updateSettings({ ...settings, paymentConfig: updated }, true);
    showSuccess("Stripe connected! Customers can now pay by card at checkout.");
  };

  const handleDisconnectStripe = () => {
    set("stripePublishableKey", "");
    set("stripeEnabled", false);
    setStripeConnected(false);
    setStripeInput("");
    const updated = { ...config, stripePublishableKey: "", stripeEnabled: false };
    localStorage.setItem("payment_config", JSON.stringify(updated));
    updateSettings({ ...settings, paymentConfig: updated }, true);
    showSuccess("Stripe disconnected.");
  };

  const isStripeConfigured = stripeConnected && Boolean(config.stripePublishableKey?.startsWith("pk_"));

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
      toggle: stripeConnected ? () => set("stripeEnabled", !config.stripeEnabled) : () => {},
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
      configured: paypalConnected,
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
                    <Badge className="bg-[#0033CC]/10 text-[#0033CC] border-transparent shadow-none text-[9px] font-black">Recommended</Badge>
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

                {/* ── Stripe ── */}
                {method.id === "stripe" && (
                  <div className="pt-5 space-y-4">
                    {stripeConnected ? (
                      /* ✅ CONNECTED */
                      <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={22} className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="font-black text-indigo-900 text-sm">Stripe Connected</p>
                            <p className="text-[11px] text-indigo-700 font-mono mt-0.5">
                              {stripeInput.slice(0, 12)}••••••••{stripeInput.slice(-6)}
                            </p>
                            <p className="text-[10px] text-indigo-600 font-medium mt-1">
                              Customers can pay by card at checkout
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDisconnectStripe}
                          className="border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 flex-shrink-0"
                        >
                          <Unlink size={13} /> Disconnect
                        </Button>
                      </div>
                    ) : (
                      /* 🔌 NOT CONNECTED */
                      <div className="space-y-4">
                        {/* Step 1 — Publishable key */}
                        <Alert className="rounded-xl border-indigo-100 bg-indigo-50">
                          <Info size={14} className="text-indigo-600" />
                          <AlertDescription className="text-indigo-800 text-xs font-medium ml-1">
                            <strong className="font-black">Step 1 — Publishable Key:</strong>{" "}
                            Go to{" "}
                            <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noopener noreferrer" className="underline font-black text-indigo-700">
                              Stripe Dashboard → API Keys <ExternalLink size={9} className="inline" />
                            </a>{" "}
                            and copy your <strong>Publishable key</strong> (starts with <code className="bg-indigo-100 px-1 rounded">pk_live_</code> or <code className="bg-indigo-100 px-1 rounded">pk_test_</code>).
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Publishable Key (pk_live_… or pk_test_…)
                          </Label>
                          <div className="flex gap-3">
                            <Input
                              value={stripeInput}
                              onChange={e => setStripeInput(e.target.value)}
                              placeholder="pk_live_..."
                              className="rounded-xl h-12 font-mono text-sm flex-1"
                              onKeyDown={e => e.key === "Enter" && handleConnectStripe()}
                            />
                            <Button
                              onClick={handleConnectStripe}
                              className="h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 whitespace-nowrap bg-indigo-600 hover:bg-indigo-700"
                            >
                              <Link2 size={14} /> Connect Stripe
                            </Button>
                          </div>
                        </div>

                        {/* Step 2 — Secret key in Supabase */}
                        <div className="p-4 rounded-xl space-y-3" style={{ background: "#1e1b4b0d", border: "1px solid #c7d2fe" }}>
                          <div className="flex items-center gap-2">
                            <Shield size={13} className="text-indigo-600 flex-shrink-0" />
                            <p className="text-[11px] font-black text-indigo-800 uppercase tracking-wider">Step 2 — Secret Key (server-side only)</p>
                          </div>
                          <p className="text-[11px] text-indigo-700 font-medium leading-relaxed">
                            For security your Secret Key (<code className="bg-indigo-100 px-1 rounded">sk_live_…</code>) must <strong>never</strong> go in browser code.
                            Add it as a Supabase project secret so only the Edge Function can read it:
                          </p>
                          <ol className="text-[11px] text-indigo-700 font-medium space-y-1 list-decimal ml-4">
                            <li>Open <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="underline font-black">supabase.com/dashboard <ExternalLink size={9} className="inline" /></a></li>
                            <li>Go to <strong>Edge Functions → Manage Secrets</strong></li>
                            <li>Add a secret named <code className="bg-indigo-100 px-1 rounded font-mono">STRIPE_SECRET_KEY</code></li>
                            <li>Paste your <code className="bg-indigo-100 px-1 rounded font-mono">sk_live_…</code> value and save</li>
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── PayPal ── */}
                {method.id === "paypal" && (
                  <div className="pt-5 space-y-4">
                    {paypalConnected ? (
                      /* ✅ CONNECTED */
                      <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <CheckCircle2 size={22} className="text-emerald-600" />
                          </div>
                          <div>
                            <p className="font-black text-emerald-900 text-sm">PayPal Connected</p>
                            <p className="text-[11px] text-emerald-700 font-mono mt-0.5">
                              {paypalInput.slice(0, 10)}••••••••{paypalInput.slice(-6)}
                            </p>
                            <p className="text-[10px] text-emerald-600 font-medium mt-1">
                              Customers can pay with PayPal at checkout
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDisconnectPayPal}
                          className="border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 flex-shrink-0"
                        >
                          <Unlink size={13} /> Disconnect
                        </Button>
                      </div>
                    ) : (
                      /* 🔌 NOT CONNECTED */
                      <div className="space-y-4">
                        <Alert className="rounded-xl border-blue-100 bg-blue-50">
                          <Info size={14} className="text-blue-600" />
                          <AlertDescription className="text-blue-800 text-xs font-medium ml-1">
                            <strong className="font-black">How to get your Client ID:</strong>{" "}
                            Go to{" "}
                            <a
                              href="https://developer.paypal.com/dashboard/applications/live"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline font-black text-blue-700"
                            >
                              PayPal Developer Dashboard <ExternalLink size={9} className="inline" />
                            </a>
                            {" "}→ Apps & Credentials → <strong>Live</strong> tab → Create App → copy the <strong>Client ID</strong>.
                          </AlertDescription>
                        </Alert>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            PayPal Client ID
                          </Label>
                          <div className="flex gap-3">
                            <Input
                              value={paypalInput}
                              onChange={e => setPaypalInput(e.target.value)}
                              placeholder="AaBbCcDdEeFfGg..."
                              className="rounded-xl h-12 font-mono text-sm flex-1"
                              onKeyDown={e => e.key === "Enter" && handleConnectPayPal()}
                            />
                            <Button
                              onClick={handleConnectPayPal}
                              className="h-12 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 whitespace-nowrap"
                            >
                              <Link2 size={14} /> Connect PayPal
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Bank Transfer ── */}
                {method.id === "bank" && (
                  <div className="pt-5 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bank Name</Label>
                        <Input value={config.bankName} onChange={e => set("bankName", e.target.value)} placeholder="e.g. CIH Bank, Attijariwafa, BMCE…" className="rounded-xl h-12" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Account Holder (Full Name)</Label>
                        <Input value={config.bankHolder} onChange={e => set("bankHolder", e.target.value)} placeholder="Your full legal name" className="rounded-xl h-12" />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">RIB (Relevé d'Identité Bancaire)</Label>
                        <Input value={config.bankRib} onChange={e => set("bankRib", e.target.value)} placeholder="e.g. 230 810 0012345678901234 45" className="rounded-xl h-12 font-mono" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">IBAN (optional)</Label>
                        <Input value={config.bankIban} onChange={e => set("bankIban", e.target.value)} placeholder="MA64 XXXX XXXX XXXX XXXX XXXX XXXX" className="rounded-xl h-12 font-mono" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">SWIFT / BIC (optional)</Label>
                        <Input value={config.bankSwift} onChange={e => set("bankSwift", e.target.value)} placeholder="e.g. CIHCMAMC" className="rounded-xl h-12 font-mono" />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Transfer Instructions (shown to customer)</Label>
                        <textarea
                          value={config.bankInstructions}
                          onChange={e => set("bankInstructions", e.target.value)}
                          placeholder="e.g. Transfer the exact order total. Use your Order # as the reference. Send proof of payment to support@wivitec.com"
                          rows={3}
                          className="w-full border border-input rounded-xl px-3 py-2.5 text-sm resize-none outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div className="space-y-1.5 md:col-span-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">QR Code Image URL (optional — for mobile banking scan)</Label>
                        <Input value={config.bankQrUrl} onChange={e => set("bankQrUrl", e.target.value)} placeholder="https://… (paste your bank's payment QR code image URL)" className="rounded-xl h-12" />
                        <p className="text-[10px] text-slate-400 font-medium mt-1">Upload your bank QR code image somewhere (e.g. Imgur, your CJ account, Google Drive) and paste the direct image URL here.</p>
                        {config.bankQrUrl && (
                          <div className="mt-2 inline-block p-3 bg-white border border-slate-200 rounded-xl">
                            <img src={config.bankQrUrl} alt="Bank QR" className="w-32 h-32 object-contain" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl text-xs text-emerald-700 font-medium">
                      ✓ All bank details are shown instantly to the customer as soon as they select "Bank Transfer" at checkout — including a scannable QR code if provided.
                    </div>
                  </div>
                )}

                {/* ── COD ── */}
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