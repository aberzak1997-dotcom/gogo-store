import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { Clock, Calendar, ArrowLeft, Tag, ChevronRight, BookOpen } from "lucide-react";

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
  imageUrl: string;
  author: string;
  publishedAt: string;
  createdAt: string;
  readTime: number;
}

const catColor: Record<string, string> = {
  "Tech Tips":       "bg-[#479BF7]/10 text-[#1160CB]",
  "Product Reviews": "bg-purple-100 text-purple-700",
  "How-To Guides":   "bg-green-100 text-green-700",
  "Buying Guides":   "bg-orange-100 text-orange-700",
  "News & Trends":   "bg-rose-100 text-rose-700",
};

const catImage: Record<string, string> = {
  "Tech Tips":       "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=500&fit=crop&q=80",
  "Product Reviews": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200&h=500&fit=crop&q=80",
  "How-To Guides":   "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&h=500&fit=crop&q=80",
  "Buying Guides":   "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=1200&h=500&fit=crop&q=80",
  "News & Trends":   "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&h=500&fit=crop&q=80",
};

// ── Simple markdown-to-JSX renderer ──────────────────────────────────────────
function renderContent(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let listBuffer: string[] = [];
  let listType: "ul" | "check" | null = null;

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    elements.push(
      <ul key={key} className="space-y-2 my-4 pl-1">
        {listBuffer.map((item, i) => (
          <li key={i} className="flex items-start gap-2 text-[15px] text-[#0C0D10]/70 leading-relaxed">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1160CB] flex-shrink-0" />
            <span dangerouslySetInnerHTML={{ __html: inlineMd(item) }} />
          </li>
        ))}
      </ul>
    );
    listBuffer = [];
    listType = null;
  };

  lines.forEach((raw, i) => {
    const line = raw.trim();

    if (line.startsWith("## ")) {
      flushList(`fl-${i}`);
      elements.push(
        <h2 key={i} className="text-[20px] font-extrabold text-[#0C0D10] mt-8 mb-3 leading-tight">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith("### ")) {
      flushList(`fl-${i}`);
      elements.push(
        <h3 key={i} className="text-[16px] font-bold text-[#0C0D10] mt-6 mb-2">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith("- ") || line.startsWith("✅ ") || line.startsWith("❌ ")) {
      const cleaned = line.replace(/^[-✅❌]\s*/, "");
      listBuffer.push(cleaned);
    } else if (line.startsWith("|")) {
      // Skip table rows (render as nothing)
      flushList(`fl-${i}`);
    } else if (line === "") {
      flushList(`fl-${i}`);
    } else {
      flushList(`fl-${i}`);
      elements.push(
        <p key={i} className="text-[15px] text-[#0C0D10]/70 leading-relaxed mb-0"
          dangerouslySetInnerHTML={{ __html: inlineMd(line) }} />
      );
    }
  });
  flushList("final");
  return elements;
}

function inlineMd(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong class=\"font-semibold text-[#0C0D10]\">$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
}

// ── Component ─────────────────────────────────────────────────────────────────
const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    try {
      const all: Article[] = JSON.parse(localStorage.getItem("wivitec_articles") || "[]");
      const found = all.find(a => a.slug === slug && a.status === "published");
      if (!found) { setNotFound(true); return; }
      setArticle(found);
      // Related: same category, different article, max 3
      setRelated(all.filter(a => a.id !== found.id && a.category === found.category && a.status === "published").slice(0, 3));
    } catch {
      setNotFound(true);
    }
    window.scrollTo(0, 0);
  }, [slug]);

  if (notFound) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F0F2F8]">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 py-32">
          <BookOpen size={40} className="text-[#0C0D10]/20" />
          <p className="text-[18px] font-bold text-[#0C0D10]">Article not found</p>
          <Link to="/blog" className="text-[#1160CB] font-semibold text-[14px] hover:underline">
            ← Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) return null;

  const heroImage = article.imageUrl || catImage[article.category] || catImage["Tech Tips"];
  const dateStr = new Date(article.publishedAt || article.createdAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F2F8]">
      <Header />

      {/* Hero Image */}
      <div className="relative h-72 md:h-96 overflow-hidden bg-[#0E121A]">
        <img src={heroImage} alt={article.title}
          className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0E121A] via-[#0E121A]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 max-w-4xl mx-auto">
          <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 ${catColor[article.category] || "bg-gray-100 text-gray-600"}`}>
            {article.category}
          </span>
          <h1 className="text-[22px] md:text-[32px] font-extrabold text-white leading-tight">
            {article.title}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto w-full px-4 py-10">
        {/* Back + Meta */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/blog"
            className="flex items-center gap-1.5 text-[13px] font-medium text-[#0C0D10]/40 hover:text-[#1160CB] transition-colors">
            <ArrowLeft size={14} /> Back to Blog
          </Link>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-caption text-[#0C0D10]/30">
              <Clock size={12} /> {article.readTime} min read
            </span>
            <span className="flex items-center gap-1.5 text-caption text-[#0C0D10]/30">
              <Calendar size={12} /> {dateStr}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Article Body */}
          <article className="lg:col-span-3">
            <div className="bg-white rounded-[20px] border border-[#F0F2F8] p-7 md:p-10">
              {/* Excerpt */}
              <p className="text-[16px] text-[#0C0D10]/60 leading-relaxed border-l-4 border-[#1160CB] pl-4 mb-8 italic">
                {article.excerpt}
              </p>

              {/* Body */}
              <div className="space-y-4">
                {renderContent(article.content)}
              </div>

              {/* Tags */}
              {article.tags && (
                <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-[#F0F2F8]">
                  <Tag size={13} className="text-[#0C0D10]/30 mt-0.5" />
                  {article.tags.split(",").map(tag => (
                    <span key={tag}
                      className="text-[11px] font-medium px-2.5 py-1 bg-[#F0F2F8] text-[#0C0D10]/50 rounded-full">
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Author */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#F0F2F8]">
                <div className="w-10 h-10 rounded-full bg-[#1160CB] flex items-center justify-center text-white font-bold text-[14px]">
                  {(article.author || "W").charAt(0)}
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0C0D10]">{article.author || "WIVITEC Team"}</p>
                  <p className="text-caption text-[#0C0D10]/30">Published {dateStr}</p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 bg-gradient-to-br from-[#1528A1] to-[#1160CB] rounded-[20px] p-8 text-white text-center">
              <h3 className="text-[20px] font-extrabold mb-2">Shop at WIVITEC</h3>
              <p className="text-white/60 text-[14px] mb-5">
                Premium electronics — free shipping over $50, 1-Year warranty on all products.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/products"
                  className="px-6 py-2.5 bg-white text-[#1160CB] font-bold rounded-full text-[13px] hover:bg-white/90 transition-colors">
                  Browse Products
                </Link>
                <Link to="/deals"
                  className="px-6 py-2.5 border border-white/30 text-white font-semibold rounded-full text-[13px] hover:bg-white/10 transition-colors">
                  View Deals
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-5">
            {/* Related Articles */}
            {related.length > 0 && (
              <div className="bg-white rounded-[16px] border border-[#F0F2F8] p-5">
                <h4 className="text-[12px] font-bold text-[#0C0D10] uppercase tracking-widest mb-4">
                  Related Articles
                </h4>
                <div className="space-y-4">
                  {related.map(rel => (
                    <Link key={rel.id} to={`/blog/${rel.slug}`}
                      className="group flex gap-3 items-start hover:text-[#1160CB] transition-colors">
                      <div className="w-12 h-12 rounded-[8px] bg-[#F0F2F8] overflow-hidden flex-shrink-0">
                        <img src={rel.imageUrl || catImage[rel.category]}
                          alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-[12px] font-semibold text-[#0C0D10] leading-snug line-clamp-2 group-hover:text-[#1160CB] transition-colors">
                          {rel.title}
                        </p>
                        <p className="text-caption text-[#0C0D10]/30 mt-1">
                          {rel.readTime} min read
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/blog"
                  className="flex items-center gap-1 text-[#1160CB] text-[12px] font-semibold mt-5 hover:underline">
                  All articles <ChevronRight size={12} />
                </Link>
              </div>
            )}

            {/* Quick Links */}
            <div className="bg-white rounded-[16px] border border-[#F0F2F8] p-5">
              <h4 className="text-[12px] font-bold text-[#0C0D10] uppercase tracking-widest mb-4">
                Quick Links
              </h4>
              <div className="space-y-2">
                {[
                  { label: "All Products", to: "/products" },
                  { label: "Deals & Offers", to: "/deals" },
                  { label: "New Arrivals", to: "/new-arrivals" },
                  { label: "Best Sellers", to: "/best-sellers" },
                  { label: "Contact Us", to: "/contact" },
                ].map(l => (
                  <Link key={l.to} to={l.to}
                    className="flex items-center justify-between text-[13px] text-[#0C0D10]/60 hover:text-[#1160CB] py-1.5 border-b border-[#F0F2F8] last:border-0 transition-colors">
                    {l.label}
                    <ChevronRight size={13} />
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ArticlePage;
