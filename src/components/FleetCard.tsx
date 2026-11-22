"use client";

import Image from "next/image";
import {
  Users,
  Wind,
  Luggage,
  UserCheck,
  CheckCircle,
  MessageCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Bus, BusinessInfo } from "@/types";
import { getBusEnquiryWhatsAppUrl } from "@/lib/whatsapp";

interface FleetCardProps {
  bus: Bus;
  business: BusinessInfo;
  onSelectForEnquiry?: (busName: string) => void;
}

export function FleetCard({
  bus,
  business,
  onSelectForEnquiry,
}: FleetCardProps) {
  const waUrl = getBusEnquiryWhatsAppUrl(
    business.whatsapp,
    bus.name,
    bus.seatingCapacity
  );

  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col group">
      {/* Bus Image Container */}
      <div className="relative h-60 w-full overflow-hidden bg-slate-900">
        <Image
          src={bus.image}
          alt={bus.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          {bus.badge ? (
            <span className="px-3 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black tracking-wide shadow-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              {bus.badge}
            </span>
          ) : (
            <span />
          )}

          <span
            className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md shadow-md ${
              bus.isAc
                ? "bg-sky-500/80 text-white border border-sky-400/30"
                : "bg-slate-700/80 text-slate-200 border border-slate-600/30"
            }`}
          >
            {bus.isAc ? "Super-Cool AC" : "Non-AC Economy"}
          </span>
        </div>

        {/* Bottom Driver Included Pill */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md backdrop-blur-sm">
            <UserCheck className="w-3.5 h-3.5 stroke-[2.5]" />
            Driver Included
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
              {bus.name}
            </h3>
          </div>

          <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
            {bus.description}
          </p>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 gap-2 my-4 py-3 border-y border-white/5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="font-bold text-white">
                {bus.seatingCapacity} Passenger Seats
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-sky-400 shrink-0" />
              <span>{bus.isAc ? "Chilled AC Cabin" : "Well-Ventilated"}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <Luggage className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="truncate">{bus.luggageCapacity}</span>
            </div>
          </div>

          {/* Features Bullets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Key Features:
            </span>
            <ul className="space-y-1">
              {bus.features.slice(0, 4).map((feat, idx) => (
                <li
                  key={idx}
                  className="flex items-center gap-2 text-xs text-slate-300"
                >
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-white/10 space-y-3">
          <div className="flex items-baseline justify-between">
            <div className="text-xs text-slate-400">Starting from</div>
            <div className="text-right">
              {bus.customDayPackagePrice ? (
                <span className="text-lg font-black text-white">
                  ₹{bus.customDayPackagePrice.toLocaleString("en-IN")}
                  <span className="text-xs font-normal text-slate-400"> / 250 KM Day</span>
                </span>
              ) : (
                <span className="text-lg font-black text-white">
                  ₹{bus.customPerKmRate || 24}
                  <span className="text-xs font-normal text-slate-400"> / KM</span>
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current" />
              <span>WhatsApp</span>
            </a>

            <a
              href="#enquiry"
              onClick={() => onSelectForEnquiry?.(bus.name)}
              className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-400/20 transition-all hover:scale-[1.02]"
            >
              <span>Get Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
