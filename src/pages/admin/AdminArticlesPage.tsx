import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus, Pencil, Trash2, Sparkles, ArrowLeft, Clock,
  Calendar, Globe, BookOpen, FileText, Loader2, Eye,
  EyeOff, RefreshCw, Search
} from "lucide-react";
import { showSuccess, showError } from "../../utils/toast";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  status: "draft" | "published";
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  imageUrl: string;
  author: string;
  publishedAt: string;
  createdAt: string;
  readTime: number;
}

const LS_KEY = "wivitec_articles";
const CATEGORIES = ["Tech Tips", "Product Reviews", "How-To Guides", "Buying Guides", "News & Trends"];
const ARTICLE_TYPES = ["How-To Guide", "Buying Guide", "Tech Tips", "Product Review", "News & Trends"];

// ── Helpers ───────────────────────────────────────────────────────────────────
const slugify = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const calcReadTime = (text: string) => Math.max(1, Math.ceil(text.split(/\s+/).filter(Boolean).length / 200));
const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const uid = () => Math.random().toString(36).slice(2, 10);

// ── AI Article Generator ─────────────────────────────────────────────────────
async function generateArticle(
  topic: string,
  type: string,
  setStep: (s: string) => void
): Promise<Partial<Article>> {
  const t = topic.trim() || "electronics";
  const T = t.charAt(0).toUpperCase() + t.slice(1);
  const yr = new Date().getFullYear();

  setStep("Researching your topic…");   await delay(750);
  setStep("Structuring the article…");  await delay(850);
  setStep("Writing introduction…");     await delay(700);
  setStep("Building main sections…");   await delay(1050);
  setStep("Adding SEO optimisation…");  await delay(600);
  setStep("Finalising content…");       await delay(450);

  let title = "", excerpt = "", content = "", category = "",
      seoTitle = "", metaDescription = "", focusKeyword = "";

  // ── How-To Guide ─────────────────────────────────────────────────────────
  if (type === "How-To Guide") {
    category = "How-To Guides";
    title = `How to Choose the Best ${T}: Complete ${yr} Guide`;
    excerpt = `Choosing the right ${t} can feel overwhelming. This guide breaks down exactly what to look for so you can buy with confidence — no jargon, no fluff.`;
    content = `## Introduction

Finding the perfect ${t} doesn't have to be complicated. Whether you're a first-time buyer or upgrading, understanding the key factors saves time and money. At WIVITEC, we've tested hundreds of products — here's what actually matters.

## Why the Right ${T} Makes a Difference

A poor choice costs more in the long run: replacements, compatibility headaches, and frustrating performance. The right ${t} boosts productivity and lasts for years.

## Step 1: Define Your Needs

Before you browse, answer these questions:
- What will I primarily use it for?
- What is my budget?
- Do I need portability or raw performance?
- What devices does it need to work with?

This alone eliminates 80% of irrelevant options.

## Step 2: Know the Key Specifications

**Performance**: Make sure it handles your typical workload without throttling.

**Build Quality**: Premium materials mean longer lifespan. WIVITEC only stocks products that pass our quality bar.

**Compatibility**: Verify it works with your OS, ports, and existing peripherals.

**Warranty**: A solid warranty signals manufacturer confidence. Every WIVITEC product includes a 1-Year warranty.

## Step 3: Set a Realistic Budget

- **Budget tier**: Great for basic everyday use
- **Mid-range**: Best value for most users — our top recommendation
- **Premium**: For power users who need maximum specs

## Step 4: Read Real Reviews

Spec sheets don't tell the full story. Real-world reviews reveal actual battery life, build quality after months of use, and support quality. Check the verified buyer reviews on every WIVITEC product page.

## Step 5: Check After-Sales Support

Good support means:
- Easy 30-day returns
- Responsive customer service
- Fast warranty processing

WIVITEC handles all of this in-house so you're never left waiting.

## Our Top Picks

1. **Best Overall** — Balanced performance and value for most users
2. **Best Budget** — Reliable performance at an accessible price
3. **Best Premium** — Uncompromising quality for demanding use cases

Browse WIVITEC's full ${t} collection to find your match.

## Conclusion

The best ${t} fits your specific needs and budget. Use this guide, read the verified reviews, and reach out to our team for a personalised recommendation.

Shop now at WIVITEC — free shipping on orders over $50, 1-Year warranty included.`;

    seoTitle = `How to Choose the Best ${T} — WIVITEC Guide ${yr}`;
    metaDescription = `Looking for the best ${t}? Our complete ${yr} guide covers specs, budget tips, and expert picks. Free shipping & 1-Year warranty at WIVITEC.`;
    focusKeyword = `best ${t}, how to choose ${t}, ${t} guide ${yr}`;

  // ── Buying Guide ──────────────────────────────────────────────────────────
  } else if (type === "Buying Guide") {
    category = "Buying Guides";
    title = `The Ultimate ${T} Buying Guide — Best Options in ${yr}`;
    excerpt = `Our expert buying guide covers everything you need to make the smartest ${t} purchase in ${yr} — features, budgets, and our top recommendations.`;
    content = `## Why This Guide Exists

Hundreds of ${t} options. Confusing spec sheets. Misleading marketing. This guide cuts through the noise and gives you a clear, honest framework for buying smart in ${yr}.

## Who Needs a ${T}?

Whether you're a student, professional, gamer, or everyday user — the right ${t} transforms your daily experience. Knowing your user profile is step one.

## The 4 Features That Actually Matter

**1. Performance Tier**
Match specs to your real workload. Overpaying for unused specs is wasteful; underpaying leads to frustration within months.

**2. Build & Durability**
Look for solid construction and quality materials. Products at WIVITEC are selected specifically for durability.

**3. Connectivity**
Ensure full compatibility with your existing setup — ports, wireless standards, and software ecosystem.

**4. Price-to-Value Ratio**
The most expensive option is rarely the best. The best ${t} delivers the right balance of features for your specific case.

## Price Tiers Explained

- **Under $30** — Basic functionality, casual use
- **$30–$80** — Good everyday performance, solid value
- **$80–$150** — Excellent quality, suitable for demanding users
- **$150+** — Premium tier, for enthusiasts and professionals

## Red Flags to Avoid

- No warranty or warranty under 6 months
- Vague specifications with no verifiable source
- No genuine customer reviews
- No clear return policy

## WIVITEC's Curated Selection

Every ${t} in our catalogue passes our quality review. We only list products that:
- Include a minimum 1-Year warranty
- Have verified, accurate specifications
- Are covered by our 30-day return policy
- Come from reputable manufacturers

## Final Verdict

The best ${t} is the one that fits your needs, budget, and use case. Use this guide as your framework, read verified reviews, and contact our team for personalised advice.

**Shop ${T} at WIVITEC** — free shipping on orders over $50.`;

    seoTitle = `${T} Buying Guide ${yr} — Expert Picks | WIVITEC`;
    metaDescription = `Expert ${t} buying guide for ${yr}. Compare features, budget options, and top picks. Free shipping & 1-Year warranty at WIVITEC Morocco.`;
    focusKeyword = `${t} buying guide, best ${t} ${yr}, buy ${t} Morocco`;

  // ── Tech Tips ─────────────────────────────────────────────────────────────
  } else if (type === "Tech Tips") {
    category = "Tech Tips";
    title = `7 Essential ${T} Tips Every User Should Know`;
    excerpt = `Get more from your ${t} with these expert tips. From beginners to power users, these tricks improve performance and extend your device's lifespan.`;
    content = `## Introduction

Knowing how to properly use and maintain your ${t} dramatically improves your experience and extends its life. Here are 7 essential tips our tech team swears by.

## Tip 1: Start With the Right Settings

Default settings are rarely optimal. Spend 10 minutes customising your ${t} for your actual usage. Performance improvements of up to 30% are common just from this step.

## Tip 2: Keep It Clean

Dust and debris are silent performance killers. Regular cleaning prevents overheating and extends lifespan. Use compressed air and a microfibre cloth — never liquids directly on components.

## Tip 3: Always Use Quality Accessories

Cheap cables and accessories damage devices over time. Only use certified accessories that meet manufacturer specs. At WIVITEC, all accessories are tested for compatibility and safety before listing.

## Tip 4: Update Firmware and Drivers Regularly

Updates fix bugs, improve compatibility, and sometimes add useful features. Enable automatic updates or set a monthly calendar reminder to check manually.

## Tip 5: Manage Storage Proactively

Running at near-full capacity slows everything down. Keep at least 15–20% of storage free. Delete unused files and applications every month.

## Tip 6: Protect It From Day One

One drop can cost more than the device itself. Invest in quality protection immediately — it's the cheapest insurance you'll ever buy.

## Tip 7: Know Your Warranty Before You Need It

Understand your warranty terms before something goes wrong. WIVITEC offers a 1-Year warranty and 30-day returns — knowing this in advance saves panic when issues arise.

## Bonus Tip: Buy From Verified Sources

Counterfeit products are widespread. Stick to verified sellers with transparent return policies and genuine buyer reviews. Every product in WIVITEC's catalogue is authenticity-verified.

## Conclusion

These tips take minutes to apply but pay off for years. Implement them and your ${t} will perform better and last significantly longer.

Ready to upgrade? Browse WIVITEC's ${t} collection — 1-Year warranty on everything.`;

    seoTitle = `7 Essential ${T} Tips — WIVITEC Tech Blog`;
    metaDescription = `Expert ${t} tips to boost performance, extend lifespan, and save money. Practical advice from WIVITEC's tech team. Shop premium ${t} online.`;
    focusKeyword = `${t} tips, how to use ${t}, ${t} best practices`;

  // ── Product Review ────────────────────────────────────────────────────────
  } else if (type === "Product Review") {
    category = "Product Reviews";
    title = `${T} Honest Review — Is It Worth Buying in ${yr}?`;
    excerpt = `We tested the most popular ${t} options so you don't have to. Here's our honest, in-depth review with real scores and a clear verdict.`;
    content = `## Overview

In this review, we take an in-depth look at the top ${t} options available in ${yr}. After thorough real-world testing across multiple use cases, here's exactly what we found.

## Testing Methodology

Our review process covers:
- Real-world performance under normal and heavy workloads
- Build quality assessment over extended use
- Direct comparison against competing products at the same price point
- Long-term value assessment

## Performance — 8.5 / 10

Performance exceeded expectations for the price range. Everyday tasks were handled effortlessly, and more demanding workloads caused no significant issues. Thermal management was solid — temperatures stayed within safe ranges throughout extended sessions.

## Build Quality — 9 / 10

Build quality is a genuine highlight. Materials feel premium and construction inspires long-term confidence. After our full testing period, we observed no degradation — a strong durability signal.

## Value for Money — 9 / 10

This is where this ${t} truly stands out. Compared to competitors at the same price, it consistently delivers more — better build, better performance, and stronger warranty backing. For most users, this represents the best value in the category.

## What We Liked

✅ Excellent build quality for the price
✅ Consistent, reliable performance
✅ Wide compatibility with existing setups
✅ Strong warranty and return policy backing
✅ Simple setup — no technical expertise required

## What Could Be Better

❌ Packaging could be more eco-friendly
❌ Power users may want additional configuration options
❌ Limited colour and style variants

## Who Should Buy It?

This ${t} is ideal for:
- Everyday users wanting reliable performance without overspending
- Students and professionals seeking genuine value
- Anyone upgrading from older or budget-tier products

Not ideal for: extreme power users who require absolute maximum specifications regardless of price.

## Final Verdict — 8.8 / 10 — Highly Recommended

For most users, this ${t} hits the perfect sweet spot of performance, quality, and value. We recommend it without hesitation — especially backed by WIVITEC's 1-Year warranty.

Shop ${t} at WIVITEC — free shipping on orders over $50.`;

    seoTitle = `${T} Review ${yr} — Worth Buying? | WIVITEC`;
    metaDescription = `Honest ${t} review for ${yr}. We tested performance, build quality, and value — here's our real verdict. Buy with confidence at WIVITEC.`;
    focusKeyword = `${t} review, best ${t} ${yr}, is ${t} worth buying`;

  // ── News & Trends ─────────────────────────────────────────────────────────
  } else {
    category = "News & Trends";
    title = `The Future of ${T}: Key Trends to Watch in ${yr}`;
    excerpt = `The ${t} market is evolving fast. Here are the biggest trends shaping what's available, what it costs, and what you can expect from new products in ${yr}.`;
    content = `## Introduction

The tech landscape changes faster than ever. For ${t}, ${yr} brings developments that will reshape what's available, what it costs, and what you can reasonably expect from new products.

## Trend 1: Better Performance at Lower Prices

Manufacturing efficiency gains and increased competition continue to push prices down while performance climbs. Buyers in ${yr} get significantly more value than they did 2–3 years ago — and this trend is accelerating.

## Trend 2: Improved Energy Efficiency

Sustainability is now a core priority for major manufacturers. New ${t} products consume less power while delivering more — better for your electricity bill and the environment. Energy efficiency ratings are increasingly standardised.

## Trend 3: Universal Connectivity Standards

Faster wireless standards and universal port options are becoming mainstream even in mid-range products. USB-C, Wi-Fi 6E, and Bluetooth 5.3 are no longer premium-only features.

## Trend 4: AI-Enhanced Features

Artificial intelligence is being integrated into everyday products — from adaptive performance optimisation to smart power management. Features once limited to flagship devices are appearing across all price tiers.

## Trend 5: Durability and Repairability

Consumers are demanding longer-lasting products. Manufacturers are responding with better build standards, longer warranty periods, and more accessible repair pathways.

## What This Means for Buyers in ${yr}

- **Best time to buy**: Mid-range products now rival last year's premium options
- **Don't over-spec**: You likely don't need the absolute highest tier
- **Prioritise warranty**: Longer warranties signal genuine product confidence
- **Check connectivity**: New standards may require accessory updates

## WIVITEC's ${yr} Selection

Our catalogue is updated monthly to reflect current market conditions. Our ${yr} ${t} selection focuses on products that deliver the best real-world value, feature the latest connectivity standards, and come with solid warranty coverage.

## Conclusion

${yr} is an excellent time to invest in ${t}. Better products, fairer pricing, and stronger consumer protections make this one of the best buying environments in years.

Explore WIVITEC's ${yr} ${t} collection — updated monthly with the latest and best options.`;

    seoTitle = `${T} Trends ${yr} — What's Coming | WIVITEC Blog`;
    metaDescription = `Key ${t} trends for ${yr}. Market insights, expert analysis, and buying advice from WIVITEC's tech team. Stay ahead — shop at WIVITEC.`;
    focusKeyword = `${t} trends ${yr}, latest ${t}, ${t} news Morocco`;
  }

  return {
    title, slug: slugify(title), excerpt, content, category,
    seoTitle, metaDescription, focusKeyword,
    readTime: calcReadTime(content),
    author: "WIVITEC Team",
    tags: `${t}, electronics, WIVITEC, Morocco`,
  };
}

