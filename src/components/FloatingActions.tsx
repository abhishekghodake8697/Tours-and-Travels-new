"use client";

import { MessageCircle, Phone } from "lucide-react";
import { BusinessInfo } from "@/types";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

interface FloatingActionsProps {
  business: BusinessInfo;
}

export function FloatingActions({ business }: FloatingActionsProps) {
  const waUrl = getGeneralWhatsAppUrl(business.whatsapp, business.name);

  return (
    <div className="fixed bottom-20 sm:bottom-8 right-5 z-40 flex flex-col gap-3">
      {/* Floating Call Button on Desktop */}
      <a
        href={`tel:${business.phone}`}
        className="hidden sm:flex items-center justify-center w-13 h-13 rounded-full bg-slate-900/90 text-amber-400 border border-amber-400/40 shadow-xl hover:scale-110 hover:bg-slate-800 transition-all group"
        title="Call Now"
        aria-label="Call Now"
      >
        <Phone className="w-5 h-5" />
      </a>

      {/* Floating WhatsApp Button with Glowing Pulse */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 text-slate-950 shadow-2xl hover:scale-110 hover:bg-emerald-400 transition-all group"
        title="Chat with us on WhatsApp"
        aria-label="Chat with us on WhatsApp"
      >
        {/* Animated Pulse Ring */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400/40 animate-ping -z-10" />
        <MessageCircle className="w-7 h-7 fill-slate-950" />
      </a>
    </div>
  );
}
