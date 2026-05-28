"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Sparkles,
  Globe,
  Share2,
  Settings2,
  CheckCircle2,
  AlertCircle,
  XCircle,
  RefreshCw,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Upload,
  ImageIcon,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

// ─── AI generation (smart template engine) ────────────────────────────────────
const generateSeoContent = async (field: string, context: Record<string, string>) => {
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 600)); // simulate latency

  const store = context.storeName || "WIVITEC";
  const desc  = context.storeDesc  || "Premium electronics and accessories delivered across Morocco";
  const kw    = context.keywords   || "electronics, tech, Morocco";

  if (field === "siteTitle") {
    return `${store} — Premium Electronics & Tech Accessories | Morocco`;
  }
  if (field === "metaDescription") {
    return `Shop the latest electronics at ${store}. ${desc}. Free shipping on orders over $50. 1-Year warranty on all products.`;
  }
  if (field === "keywords") {
    return `${store.toLowerCase()}, electronics Morocco, buy tech online, premium gadgets, laptops, headphones, gaming accessories, online store Morocco`;
  }
  if (field === "ogTitle") {
    return `${store} — Technology. Elevated.`;
  }
  if (field === "ogDescription") {
    return `Discover ${store}'s curated collection of premium electronics. ${desc}. Shop now and get fast delivery.`;
  }
  return "";
};

