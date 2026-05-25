import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find(
    (l) => l.code === (i18n.language?.split("-")[0] || "en")
  ) || LANGUAGES[0];

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    setOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all"
        aria-label="Change language"
      >
        <Globe size={14} />
        <span className="hidden sm:inline">{currentLang.flag} {currentLang.code.toUpperCase()}</span>
        <span className="sm:hidden">{currentLang.flag}</span>
        <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 min-w-[140px]">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleChange(lang.code)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-xs font-bold transition-colors text-left",
                lang.code === currentLang.code
                  ? "bg-slate-900 text-white"
                  : "text-slate-700 hover:bg-slate-50"
              )}
            >
              <span className="text-base">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
