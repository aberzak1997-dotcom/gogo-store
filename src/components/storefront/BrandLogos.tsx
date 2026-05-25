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
    <section className="px-4 md:px-6 max-w-[1400px] mx-auto my-4">
      <div className="p-5 bg-[#2563eb] rounded-2xl overflow-hidden relative">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100 text-center mb-6">
          Trusted by Global Tech Leaders
        </p>

        <div className="relative flex overflow-hidden group">
          <div className="flex animate-marquee whitespace-nowrap gap-12 md:gap-24 items-center py-2">
            {displayBrands.map((brand, idx) => (
              <div key={`${brand.name}-${idx}`} className="flex-shrink-0 flex items-center justify-center">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-6 md:h-8 w-auto object-contain opacity-75 brightness-0 invert hover:opacity-100 transition-all duration-500"
                />
              </div>
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