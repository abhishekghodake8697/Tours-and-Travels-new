"use client";

import {
  Tag,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  ShieldCheck,
  Sparkles,
  Info,
} from "lucide-react";
import { RateConfig, Bus, BusinessInfo } from "@/types";
import { FareCalculator } from "./FareCalculator";

interface RateCardSectionProps {
  rates: RateConfig;
  buses: Bus[];
  business: BusinessInfo;
}

export function RateCardSection({
  rates,
  buses,
  business,
}: RateCardSectionProps) {
  return (
    <section id="rates" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Tag className="w-3.5 h-3.5" />
          <span>Transparent Tariff</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Clear, Honest Rates With Zero Hidden Surprises
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          Choose between our all-inclusive Fixed 250 KM Day Package or standard Per-Kilometer billing. All vehicles come with professional highway drivers.
        </p>
      </div>

      {/* Two Core Pricing Models Cards Side by Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Model 1: Fixed Day Package */}
        <div className="glass-panel rounded-3xl p-8 border-2 border-amber-400/40 relative shadow-2xl flex flex-col justify-between overflow-hidden">
          <div className="absolute top-0 right-0 px-6 py-1.5 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-bl-2xl shadow-lg">
            Most Popular for Day Tours
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Compass className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-2xl font-black text-white">
                  Fixed Day Package
                </h3>
                <span className="text-xs text-amber-300 font-semibold">
                  Journeys within ~250 KM
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-2">
              The stress-free choice for picnics, family day trips, corporate retreats, and school excursions returning the same day.
            </p>

            {/* Price Display */}
            <div className="my-6 p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Package Price</span>
                <span className="text-4xl font-black text-white">
                  ₹{rates.dayPackagePrice.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-400 block">
                  Up to {rates.dayPackageKmLimit} KM
                </span>
                <span className="text-xs text-slate-400">
                  Full Day (12 Hours)
                </span>
              </div>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Professional Driver Included:</strong> Zero driving stress.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Covers {rates.dayPackageKmLimit} KM:</strong> Ample for standard outstation day tours.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Extra KM Rate:</strong> Only ₹{rates.extraKmRate}/KM if you exceed {rates.dayPackageKmLimit} KM.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Air-Conditioned Comfort:</strong> Continuous chilled cabin.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <a
              href="#enquiry"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.01]"
            >
              <span>Book 250 KM Day Package</span>
            </a>
          </div>
        </div>

        {/* Model 2: Per KM Rate */}
        <div className="glass-panel rounded-3xl p-8 border border-white/10 relative shadow-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
                <Tag className="w-5 h-5" />
              </span>
              <div>
                <h3 className="text-2xl font-black text-white">
                  Per-Kilometer Rate
                </h3>
                <span className="text-xs text-sky-300 font-semibold">
                  Multi-Day & Long Distance Trips
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-2">
              Ideal for multi-day tours, interstate expeditions, and round-trips exceeding standard single-day schedules.
            </p>

            {/* Price Display */}
            <div className="my-6 p-4 rounded-2xl bg-slate-900/80 border border-white/10 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Baseline Rate</span>
                <span className="text-4xl font-black text-white">
                  ₹{rates.perKmRate}
                  <span className="text-sm font-semibold text-slate-400"> / KM</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-sky-400 block">
                  Min {rates.perKmMinDistance} KM / Day
                </span>
                <span className="text-xs text-slate-400">
                  Garage to Garage
                </span>
              </div>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Driver Included:</strong> Commercial highway pilot provided.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Driver Day Allowance:</strong> ₹{rates.driverAllowancePerDay} per day.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Night Halt (If after 11 PM):</strong> ₹{rates.nightHaltCharge} allowance.
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Flexible Itinerary:</strong> Take breaks and stops as your group wishes.
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10">
            <a
              href="#enquiry"
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-600 transition-all hover:scale-[1.01]"
            >
              <span>Book Per-KM Outstation</span>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Live Fare Calculator */}
      <FareCalculator rates={rates} buses={buses} business={business} />

      {/* Terms & Important Disclaimers */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center gap-2 text-amber-400 font-extrabold text-sm uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>Billing Terms & Transparent Conditions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          {rates.terms.map((term, idx) => (
            <div key={idx} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
              <span>{term}</span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-amber-400/5 border border-amber-400/20 text-xs text-amber-300/90 flex items-start gap-2 mt-4">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{rates.notes}</span>
        </div>
      </div>
    </section>
  );
}