// ─── Score calculation ─────────────────────────────────────────────────────────
const calcScore = (s: ReturnType<typeof defaultSettings>) => {
  const checks = [
    !!s.siteTitle        && s.siteTitle.length        >= 30 && s.siteTitle.length        <= 60,
    !!s.metaDescription  && s.metaDescription.length  >= 120 && s.metaDescription.length <= 160,
    !!s.keywords         && s.keywords.split(",").length >= 4,
    !!s.ogTitle,
    !!s.ogDescription,
    !!s.ogImage,
    !!s.twitterHandle,
    s.indexing === "index",
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

const defaultSettings = () => ({
  siteTitle:       "",
  metaDescription: "",
  keywords:        "",
  storeName:       "WIVITEC",
  storeDesc:       "Premium electronics and accessories delivered across Morocco",
  ogTitle:         "",
  ogDescription:   "",
  ogImage:         "",
  twitterHandle:   "",
  indexing:        "index" as "index" | "noindex",
  canonicalUrl:    "https://wivitec.com",
  sitemapEnabled:  true,
});

const STORAGE_KEY = "wivitec_seo_settings";

const AdminSeoPage = () => {
  const [settings, setSettings] = useState(defaultSettings());
  const [generating, setGenerating] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState(false);
  const [openSection, setOpenSection] = useState<string>("basic");

  // Load persisted settings
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSettings({ ...defaultSettings(), ...JSON.parse(stored) });
    } catch {}
  }, []);

  const set = (key: string, value: string | boolean) =>
    setSettings((prev) => ({ ...prev, [key]: value }));

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    toast.success("SEO settings saved successfully");
    setTimeout(() => setSaved(false), 2000);
  };

  const generate = async (field: string) => {
    setGenerating((p) => ({ ...p, [field]: true }));
    try {
      const result = await generateSeoContent(field, {
        storeName: settings.storeName,
        storeDesc: settings.storeDesc,
        keywords:  settings.keywords,
      });
      set(field, result);
    } finally {
      setGenerating((p) => ({ ...p, [field]: false }));
    }
  };

  const generateAll = async () => {
    const fields = ["siteTitle", "metaDescription", "keywords", "ogTitle", "ogDescription"];
    for (const f of fields) await generate(f);
    toast.success("All SEO fields generated");
  };

  const score = calcScore(settings);
  const scoreColor = score >= 75 ? "#05b169" : score >= 45 ? "#ca8a04" : "#cf202f";

  const inputClass = "focus-visible:ring-1 focus-visible:ring-[#1160CB] focus-visible:border-[#1160CB]";
  const inputStyle = { border: "1.5px solid #F0F2F8", borderRadius: 8, fontSize: 14, background: "#fff" };
  const cardStyle  = { borderRadius: 12, border: "1px solid #F0F2F8", boxShadow: "0 2px 12px rgba(21,40,161,0.05)" };

  // ── Checklist items ────────────────────────────────────────────────────────
  const checks = [
    { label: "Site title (30–60 chars)", ok: !!settings.siteTitle && settings.siteTitle.length >= 30 && settings.siteTitle.length <= 60 },
    { label: "Meta description (120–160 chars)", ok: !!settings.metaDescription && settings.metaDescription.length >= 120 && settings.metaDescription.length <= 160 },
    { label: "At least 4 focus keywords", ok: !!settings.keywords && settings.keywords.split(",").length >= 4 },
    { label: "OG title set", ok: !!settings.ogTitle },
    { label: "OG description set", ok: !!settings.ogDescription },
    { label: "OG image URL set", ok: !!settings.ogImage },
    { label: "Pages set to indexable", ok: settings.indexing === "index" },
    { label: "Canonical URL defined", ok: !!settings.canonicalUrl },
  ];

  // ── Collapsible section helper ─────────────────────────────────────────────
  const Section = ({
    id, title, icon: Icon, children,
  }: { id: string; title: string; icon: React.ElementType; children: React.ReactNode }) => (
    <div className="bg-white" style={cardStyle}>
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left"
        onClick={() => setOpenSection(openSection === id ? "" : id)}
      >
        <div className="flex items-center gap-3">
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(17,96,203,0.08)", color: "#1160CB", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon size={15} />
          </div>
          <span className="text-[#0C0D10] font-semibold text-[15px]">{title}</span>
        </div>
        {openSection === id ? <ChevronUp size={16} className="text-[#0C0D10]/30" /> : <ChevronDown size={16} className="text-[#0C0D10]/30" />}
      </button>
      {openSection === id && (
        <div className="px-6 pb-6 pt-1 space-y-5 border-t border-[#F0F2F8]">
          {children}
        </div>
      )}
    </div>
  );

  // ── AI field row ────────────────────────────────────────────────────────────
  const AiField = ({
    label, field, type = "input", placeholder, hint,
  }: { label: string; field: string; type?: "input" | "textarea"; placeholder?: string; hint?: string }) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-caption text-[#1160CB]">{label}</label>
        <button
          type="button"
          onClick={() => generate(field)}
          disabled={generating[field]}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#1160CB] hover:text-[#1528A1] disabled:opacity-50 transition-colors"
        >
          {generating[field]
            ? <><RefreshCw size={11} className="animate-spin" /> Generating…</>
            : <><Sparkles size={11} /> AI Generate</>}
        </button>
      </div>
      {type === "textarea" ? (
        <Textarea
          placeholder={placeholder}
          value={(settings as any)[field] || ""}
          onChange={(e) => set(field, e.target.value)}
          className={`${inputClass} resize-none`}
          style={{ ...inputStyle, minHeight: 80 }}
        />
      ) : (
        <Input
          placeholder={placeholder}
          value={(settings as any)[field] || ""}
          onChange={(e) => set(field, e.target.value)}
          className={inputClass}
          style={{ ...inputStyle, height: 44 }}
        />
      )}
      {hint && (
        <p className="text-[11px] text-[#0C0D10]/35">
          {hint}
          {(settings as any)[field] ? ` · ${(settings as any)[field].length} chars` : ""}
        </p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-caption text-[#1160CB] mb-1">Growth</p>
          <h1 className="text-[#0C0D10] font-bold text-[26px] tracking-tight">Website SEO</h1>
          <p className="text-[#0C0D10]/40 text-[14px] mt-1">Optimise your store to rank higher on Google.</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={generateAll}
            disabled={Object.values(generating).some(Boolean)}
            className="bg-[#1528A1] hover:bg-[#1160CB] text-white rounded-[8px] h-10 px-5 text-[13px] font-semibold gap-2 transition-all"
          >
            <Sparkles size={14} />
            {Object.values(generating).some(Boolean) ? "Generating…" : "AI Generate All"}
          </Button>
          <Button
            onClick={handleSave}
            className="bg-[#1160CB] hover:bg-[#479BF7] text-white rounded-[8px] h-10 px-5 text-[13px] font-semibold gap-2 transition-all"
          >
            {saved ? <><CheckCircle2 size={14} /> Saved!</> : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* ── Left column: forms ── */}
        <div className="lg:col-span-2 space-y-4">

          {/* Basic SEO */}
          <Section id="basic" title="Basic SEO" icon={Search}>
            <div className="space-y-1.5">
              <label className="text-caption text-[#1160CB]">Store Name</label>
              <Input
                placeholder="WIVITEC"
                value={settings.storeName}
                onChange={(e) => set("storeName", e.target.value)}
                className={inputClass}
                style={{ ...inputStyle, height: 44 }}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-caption text-[#1160CB]">Store Description (used for AI context)</label>
              <Textarea
                placeholder="What does your store sell?"
                value={settings.storeDesc}
                onChange={(e) => set("storeDesc", e.target.value)}
                className={`${inputClass} resize-none`}
                style={{ ...inputStyle, minHeight: 72 }}
              />
            </div>
            <AiField
              label="Site Title"
              field="siteTitle"
              placeholder="WIVITEC — Premium Electronics | Morocco"
              hint="Recommended 30–60 chars"
            />
            <AiField
              label="Meta Description"
              field="metaDescription"
              type="textarea"
              placeholder="Shop the latest electronics at WIVITEC…"
              hint="Recommended 120–160 chars"
            />
            <AiField
              label="Focus Keywords"
              field="keywords"
              placeholder="electronics Morocco, laptops, headphones, gaming…"
              hint="Comma-separated"
            />
          </Section>

          {/* Social / OG */}
          <Section id="social" title="Social Sharing (Open Graph)" icon={Share2}>
            <p className="text-[13px] text-[#0C0D10]/45 -mt-1">
              Controls how your store looks when shared on Facebook, WhatsApp, LinkedIn, etc.
            </p>
            <AiField label="OG Title"       field="ogTitle"       placeholder="WIVITEC — Technology. Elevated." />
            <AiField label="OG Description" field="ogDescription" type="textarea" placeholder="Discover premium electronics at WIVITEC…" hint="Recommended 120–200 chars" />
            {/* OG Image Upload */}
            <div className="space-y-2">
              <label className="text-caption text-[#1160CB]">OG Image</label>

              {/* Preview */}
              {settings.ogImage ? (
                <div className="relative rounded-[8px] overflow-hidden border border-[#F0F2F8]" style={{ aspectRatio: "1200/630" }}>
                  <img
                    src={settings.ogImage}
                    alt="OG preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                  <div className="absolute top-2 right-2 flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(settings.ogImage).then(() => toast.success("URL copied"))}
                      className="flex items-center gap-1 text-[11px] font-semibold bg-black/60 text-white px-2.5 py-1.5 rounded-[6px] backdrop-blur-sm hover:bg-black/80 transition-colors"
                    >
                      <Copy size={11} /> Copy URL
                    </button>
                    <button
                      type="button"
                      onClick={() => set("ogImage", "")}
                      className="flex items-center gap-1 text-[11px] font-semibold bg-black/60 text-white px-2 py-1.5 rounded-[6px] backdrop-blur-sm hover:bg-red-500/80 transition-colors"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 text-[10px] font-medium bg-black/50 text-white px-2 py-1 rounded-[4px] backdrop-blur-sm">
                    1200 × 630 px recommended
                  </div>
                </div>
              ) : (
                /* Upload drop zone */
                <label
                  className="flex flex-col items-center justify-center gap-3 rounded-[8px] border-2 border-dashed cursor-pointer transition-colors hover:border-[#1160CB] hover:bg-[#1160CB]/03"
                  style={{ border: "2px dashed #E5E7EB", minHeight: 140, background: "#FAFAFA" }}
                >
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 2 * 1024 * 1024) { toast.error("Image must be under 2 MB"); return; }
                      const reader = new FileReader();
                      reader.onloadend = () => set("ogImage", reader.result as string);
                      reader.readAsDataURL(file);
                    }}
                  />
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(17,96,203,0.08)", color: "#1160CB", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Upload size={18} />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-semibold text-[#0C0D10]">Click to upload image</p>
                    <p className="text-[11px] text-[#0C0D10]/40 mt-0.5">PNG, JPG, WebP · Max 2 MB · 1200×630 px</p>
                  </div>
                </label>
              )}

              {/* Manual URL fallback */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex-1 h-px bg-[#F0F2F8]" />
                <span className="text-[10px] text-[#0C0D10]/30 font-medium">or paste URL</span>
                <div className="flex-1 h-px bg-[#F0F2F8]" />
              </div>
              <Input
                placeholder="https://yourdomain.com/og-image.jpg"
                value={settings.ogImage.startsWith("data:") ? "" : settings.ogImage}
                onChange={(e) => set("ogImage", e.target.value)}
                className={inputClass}
                style={{ ...inputStyle, height: 40 }}
              />
              <p className="text-[11px] text-[#0C0D10]/35">
                ⚠️ WhatsApp requires a public HTTPS JPG/PNG — data URLs won't show on social media.
              </p>
            </div>
            <div className="space-y-1.5">
              <label className="text-caption text-[#1160CB]">Twitter / X Handle</label>
              <Input
                placeholder="@wivitec"
                value={settings.twitterHandle}
                onChange={(e) => set("twitterHandle", e.target.value)}
                className={inputClass}
                style={{ ...inputStyle, height: 44 }}
              />
            </div>
          </Section>

          {/* Technical */}
          <Section id="technical" title="Technical SEO" icon={Settings2}>
            <div className="space-y-1.5">
              <label className="text-caption text-[#1160CB]">Canonical URL</label>
              <Input
                placeholder="https://wivitec.com"
                value={settings.canonicalUrl}
                onChange={(e) => set("canonicalUrl", e.target.value)}
                className={inputClass}
                style={{ ...inputStyle, height: 44 }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-caption text-[#1160CB]">Search Engine Indexing</label>
              <div className="flex gap-3">
                {(["index", "noindex"] as const).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => set("indexing", val)}
                    className="flex-1 py-2.5 rounded-[8px] text-[13px] font-semibold border transition-all"
                    style={{
                      border: settings.indexing === val ? "1.5px solid #1160CB" : "1.5px solid #F0F2F8",
                      background: settings.indexing === val ? "rgba(17,96,203,0.06)" : "#fff",
                      color: settings.indexing === val ? "#1160CB" : "#0C0D10",
                    }}
                  >
                    {val === "index" ? "✓ Allow indexing" : "✗ Block indexing"}
                  </button>
                ))}
              </div>
              {settings.indexing === "noindex" && (
                <p className="text-[12px] text-[#ca8a04] flex items-center gap-1.5">
                  <AlertCircle size={12} /> Your site will not appear in Google search results.
                </p>
              )}
            </div>
            <div className="flex items-center justify-between p-4 rounded-[8px]" style={{ background: "#F0F2F8" }}>
              <div>
                <p className="text-[#0C0D10] font-medium text-[14px]">XML Sitemap</p>
                <p className="text-[#0C0D10]/40 text-[12px]">Auto-generated at /sitemap.xml</p>
              </div>
              <button
                type="button"
                onClick={() => set("sitemapEnabled", !settings.sitemapEnabled)}
                className="relative w-11 h-6 rounded-full transition-colors"
                style={{ background: settings.sitemapEnabled ? "#1160CB" : "#E5E7EB" }}
              >
                <span
                  className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform"
                  style={{ transform: settings.sitemapEnabled ? "translateX(22px)" : "translateX(2px)" }}
                />
              </button>
            </div>
          </Section>
        </div>

        {/* ── Right column: score + preview + checklist ── */}
        <div className="space-y-4">

          {/* Score card */}
          <div className="bg-white p-6 text-center" style={cardStyle}>
            <p className="text-caption text-[#1160CB] mb-4">SEO Health Score</p>
            <div className="relative w-28 h-28 mx-auto mb-4">
              <svg viewBox="0 0 36 36" className="w-28 h-28 -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F0F2F8" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="15.9"
                  fill="none"
                  stroke={scoreColor}
                  strokeWidth="3"
                  strokeDasharray={`${score} ${100 - score}`}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dasharray 0.6s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-bold text-[28px] text-[#0C0D10]">{score}</span>
                <span className="text-[10px] text-[#0C0D10]/40 font-medium uppercase tracking-widest">/ 100</span>
              </div>
            </div>
            <p className="text-[14px] font-semibold" style={{ color: scoreColor }}>
              {score >= 75 ? "Great" : score >= 45 ? "Needs Work" : "Poor"}
            </p>
            <p className="text-[#0C0D10]/40 text-[12px] mt-1">
              {checks.filter(c => !c.ok).length} item{checks.filter(c => !c.ok).length !== 1 ? "s" : ""} to fix
            </p>
          </div>

          {/* Google Preview */}
          <div className="bg-white p-5" style={cardStyle}>
            <p className="text-caption text-[#1160CB] mb-4">Google Preview</p>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-4 h-4 rounded-full bg-[#F0F2F8] flex items-center justify-center">
                  <Globe size={10} className="text-[#0C0D10]/40" />
                </div>
                <span className="text-[11px] text-[#0C0D10]/40 truncate">
                  {settings.canonicalUrl || "https://wivitec.com"}
                </span>
              </div>
              <p className="text-[#1a0dab] text-[16px] font-medium leading-tight line-clamp-1 hover:underline cursor-pointer">
                {settings.siteTitle || "WIVITEC — Premium Electronics | Morocco"}
              </p>
              <p className="text-[#4d5156] text-[13px] leading-relaxed line-clamp-3">
                {settings.metaDescription || "Your meta description will appear here. Add one to improve your click-through rate from Google search results."}
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div className="bg-white p-5" style={cardStyle}>
            <p className="text-caption text-[#1160CB] mb-4">SEO Checklist</p>
            <div className="space-y-2.5">
              {checks.map((c, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  {c.ok
                    ? <CheckCircle2 size={15} className="text-[#05b169] flex-shrink-0 mt-0.5" />
                    : <XCircle     size={15} className="text-[#0C0D10]/20 flex-shrink-0 mt-0.5" />}
                  <span className={`text-[12px] leading-snug ${c.ok ? "text-[#0C0D10]/70" : "text-[#0C0D10]/35"}`}>
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminSeoPage;
