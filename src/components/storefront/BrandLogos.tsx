"use client";

import React from "react";

const BrandLogos = () => {
  const brands = [
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
    { name: "Sony", logo: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Dell", logo: "https://upload.wikimedia.org/wikipedia/commons/1/18/Dell_logo_2016.svg" },
  ];

  // Duplicate brands to ensure a seamless loop
  const displayBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <section className="py-12 border-y border-slate-50 bg-white/50 overflow-hidden">
      <div className="w-full">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center mb-10">
          Trusted by Global Tech Leaders
        </p>

        <div className="relative flex overflow-hidden group">
          <div className="flex animate-marquee whitespace-nowrap gap-12 md:gap-24 items-center py-2">
            {displayBrands.map((brand, idx) => (
              <img
                key={`${brand.name}-${idx}`}
                src={brand.logo}
                alt={brand.name}
                className="h-6 md:h-8 w-auto object-contain opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .group:hover .animate-marquee {
          animation-play-state: paused;
        }
      `}} />
    </section>
  );
};

export default BrandLogos;
