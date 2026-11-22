"use client";

import {
  MapPin,
  Navigation,
  HeartHandshake,
  Briefcase,
  Users,
  GraduationCap,
  Compass,
  Sun,
  Check,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { ServiceItem } from "@/types";

const iconMap: Record<string, any> = {
  MapPin,
  Navigation,
  HeartHandshake,
  Briefcase,
  Users,
  GraduationCap,
  Compass,
  Sun,
};

interface ServiceCardProps {
  service: ServiceItem;
  onBookService?: (serviceTitle: string) => void;
}

export function ServiceCard({ service, onBookService }: ServiceCardProps) {
  const IconComponent = iconMap[service.icon] || Compass;

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between group">
      <div>
        {/* Top Icon */}
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 mb-5 group-hover:scale-110 transition-transform">
          <IconComponent className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-black text-white group-hover:text-amber-400 transition-colors">
          {service.title}
        </h3>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          {service.shortDescription}
        </p>

        {/* Highlights */}
        {service.highlights && service.highlights.length > 0 && (
          <ul className="mt-4 space-y-1.5 border-t border-white/5 pt-4">
            {service.highlights.slice(0, 3).map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-300"
              >
                <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {service.idealFor && (
          <div className="mt-4 p-2.5 rounded-xl bg-white/5 text-[11px] text-slate-400 border border-white/5">
            <strong className="text-slate-300">Ideal for: </strong>
            {service.idealFor}
          </div>
        )}
      </div>

      <div className="pt-5 border-t border-white/10 mt-5">
        <a
          href="#enquiry"
          onClick={() => onBookService?.(service.title)}
          className="flex items-center justify-between w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-200 text-xs font-bold transition-all group/btn"
        >
          <span>Enquire for {service.title}</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}
