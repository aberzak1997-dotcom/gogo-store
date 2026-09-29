"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Package } from "lucide-react";
import type { Product } from "../../types";
import { cn } from "@/lib/utils";

// Entry motion: CSS only, skipped entirely under prefers-reduced-motion.
const enter =
  "motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-3 motion-safe:duration-700 [animation-fill-mode:backwards]";
const easeOut = "cubic-bezier(0.16, 1, 0.3, 1)";

type Pick = {
  label: string;
  labelClass: string;
  product?: Product;
};

const PickTile = ({ pick, delay }: { pick: Pick; delay: number }) => {
  const { product } = pick;
  const [imageFailed, setImageFailed] = useState(false);

  if (!product) {
    return (
      <div className="h-[92px] rounded-[16px] border border-[#F0F2F8] bg-white p-3 flex items-center gap-3 animate-pulse">
        <div className="h-[68px] w-[68px] rounded-[12px] bg-[#F0F2F8]" />
        <div className="flex-1 space-y-2">
          <div className="h-2.5 w-16 rounded-full bg-[#F0F2F8]" />
          <div className="h-3 w-3/4 rounded-full bg-[#F0F2F8]" />
          <div className="h-3 w-12 rounded-full bg-[#F0F2F8]" />
        </div>
      </div>
    );
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className={cn(
        "group flex items-center gap-3 rounded-[16px] border border-[#F0F2F8] bg-white p-3",
        "shadow-[0_4px_24px_rgba(21,40,161,0.06)] transition-[transform,box-shadow,border-color] duration-200",
        "hover:-translate-y-0.5 hover:border-[#479BF7] hover:shadow-[0_8px_32px_rgba(21,40,161,0.14)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1160CB] focus-visible:ring-offset-2",
        enter
      )}
      style={{ animationDelay: `${delay}ms`, animationTimingFunction: easeOut }}
    >
      <div className="h-[68px] w-[68px] flex-shrink-0 rounded-[12px] bg-[#F0F2F8] p-2 flex items-center justify-center overflow-hidden">
        {product.imageUrl && !imageFailed ? (
          <img
            src={product.imageUrl}
            alt=""
            onError={() => setImageFailed(true)}
            className="max-h-full max-w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <Package size={24} strokeWidth={1.5} className="text-[#1528A1]/30" aria-hidden="true" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className={cn("inline-block rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-[2px]", pick.labelClass)}>
          {pick.label}
        </span>
        <p className="mt-1 truncate text-[14px] font-semibold text-[#0C0D10] group-hover:text-[#1528A1] transition-colors">
          {product.title}
        </p>
        <p className="text-[15px] font-bold text-[#1528A1] tabular-nums">${product.price.toFixed(2)}</p>
      </div>
      <ArrowUpRight
        size={18}
        className="flex-shrink-0 text-[#0C0D10]/30 transition-[color,transform] duration-200 group-hover:text-[#1160CB] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
};

const HomeHero = ({ newArrival, bestSeller }: { newArrival?: Product; bestSeller?: Product }) => {
  const picks: Pick[] = [
    { label: "New arrival", labelClass: "bg-[#FF7A30]/[0.12] text-[#B84A0E]", product: newArrival },
    { label: "Best seller", labelClass: "bg-[#1160CB]/[0.08] text-[#1160CB]", product: bestSeller },
  ];

  return (
    <section className="bg-white">
      {/* Mobile order: copy, visual, picks. Desktop: copy + picks left, visual right spanning both rows. */}
      <div className="section-container grid grid-cols-1 gap-8 pt-8 pb-10 lg:grid-cols-12 lg:grid-rows-[1fr_auto] lg:gap-x-10 lg:gap-y-10 lg:pt-12 lg:pb-14">
        {/* ── Copy ── */}
        <div className="order-1 flex flex-col justify-center lg:order-none lg:col-span-7 lg:row-start-1 lg:pt-6">
            <h1
              className={cn(
                "max-w-[12ch] text-[42px] font-bold leading-[1.02] tracking-[-0.035em] text-[#0C0D10] sm:text-[56px] lg:text-[68px]",
                enter
              )}
              style={{ animationTimingFunction: easeOut }}
            >
              Power your <span className="text-[#1160CB]">digital world.</span>
            </h1>

            <p
              className={cn("mt-5 max-w-[46ch] text-[16px] leading-relaxed text-[#0C0D10]/60 lg:text-[17px]", enter)}
              style={{ animationDelay: "80ms", animationTimingFunction: easeOut }}
            >
              Keyboards, headsets, chargers and gaming gear for your setup, delivered across Morocco.
            </p>

            <div
              className={cn("mt-8 flex flex-wrap items-center gap-3", enter)}
              style={{ animationDelay: "160ms", animationTimingFunction: easeOut }}
            >
              <Link
                to="/products"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-[#1160CB] px-7 text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#1528A1] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1160CB] focus-visible:ring-offset-2"
              >
                Shop Now
                <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/deals"
                className="inline-flex h-12 items-center rounded-full border border-[#1528A1]/30 bg-white px-7 text-[15px] font-semibold text-[#1528A1] transition-colors duration-200 hover:border-[#1528A1] hover:bg-[#1160CB]/[0.05] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1160CB] focus-visible:ring-offset-2"
              >
                View Deals
              </Link>
            </div>
        </div>

        {/* ── Picks ── */}
        <div className="order-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:order-none lg:col-span-7 lg:row-start-2">
          {picks.map((pick, i) => (
            <PickTile key={pick.label} pick={pick} delay={260 + i * 80} />
          ))}
        </div>

        {/* ── Visual ── */}
        <div
          className={cn(
            "order-2 lg:order-none relative overflow-hidden rounded-[24px] aspect-[4/3] sm:aspect-[16/10] lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:aspect-auto lg:min-h-[500px]",
            "motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-[0.98] motion-safe:duration-1000 [animation-fill-mode:backwards]"
          )}
          style={{
            background: "radial-gradient(120% 90% at 50% 30%, #FFFFFF 0%, #EEF4FF 55%, #DFE9FC 100%)",
            animationDelay: "120ms",
            animationTimingFunction: easeOut,
          }}
        >
          <img
            src="/hero-product.png"
            alt="Model wearing a white VR headset"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-[50%_100%]"
          />
        </div>
      </div>
    </section>
  );
};

export default HomeHero;
