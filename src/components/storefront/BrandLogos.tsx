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

  return (
    <section className="py-12 border-y border-slate-50 bg-white/50">
      <div className="section-container">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center mb-10">
          Trusted by Global Tech Leaders
        </p>
        <div className="flex flex-wrap items-center justify-center gap-12 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {brands.map((brand) => (
            <img
              key={brand.name}
              src={brand.logo}
              alt={brand.name}
              className="h-6 md:h-8 w-auto object-contain hover:opacity-100 transition-opacity"
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;