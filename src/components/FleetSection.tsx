"use client";

import { useState } from "react";
import { Bus as BusIcon, Sparkles } from "lucide-react";
import { Bus, BusinessInfo } from "@/types";
import { FleetCard } from "./FleetCard";

interface FleetSectionProps {
  fleet: Bus[];
  business: BusinessInfo;
  onSelectBus?: (busName: string) => void;
}

export function FleetSection({
  fleet,
  business,
  onSelectBus,
}: FleetSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const categories = [
    { label: "All Fleet", value: "all" },
    { label: "Mini Coaches (17-26 Seats)", value: "mini" },
    { label: "Standard AC (32-40 Seats)", value: "standard" },
    { label: "Luxury Cruisers (45-55 Seats)", value: "luxury" },
  ];

  const activeBuses = fleet.filter((bus) => bus.isActive);

  const filteredBuses =
    activeFilter === "all"
      ? activeBuses
      : activeBuses.filter((bus) => bus.category === activeFilter);

  return (
    <section id="fleet" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <BusIcon className="w-3.5 h-3.5" />
          <span>Our Premium Fleet</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Modern, Sanitized Buses for Every Group Size
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          From nimble 17-seater urban minibuses to multi-axle 55-seater highway cruisers, all our coaches are meticulously serviced and piloted by verified drivers.
        </p>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveFilter(cat.value)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeFilter === cat.value
                  ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredBuses.map((bus) => (
          <FleetCard
            key={bus.id}
            bus={bus}
            business={business}
            onSelectForEnquiry={onSelectBus}
          />
        ))}
      </div>
    </section>
  );
}
