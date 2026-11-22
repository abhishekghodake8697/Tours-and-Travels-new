"use client";

import Image from "next/image";
import {
  ShieldCheck,
  UserCheck,
  Award,
  Sparkles,
  CheckCircle2,
  HeartHandshake,
  Clock,
  Compass,
} from "lucide-react";
import { BusinessInfo } from "@/types";

interface AboutSectionProps {
  business: BusinessInfo;
}

export function AboutSection({ business }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Images & Visual Highlights */}
        <div className="lg:col-span-5 relative">
          <div className="relative h-[440px] sm:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <Image
              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
              alt="Professional Chauffeur with Luxury Coach"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* Overlaid Badge */}
            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-panel border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xl shrink-0">
                  {business.stats.experienceYears}+
                </div>
                <div>
                  <div className="text-white font-extrabold text-sm">
                    Years of Chauffeur Excellence
                  </div>
                  <div className="text-xs text-slate-300">
                    Trusted by over {business.stats.happyCustomers.toLocaleString()}+ passengers
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Safety Badge */}
          <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-900/90 border border-amber-400/30 text-white text-xs font-bold shadow-xl backdrop-blur-md">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span>100% Commercial Compliance</span>
          </div>
        </div>

        {/* Right Side: Text & Core Pillars */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>About {business.name}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Setting the Benchmark in Safe & Luxurious Group Travel
          </h2>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
            {business.fullAbout}
          </p>

          {/* Pillars Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <UserCheck className="w-4 h-4" />
                <span>Driver Professionalism</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Every bus is commanded by a vetted, courteous driver with highway verification and proven hill-station dexterity.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <ShieldCheck className="w-4 h-4" />
                <span>Rigorous Safety Standards</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {business.safetyPromise}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Clock className="w-4 h-4" />
                <span>Punctuality Culture</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                We arrive at your designated pickup 20 minutes prior to departure with conditioned cabins and spotless seating.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <HeartHandshake className="w-4 h-4" />
                <span>Customer Philosophy</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {business.philosophy}
              </p>
            </div>
          </div>

          {/* Quick CTA */}
          <div className="pt-2">
            <a
              href="#enquiry"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-400/20 transition-all hover:scale-[1.02]"
            >
              <span>Speak with Our Travel Coordinator</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
