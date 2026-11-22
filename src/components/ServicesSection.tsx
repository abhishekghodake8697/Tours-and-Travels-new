"use client";

import { Sparkles, Briefcase } from "lucide-react";
import { ServiceItem } from "@/types";
import { ServiceCard } from "./ServiceCard";

interface ServicesSectionProps {
  services: ServiceItem[];
  onSelectService?: (serviceTitle: string) => void;
}

export function ServicesSection({
  services,
  onSelectService,
}: ServicesSectionProps) {
  return (
    <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Tailored Transportation</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Comprehensive Bus Rental Services
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          Whether you need a full-day city coach, a high-capacity wedding entourage convoy, or a multi-day hill station tour, our fleet is ready with experienced chauffeurs.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onBookService={onSelectService}
          />
        ))}
      </div>
    </section>
  );
}
