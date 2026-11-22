"use client";

import { Phone, MessageCircle, Send } from "lucide-react";
import { BusinessInfo } from "@/types";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

interface MobileBottomBarProps {
  business: BusinessInfo;
}

export function MobileBottomBar({ business }: MobileBottomBarProps) {
  const waUrl = getGeneralWhatsAppUrl(business.whatsapp, business.name);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-slate-950/95 backdrop-blur-xl border-t border-white/10 px-4 py-2.5 shadow-2xl">
      <div className="grid grid-cols-3 gap-2">
        {/* Call Button */}
        <a
          href={`tel:${business.phone}`}
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 active:bg-slate-800 transition-colors"
        >
          <Phone className="w-4 h-4 text-amber-400 mb-0.5" />
          <span className="text-[11px] font-bold">Call</span>
        </a>

        {/* WhatsApp Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-emerald-500 text-slate-950 active:bg-emerald-400 shadow-md shadow-emerald-500/20 font-black transition-colors"
        >
          <MessageCircle className="w-4 h-4 fill-slate-950 mb-0.5" />
          <span className="text-[11px]">WhatsApp</span>
        </a>

        {/* Get Quote Button */}
        <a
          href="#enquiry"
          className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-amber-400 text-slate-950 active:bg-amber-300 shadow-md shadow-amber-400/20 font-black transition-colors"
        >
          <Send className="w-4 h-4 text-slate-950 mb-0.5" />
          <span className="text-[11px]">Get Quote</span>
        </a>
      </div>
    </div>
  );
}
