"use client";

import {
  UserCheck,
  ShieldCheck,
  BadgePercent,
  Armchair,
  Clock,
  Sparkles,
  Headphones,
  FileCheck,
} from "lucide-react";
import { WhyChooseUsItem } from "@/types";

const iconMap: Record<string, any> = {
  UserCheck,
  ShieldCheck,
  BadgePercent,
  Armchair,
  Clock,
  Sparkles,
  Headphones,
  FileCheck,
};

interface WhyChooseUsSectionProps {
  items: WhyChooseUsItem[];
}

export function WhyChooseUsSection({ items }: WhyChooseUsSectionProps) {
  return (
    <section id="why-us" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Royal Advantage</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Why Discerning Travelers Choose Us
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          We combine luxury vehicles, certified highway chauffeurs, and transparent billing so you can focus entirely on celebrating the trip.
        </p>
      </div>

      {/* 8 Selling Points Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((item, idx) => {
          const Icon = iconMap[item.icon] || Sparkles;
          return (
            <div
              key={idx}
              className="glass-panel rounded-3xl p-6 border border-white/10 hover:border-amber-400/30 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-amber-400 font-semibold">
                <span>Verified Standard</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
