"use client";

import Image from "next/image";
import {
  ShieldCheck,
  UserCheck,
  Compass,
  ArrowRight,
  MessageCircle,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  Phone,
} from "lucide-react";
import { BusinessInfo, HomeContent } from "@/types";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

interface HeroProps {
  business: BusinessInfo;
  homeContent: HomeContent;
}

export function Hero({ business, homeContent }: HeroProps) {
  const waUrl = getGeneralWhatsAppUrl(business.whatsapp, business.name);

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden"
    >
      {/* Background Cinematic Visual with Dark Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=85"
          alt="Luxury Bus Fleet on Highway"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105 animate-pulse duration-[10000ms]"
        />
        {/* Multi-layered dark cinematic gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b132b] via-[#0b132b]/85 to-[#0b132b]/70" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-[#0b132b]/60 to-[#0b132b]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center sm:text-left pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Copy */}
          <div className="lg:col-span-8 space-y-6">
            {/* Highlight Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{homeContent.heroHighlightBadge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              {homeContent.heroHeadline.split("Every Journey")[0]}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500">
                Every Journey
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
              {homeContent.heroSubheadline}
            </p>

            {/* Immediate Important Highlights Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Driver Included</span>
                </div>
                <div className="text-sm font-bold text-white">
                  Verified Chauffeur
                </div>
                <div className="text-xs text-slate-400">Zero driving fatigue</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Up to 250 KM</span>
                </div>
                <div className="text-sm font-bold text-white">Day Packages</div>
                <div className="text-xs text-slate-400">12-hr single day trips</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Pricing Models</span>
                </div>
                <div className="text-sm font-bold text-white">Per-KM & Fixed</div>
                <div className="text-xs text-slate-400">Transparent bills</div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-left backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>24/7 Operations</span>
                </div>
                <div className="text-sm font-bold text-white">GPS Monitored</div>
                <div className="text-xs text-slate-400">On-time guarantee</div>
              </div>
            </div>

            {/* CTA Buttons in Single Line */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <a
                href="#enquiry"
                className="h-12 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 text-sm sm:text-base font-extrabold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                <span>{homeContent.primaryCtaText}</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </a>

              <a
                href={`tel:${business.phone}`}
                className="h-12 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 text-sm sm:text-base font-bold text-white bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shadow-md"
              >
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Call: {business.phone}</span>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 text-sm sm:text-base font-bold text-white bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-400/40 rounded-xl shadow-xl shadow-emerald-600/20 backdrop-blur-md transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4 fill-current text-white shrink-0" />
                <span>{homeContent.secondaryCtaText}</span>
              </a>
            </div>
          </div>

          {/* Right Floating Quick Badge / Fast Quote Card */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="glass-panel rounded-3xl p-6 shadow-2xl relative border border-white/10 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Quick Booking Promise
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Fleet Ready
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Experienced Driver With Every Bus</strong>
                    <span>No self-drive risks. Commercial highway verified drivers.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Fixed 250 KM Day Package</strong>
                    <span>Ideal for one-day group trips without surprise mileage math.</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block">Clean & Hygienic AC Fleet</strong>
                    <span>Deep cleaned before every pickup. Reclining plush seats.</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="#rates"
                  className="flex items-center justify-between w-full p-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold transition-all group"
                >
                  <span>Explore transparent rates & calculate fare</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
