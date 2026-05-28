import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/storefront/Navbar";
import Footer from "../../components/storefront/Footer";
import { Clock, Calendar, ChevronRight, BookOpen } from "lucide-react";

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

const CATEGORIES = ["All", "Tech Tips", "Product Reviews", "How-To Guides", "Buying Guides", "News & Trends"];

const catColor: Record<string, string> = {
  "Tech Tips":       "bg-[#479BF7]/10 text-[#1160CB]",
  "Product Reviews": "bg-purple-100 text-purple-700",
  "How-To Guides":   "bg-green-100 text-green-700",
  "Buying Guides":   "bg-orange-100 text-orange-700",
  "News & Trends":   "bg-rose-100 text-rose-700",
};

// Fallback images by category
const catImage: Record<string, string> = {
  "Tech Tips":       "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=360&fit=crop&q=80",
  "Product Reviews": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=360&fit=crop&q=80",
  "How-To Guides":   "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=600&h=360&fit=crop&q=80",
  "Buying Guides":   "https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=600&h=360&fit=crop&q=80",
  "News & Trends":   "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&h=360&fit=crop&q=80",
};

const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    try {
      const all: Article[] = JSON.parse(localStorage.getItem("wivitec_articles") || "[]");
      setArticles(all.filter(a => a.status === "published"));
    } catch {
      setArticles([]);
    }
  }, []);

  const filtered = activeCategory === "All"
    ? articles
    : articles.filter(a => a.category === activeCategory);

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F2F8]">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#0E121A] pt-20 pb-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-caption text-[#479BF7] uppercase tracking-widest mb-3">
            WIVITEC Blog
          </span>
          <h1 className="text-[32px] md:text-[44px] font-extrabold text-white tracking-tight leading-tight">
            Tech Tips, Guides &<br />Expert Reviews
          </h1>
          <p className="text-[15px] text-white/40 mt-4 max-w-xl mx-auto">
            In-depth articles to help you choose the right tech, get more from your devices, and stay ahead of the latest trends.
          </p>
        </div>
      </section>

      {/* Category Tabs */}
      <div className="bg-white border-b border-[#F0F2F8] sticky top-0 z-20 px-4">
        <div className="max-w-6xl mx-auto overflow-x-auto">
          <div className="flex gap-1 py-3 min-w-max">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-[8px] text-[12px] font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? "bg-[#1160CB] text-white"
                    : "text-[#0C0D10]/50 hover:text-[#0C0D10] hover:bg-[#F0F2F8]"
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {articles.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <BookOpen size={28} className="text-[#0C0D10]/20" />
            </div>
            <div className="text-center">
              <p className="font-bold text-[#0C0D10] text-[18px]">No articles yet</p>
              <p className="text-[#0C0D10]/40 mt-1 text-[14px]">
                Check back soon — we're publishing new guides and tips regularly.
              </p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <p className="font-semibold text-[#0C0D10]">No articles in this category yet</p>
            <button onClick={() => setActiveCategory("All")}
              className="text-[#1160CB] text-[13px] font-semibold hover:underline">
              View all articles
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Featured Article */}
            {featured && (
              <Link to={`/blog/${featured.slug}`}
                className="group block bg-white rounded-[20px] overflow-hidden border border-[#F0F2F8] hover:border-[#1160CB]/20 hover:shadow-lg transition-all">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-64 md:h-auto overflow-hidden bg-[#F0F2F8]">
                    <img
                      src={featured.imageUrl || catImage[featured.category] || catImage["Tech Tips"]}
                      alt={featured.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${catColor[featured.category] || "bg-gray-100 text-gray-600"}`}>
                        {featured.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="text-caption text-[#1160CB] font-bold mb-2">Featured</span>
                    <h2 className="text-[22px] font-extrabold text-[#0C0D10] leading-snug group-hover:text-[#1160CB] transition-colors">
                      {featured.title}
                    </h2>
                    <p className="text-[14px] text-[#0C0D10]/50 mt-3 line-clamp-3">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 mt-5">
                      <span className="flex items-center gap-1.5 text-caption text-[#0C0D10]/30">
                        <Clock size={12} /> {featured.readTime} min read
                      </span>
                      <span className="flex items-center gap-1.5 text-caption text-[#0C0D10]/30">
                        <Calendar size={12} /> {new Date(featured.publishedAt || featured.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </span>
                    </div>
                    <div className="mt-5 flex items-center gap-1 text-[#1160CB] font-semibold text-[13px] group-hover:gap-2 transition-all">
                      Read Article <ChevronRight size={15} />
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Article Grid */}
            {rest.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map(article => (
                  <Link key={article.id} to={`/blog/${article.slug}`}
                    className="group bg-white rounded-[16px] border border-[#F0F2F8] overflow-hidden hover:border-[#1160CB]/20 hover:shadow-md transition-all flex flex-col">
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden bg-[#F0F2F8]">
                      <img
                        src={article.imageUrl || catImage[article.category] || catImage["Tech Tips"]}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${catColor[article.category] || "bg-gray-100 text-gray-600"}`}>
                          {article.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-[14px] text-[#0C0D10] leading-snug line-clamp-2 group-hover:text-[#1160CB] transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-[12px] text-[#0C0D10]/40 mt-2 line-clamp-2 flex-1">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F0F2F8]">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-caption text-[#0C0D10]/30">
                            <Clock size={11} /> {article.readTime} min
                          </span>
                          <span className="flex items-center gap-1 text-caption text-[#0C0D10]/30">
                            <Calendar size={11} /> {new Date(article.publishedAt || article.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </span>
                        </div>
                        <ChevronRight size={14} className="text-[#1160CB] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;