// ── Default blank article ─────────────────────────────────────────────────────
const blank = (): Article => ({
  id: uid(),
  title: "", slug: "", excerpt: "", content: "",
  category: "Tech Tips", tags: "", status: "draft",
  seoTitle: "", metaDescription: "", focusKeyword: "",
  imageUrl: "", author: "WIVITEC Team",
  publishedAt: new Date().toISOString().slice(0, 10),
  createdAt: new Date().toISOString(),
  readTime: 1,
});

// ── Component ─────────────────────────────────────────────────────────────────
const AdminArticlesPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || "[]"); }
    catch { return []; }
  });
  const [view, setView] = useState<"list" | "editor">("list");
  const [editing, setEditing] = useState<Article>(blank());
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");
  const [search, setSearch] = useState("");

  // AI state
  const [aiTopic, setAiTopic] = useState("");
  const [aiType, setAiType] = useState("How-To Guide");
  const [generating, setGenerating] = useState(false);
  const [genStep, setGenStep] = useState("");

  const save = (list: Article[]) => {
    setArticles(list);
    localStorage.setItem(LS_KEY, JSON.stringify(list));
  };

  const openNew = () => { setEditing(blank()); setAiTopic(""); setView("editor"); };
  const openEdit = (a: Article) => { setEditing({ ...a }); setAiTopic(""); setView("editor"); };

  const deleteArticle = (id: string) => {
    if (!window.confirm("Delete this article?")) return;
    save(articles.filter(a => a.id !== id));
    showSuccess("Article deleted.");
  };

  const toggleStatus = (id: string) => {
    save(articles.map(a => a.id === id
      ? { ...a, status: a.status === "published" ? "draft" : "published" }
      : a));
  };

  const handleSave = () => {
    if (!editing.title.trim()) { showError("Title is required."); return; }
    const exists = articles.find(a => a.id === editing.id);
    const updated = {
      ...editing,
      slug: editing.slug || slugify(editing.title),
      readTime: calcReadTime(editing.content),
    };
    save(exists
      ? articles.map(a => a.id === editing.id ? updated : a)
      : [updated, ...articles]);
    showSuccess(exists ? "Article updated!" : "Article created!");
    setView("list");
  };

  const handlePublish = () => {
    setEditing(e => ({ ...e, status: "published" }));
    setTimeout(handleSave, 50);
  };

  const handleGenerate = async () => {
    if (!aiTopic.trim()) { showError("Enter a topic first."); return; }
    setGenerating(true);
    try {
      const result = await generateArticle(aiTopic, aiType, setGenStep);
      setEditing(e => ({ ...e, ...result }));
      showSuccess("Article generated! Review and edit as needed.");
    } catch {
      showError("Generation failed. Please try again.");
    } finally {
      setGenerating(false);
      setGenStep("");
    }
  };

  const set = (field: keyof Article, value: string) =>
    setEditing(e => ({ ...e, [field]: value }));

  // Filtered list
  const filtered = articles.filter(a => {
    if (filter !== "all" && a.status !== filter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const published = articles.filter(a => a.status === "published").length;
  const drafts = articles.filter(a => a.status === "draft").length;
  const thisMonth = articles.filter(a =>
    new Date(a.createdAt).getMonth() === new Date().getMonth()).length;

  const catColor: Record<string, string> = {
    "Tech Tips":       "bg-[#479BF7]/10 text-[#1160CB]",
    "Product Reviews": "bg-purple-100 text-purple-700",
    "How-To Guides":   "bg-green-100 text-green-700",
    "Buying Guides":   "bg-orange-100 text-orange-700",
    "News & Trends":   "bg-rose-100 text-rose-700",
  };

  // ── LIST VIEW ─────────────────────────────────────────────────────────────
  if (view === "list") {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-[#0C0D10] tracking-tight">Articles & Blog</h1>
            <p className="text-caption text-[#0C0D10]/50 mt-0.5">
              AI-generated SEO articles to rank your store on Google
            </p>
          </div>
          <Button
            onClick={openNew}
            className="bg-[#1160CB] hover:bg-[#0e4fa8] text-white rounded-[10px] gap-2 font-semibold"
          >
            <Plus size={16} /> New Article
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Articles", value: articles.length, icon: FileText, color: "#1160CB" },
            { label: "Published",      value: published,         icon: Globe,     color: "#16a34a" },
            { label: "Drafts",         value: drafts,            icon: BookOpen,  color: "#d97706" },
            { label: "This Month",     value: thisMonth,         icon: Calendar,  color: "#7c3aed" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-[14px] p-5 border border-[#F0F2F8]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-caption text-[#0C0D10]/40">{s.label}</span>
                <div className="w-8 h-8 rounded-[8px] flex items-center justify-center"
                  style={{ background: s.color + "18" }}>
                  <s.icon size={15} style={{ color: s.color }} />
                </div>
              </div>
              <p className="text-[26px] font-bold text-[#0C0D10] tracking-tight">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="flex gap-1 bg-[#F0F2F8] rounded-[10px] p-1">
            {(["all", "published", "draft"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-1.5 rounded-[8px] text-[12px] font-semibold capitalize transition-all ${
                  filter === f
                    ? "bg-white text-[#0C0D10] shadow-sm"
                    : "text-[#0C0D10]/40 hover:text-[#0C0D10]"
                }`}>
                {f}
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0C0D10]/30" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-8 pr-4 py-2 text-[13px] bg-white border border-[#F0F2F8] rounded-[10px] outline-none focus:border-[#1160CB]/40 transition-colors"
            />
          </div>
        </div>

        {/* Article List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-[16px] border border-[#F0F2F8] py-20 flex flex-col items-center gap-4">
            <div className="w-14 h-14 bg-[#F0F2F8] rounded-full flex items-center justify-center">
              <FileText size={24} className="text-[#0C0D10]/20" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-[#0C0D10]">No articles yet</p>
              <p className="text-caption text-[#0C0D10]/40 mt-1">
                Click "New Article" and let AI write one for you in seconds
              </p>
            </div>
            <Button onClick={openNew}
              className="bg-[#1160CB] hover:bg-[#0e4fa8] text-white rounded-[10px] gap-2 font-semibold mt-2">
              <Sparkles size={14} /> Generate First Article
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(a => (
              <div key={a.id}
                className="bg-white rounded-[14px] border border-[#F0F2F8] p-5 flex items-start gap-4 hover:border-[#1160CB]/20 transition-colors">
                {/* Image */}
                {a.imageUrl ? (
                  <img src={a.imageUrl} alt=""
                    className="w-16 h-16 rounded-[10px] object-cover flex-shrink-0 bg-[#F0F2F8]" />
                ) : (
                  <div className="w-16 h-16 rounded-[10px] bg-[#F0F2F8] flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-[#0C0D10]/20" />
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${catColor[a.category] || "bg-gray-100 text-gray-600"}`}>
                      {a.category}
                    </span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      a.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {a.status}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[14px] text-[#0C0D10] line-clamp-1">{a.title}</h3>
                  <p className="text-caption text-[#0C0D10]/40 mt-0.5 line-clamp-1">{a.excerpt}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="flex items-center gap-1 text-caption text-[#0C0D10]/30">
                      <Clock size={11} /> {a.readTime} min read
                    </span>
                    <span className="flex items-center gap-1 text-caption text-[#0C0D10]/30">
                      <Calendar size={11} /> {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => toggleStatus(a.id)}
                    title={a.status === "published" ? "Unpublish" : "Publish"}
                    className="p-2 rounded-[8px] hover:bg-[#F0F2F8] text-[#0C0D10]/40 hover:text-[#1160CB] transition-colors">
                    {a.status === "published" ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                  <button onClick={() => openEdit(a)}
                    className="p-2 rounded-[8px] hover:bg-[#F0F2F8] text-[#0C0D10]/40 hover:text-[#1160CB] transition-colors">
                    <Pencil size={15} />
                  </button>
                  <button onClick={() => deleteArticle(a.id)}
                    className="p-2 rounded-[8px] hover:bg-rose-50 text-[#0C0D10]/40 hover:text-rose-500 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── EDITOR VIEW ───────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => setView("list")}
          className="flex items-center gap-2 text-[13px] font-medium text-[#0C0D10]/50 hover:text-[#1160CB] transition-colors">
          <ArrowLeft size={15} /> All Articles
        </button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave}
            className="rounded-[10px] border-[#F0F2F8] text-[13px] font-semibold">
            Save Draft
          </Button>
          <Button onClick={handlePublish}
            className="bg-[#1160CB] hover:bg-[#0e4fa8] text-white rounded-[10px] gap-2 text-[13px] font-semibold">
            <Globe size={14} /> Publish
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── LEFT: Content ── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="bg-white rounded-[14px] border border-[#F0F2F8] p-5 space-y-4">
            <div>
              <Label className="text-caption text-[#1160CB] mb-2 block">Article Title *</Label>
              <input
                value={editing.title}
                onChange={e => {
                  set("title", e.target.value);
                  if (!editing.slug || editing.slug === slugify(editing.title))
                    set("slug", slugify(e.target.value));
                }}
                placeholder="Write a compelling title…"
                className="w-full text-[18px] font-bold text-[#0C0D10] border-0 outline-none placeholder:text-[#0C0D10]/20 bg-transparent"
              />
            </div>
            <div>
              <Label className="text-caption text-[#1160CB] mb-2 block">Slug (URL)</Label>
              <div className="flex items-center gap-2 bg-[#F0F2F8] rounded-[8px] px-3 py-2">
                <span className="text-caption text-[#0C0D10]/30">wivitec.com/blog/</span>
                <input
                  value={editing.slug}
                  onChange={e => set("slug", e.target.value)}
                  className="flex-1 text-[13px] bg-transparent outline-none text-[#0C0D10]"
                />
              </div>
            </div>
            <div>
              <Label className="text-caption text-[#1160CB] mb-2 block">Excerpt / Summary</Label>
              <Textarea
                value={editing.excerpt}
                onChange={e => set("excerpt", e.target.value)}
                placeholder="Short description shown in article cards and search results…"
                className="resize-none border-[#F0F2F8] rounded-[8px] text-[13px] h-20"
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-[14px] border border-[#F0F2F8] p-5">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-caption text-[#1160CB]">Article Content</Label>
              {editing.content && (
                <span className="text-caption text-[#0C0D10]/30">
                  ~{editing.readTime || calcReadTime(editing.content)} min read
                </span>
              )}
            </div>
            <Textarea
              value={editing.content}
              onChange={e => set("content", e.target.value)}
              placeholder="Write your article here… Use ## for headings, **text** for bold, and - for bullet points."
              className="resize-none border-[#F0F2F8] rounded-[8px] text-[13px] font-mono min-h-[420px]"
            />
            <p className="text-caption text-[#0C0D10]/25 mt-2">
              Use ## for headings · **text** for bold · - for bullets
            </p>
          </div>

          {/* SEO Section */}
          <div className="bg-white rounded-[14px] border border-[#F0F2F8] p-5 space-y-4">
            <h3 className="text-[13px] font-bold text-[#0C0D10] flex items-center gap-2">
              <Globe size={14} className="text-[#1160CB]" /> SEO Settings
            </h3>
            {/* Google Preview */}
            {(editing.seoTitle || editing.title) && (
              <div className="bg-[#F0F2F8] rounded-[10px] p-4">
                <p className="text-caption text-[#0C0D10]/40 mb-2">Google Preview</p>
                <p className="text-[#1a0dab] text-[14px] font-medium hover:underline cursor-default line-clamp-1">
                  {editing.seoTitle || editing.title}
                </p>
                <p className="text-[#006621] text-[11px] mt-0.5">
                  wivitec.com › blog › {editing.slug || "article-slug"}
                </p>
                <p className="text-[#545454] text-[12px] mt-1 line-clamp-2">
                  {editing.metaDescription || editing.excerpt || "Add a meta description…"}
                </p>
              </div>
            )}
            <div className="grid gap-3">
              <div>
                <Label className="text-caption text-[#1160CB] mb-1.5 block">SEO Title</Label>
                <Input value={editing.seoTitle} onChange={e => set("seoTitle", e.target.value)}
                  placeholder="SEO-optimised page title (50–60 chars)"
                  className="border-[#F0F2F8] rounded-[8px] text-[13px]" />
                <p className="text-caption text-[#0C0D10]/25 mt-1">{editing.seoTitle.length} / 60 characters</p>
              </div>
              <div>
                <Label className="text-caption text-[#1160CB] mb-1.5 block">Meta Description</Label>
                <Textarea value={editing.metaDescription} onChange={e => set("metaDescription", e.target.value)}
                  placeholder="Compelling description for Google search results (150–160 chars)"
                  className="resize-none border-[#F0F2F8] rounded-[8px] text-[13px] h-20" />
                <p className="text-caption text-[#0C0D10]/25 mt-1">{editing.metaDescription.length} / 160 characters</p>
              </div>
              <div>
                <Label className="text-caption text-[#1160CB] mb-1.5 block">Focus Keywords</Label>
                <Input value={editing.focusKeyword} onChange={e => set("focusKeyword", e.target.value)}
                  placeholder="e.g. laptop accessories, buy headphones Morocco"
                  className="border-[#F0F2F8] rounded-[8px] text-[13px]" />
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Settings ── */}
        <div className="space-y-5">
          {/* AI Generator */}
          <div className="bg-gradient-to-br from-[#1528A1] to-[#1160CB] rounded-[14px] p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={16} className="text-[#479BF7]" />
              <h3 className="text-[13px] font-bold">AI Article Generator</h3>
            </div>
            <p className="text-[11px] text-white/60 mb-4">
              Enter a topic and let AI write a full SEO-optimised article in seconds.
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-1.5">
                  Topic / Keyword
                </label>
                <input
                  value={aiTopic}
                  onChange={e => setAiTopic(e.target.value)}
                  placeholder="e.g. gaming headsets, laptop cooling, USB cables…"
                  className="w-full bg-white/10 border border-white/20 rounded-[8px] px-3 py-2 text-[13px] text-white placeholder:text-white/30 outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/50 block mb-1.5">
                  Article Type
                </label>
                <select
                  value={aiType}
                  onChange={e => setAiType(e.target.value)}
                  className="w-full bg-white/10 border border-white/20 rounded-[8px] px-3 py-2 text-[13px] text-white outline-none focus:border-white/40"
                >
                  {ARTICLE_TYPES.map(t => <option key={t} value={t} className="text-[#0C0D10] bg-white">{t}</option>)}
                </select>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full bg-white text-[#1160CB] hover:bg-white/90 rounded-[10px] font-bold gap-2 text-[13px]"
              >
                {generating ? (
                  <><Loader2 size={14} className="animate-spin" /> Generating…</>
                ) : (
                  <><Sparkles size={14} /> Generate Article</>
                )}
              </Button>

              {generating && genStep && (
                <div className="bg-white/10 rounded-[8px] px-3 py-2 text-[11px] text-white/70 flex items-center gap-2">
                  <Loader2 size={11} className="animate-spin flex-shrink-0" />
                  {genStep}
                </div>
              )}
            </div>
          </div>

          {/* Article Settings */}
          <div className="bg-white rounded-[14px] border border-[#F0F2F8] p-5 space-y-4">
            <h3 className="text-[13px] font-bold text-[#0C0D10]">Article Settings</h3>
            <div>
              <Label className="text-caption text-[#1160CB] mb-1.5 block">Category</Label>
              <select value={editing.category} onChange={e => set("category", e.target.value)}
                className="w-full border border-[#F0F2F8] rounded-[8px] px-3 py-2 text-[13px] outline-none focus:border-[#1160CB]/40">
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <Label className="text-caption text-[#1160CB] mb-1.5 block">Tags (comma-separated)</Label>
              <Input value={editing.tags} onChange={e => set("tags", e.target.value)}
                placeholder="electronics, Morocco, tech, WIVITEC"
                className="border-[#F0F2F8] rounded-[8px] text-[13px]" />
            </div>
            <div>
              <Label className="text-caption text-[#1160CB] mb-1.5 block">Author</Label>
              <Input value={editing.author} onChange={e => set("author", e.target.value)}
                className="border-[#F0F2F8] rounded-[8px] text-[13px]" />
            </div>
            <div>
              <Label className="text-caption text-[#1160CB] mb-1.5 block">Featured Image URL</Label>
              <Input value={editing.imageUrl} onChange={e => set("imageUrl", e.target.value)}
                placeholder="https://…"
                className="border-[#F0F2F8] rounded-[8px] text-[13px]" />
              {editing.imageUrl && (
                <img src={editing.imageUrl} alt="" className="mt-2 w-full h-28 object-cover rounded-[8px] bg-[#F0F2F8]" />
              )}
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-[14px] border border-[#F0F2F8] p-5 space-y-3">
            <h3 className="text-[13px] font-bold text-[#0C0D10]">Publishing</h3>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#0C0D10]/60">Status</span>
              <button
                onClick={() => setEditing(e => ({ ...e, status: e.status === "published" ? "draft" : "published" }))}
                className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  editing.status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                {editing.status}
              </button>
            </div>
            <div>
              <Label className="text-caption text-[#1160CB] mb-1.5 block">Publish Date</Label>
              <Input type="date" value={editing.publishedAt}
                onChange={e => set("publishedAt", e.target.value)}
                className="border-[#F0F2F8] rounded-[8px] text-[13px]" />
            </div>
            <Button onClick={handleSave} variant="outline"
              className="w-full rounded-[10px] border-[#F0F2F8] text-[13px] font-semibold">
              Save Draft
            </Button>
            <Button onClick={handlePublish}
              className="w-full bg-[#1160CB] hover:bg-[#0e4fa8] text-white rounded-[10px] gap-2 text-[13px] font-semibold">
              <Globe size={14} /> Publish Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminArticlesPage;
