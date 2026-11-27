"use client";

import Image from "next/image";
import {
  Users,
  CheckCircle,
  MessageCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Volume2,
  Tv2,
  BedDouble,
  Plug,
  Bus as BusIcon,
} from "lucide-react";
import { Bus, BusinessInfo } from "@/types";
import {
  getBusEnquiryWhatsAppUrl,
  getGeneralWhatsAppUrl,
} from "@/lib/whatsapp";

interface FleetSectionProps {
  fleet: Bus[];
  business: BusinessInfo;
  onSelectBus?: (busName: string) => void;
}

const FEATURE_ICONS: Record<string, React.ReactNode> = {
  "4K TV": <Tv2 className="w-3.5 h-3.5 text-amber-400" />,
  "Laser lights": <Zap className="w-3.5 h-3.5 text-amber-400" />,
  "Push back seats": <BedDouble className="w-3.5 h-3.5 text-amber-400" />,
  "Sound system": <Volume2 className="w-3.5 h-3.5 text-amber-400" />,
  "Charging ports at every seat": <Plug className="w-3.5 h-3.5 text-amber-400" />,
  "Charging ports": <Plug className="w-3.5 h-3.5 text-amber-400" />,
  "Bed system (if required)": <BedDouble className="w-3.5 h-3.5 text-amber-400" />,
};

function getFeatureIcon(feat: string) {
  return (
    FEATURE_ICONS[feat] ?? (
      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
    )
  );
}

function LuxuryBusHero({
  bus,
  business,
  onSelectBus,
}: {
  bus: Bus;
  business: BusinessInfo;
  onSelectBus?: (name: string) => void;
}) {
  const waUrl = getBusEnquiryWhatsAppUrl(
    business.whatsapp,
    bus.name,
    bus.seatingCapacity
  );

  return (
    <div className="relative rounded-3xl overflow-hidden border border-amber-400/40 shadow-2xl shadow-amber-500/20 group">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bus.image}
          alt={bus.name}
          fill
          sizes="100vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b132b]/95 via-[#0b132b]/75 to-[#0b132b]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b132b]/80 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center gap-8">
        {/* Left: Details */}
        <div className="flex-1 space-y-5">
          {/* Badge */}
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black tracking-wide shadow-lg">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              {bus.badge ?? "Flagship Luxury"}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
              Driver Included
            </span>
          </div>

          {/* Title & capacity */}
          <div>
            <h3 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {bus.name}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Users className="w-4 h-4 text-amber-400" />
              <span className="text-amber-400 font-bold">
                {bus.seatingCapacity} Seats
              </span>
              <span className="text-slate-400 text-sm">·</span>
              <span className="text-slate-300 text-sm">AC</span>
            </div>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg">
            {bus.description}
          </p>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {bus.features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-slate-200">
                {getFeatureIcon(feat)}
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Pricing info */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center">
              <div className="text-2xl font-black text-white">
                ₹{bus.customPerKmRate}
                <span className="text-sm font-normal text-slate-400">/km</span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Per KM Rate</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-center">
              <div className="text-2xl font-black text-amber-400">
                300 KM
              </div>
              <div className="text-xs text-slate-400 mt-0.5">Day Package Limit</div>
            </div>
            <div className="text-xs text-slate-500 leading-relaxed">
              Excludes: Toll, TP, Tax, Parking<br />
              KM counted from parking to parking
            </div>
          </div>
        </div>

        {/* Right: CTA */}
        <div className="flex lg:flex-col gap-3 lg:min-w-[200px]">
          <a
            href="#enquiry"
            onClick={() => onSelectBus?.(bus.name)}
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Get Quote</span>
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 lg:flex-none flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-300 font-bold text-sm transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-current" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

function StandardVehicleCard({
  bus,
  business,
  onSelectBus,
}: {
  bus: Bus;
  business: BusinessInfo;
  onSelectBus?: (name: string) => void;
}) {
  const waUrl = getBusEnquiryWhatsAppUrl(
    business.whatsapp,
    bus.name,
    bus.seatingCapacity
  );

  const label =
    bus.seatingCapacity === 17
      ? "17 Seat"
      : bus.seatingCapacity === 20
        ? "20 Seat"
        : `${bus.seatingCapacity} Seat`;

  return (
    <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col group">
      {/* Image */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-900 shrink-0">
        <Image
          src={bus.image}
          alt={bus.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          {bus.badge ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 fill-slate-950" />
              {bus.badge}
            </span>
          ) : (
            <span />
          )}
          <span className="px-2.5 py-1 rounded-full bg-sky-500/80 text-white text-xs font-bold backdrop-blur-sm border border-sky-400/30">
            AC
          </span>
        </div>

        {/* Seat count */}
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md backdrop-blur-sm">
            <Users className="w-3.5 h-3.5 stroke-[2.5]" />
            {label} · Driver Included
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
              {bus.name}
              <span className="ml-2 text-sm font-normal text-slate-400">
                ({bus.seatingCapacity} Seats)
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">
              {bus.description}
            </p>
          </div>

          {/* Features */}
          <ul className="space-y-1.5">
            {bus.features.map((feat, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                {getFeatureIcon(feat)}
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xl font-black text-white">
                ₹{bus.customPerKmRate}
                <span className="text-xs font-normal text-slate-400">/km</span>
              </div>
              {(bus as Bus & { dayPackageKmLimit?: number | null }).dayPackageKmLimit ? (
                <div className="text-xs text-amber-400 font-semibold">
                  Day pkg: 300 km
                </div>
              ) : null}
            </div>
            <div className="text-right text-xs text-slate-500 leading-snug">
              Excl. Toll,<br />TP, Tax,<br />Parking
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
              WhatsApp
            </a>
            <a
              href="#enquiry"
              onClick={() => onSelectBus?.(bus.name)}
              className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-400/20 transition-all hover:scale-[1.02]"
            >
              Get Quote
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function FleetSection({
  fleet,
  business,
  onSelectBus,
}: FleetSectionProps) {
  const activeBuses = fleet.filter((b) => b.isActive);
  const luxuryBus = activeBuses.find((b) => b.id === "luxury-bus-50");
  const otherBuses = activeBuses.filter((b) => b.id !== "luxury-bus-50");

  return (
    <section id="fleet" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <BusIcon className="w-3.5 h-3.5" />
          <span>Our Fleet</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Choose Your Perfect Ride
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          From premium tempo travellers to our flagship luxury bus — every vehicle comes with a verified driver, AC, and guaranteed comfort.
        </p>
      </div>

      {/* Luxury Bus — full-width hero */}
      {luxuryBus && (
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-amber-400/40" />
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Flagship Vehicle
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/40" />
          </div>
          <LuxuryBusHero
            bus={luxuryBus}
            business={business}
            onSelectBus={onSelectBus}
          />
        </div>
      )}

      {/* Other 3 vehicles — 3-column grid */}
      {otherBuses.length > 0 && (
        <>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
              More Vehicles
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherBuses.map((bus) => (
              <StandardVehicleCard
                key={bus.id}
                bus={bus}
                business={business}
                onSelectBus={onSelectBus}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
