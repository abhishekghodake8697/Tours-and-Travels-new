"use client";

import {
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { BusinessInfo } from "@/types";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

interface ContactSectionProps {
  business: BusinessInfo;
}

export function ContactSection({ business }: ContactSectionProps) {
  const waUrl = getGeneralWhatsAppUrl(business.whatsapp, business.name);

  return (
    <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Phone className="w-3.5 h-3.5" />
          <span>Get In Touch</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Ready to Rent? Contact Us 24/7
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          Our friendly travel desk is always ready to check route permits, fleet availability, and offer the best rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Contact Cards */}
        <div className="lg:col-span-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Direct Phone */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Direct Phone
              </div>
              <a
                href={`tel:${business.phone}`}
                className="text-lg font-black text-white hover:text-amber-400 block transition-colors"
              >
                {business.phone}
              </a>
              {business.phoneSecondary && (
                <a
                  href={`tel:${business.phoneSecondary}`}
                  className="text-xs text-slate-400 hover:text-white block"
                >
                  Alt: {business.phoneSecondary}
                </a>
              )}
              <a
                href={`tel:${business.phone}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline pt-2"
              >
                <span>Call Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* WhatsApp */}
            <div className="glass-panel rounded-3xl p-6 border border-emerald-400/20 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center text-emerald-400">
                <MessageCircle className="w-5 h-5 fill-emerald-400" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official WhatsApp
              </div>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-black text-emerald-400 hover:text-emerald-300 block transition-colors"
              >
                {business.whatsapp}
              </a>
              <p className="text-xs text-slate-400">
                Instant reply within 5 minutes
              </p>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:underline pt-2"
              >
                <span>WhatsApp Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Email */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-400/10 border border-sky-400/20 flex items-center justify-center text-sky-400">
                <Mail className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Corporate & Inquiries
              </div>
              <a
                href={`mailto:${business.email}`}
                className="text-sm font-bold text-white hover:text-amber-400 block truncate transition-colors"
              >
                {business.email}
              </a>
              <p className="text-xs text-slate-400">
                For GST quotations and contracts
              </p>
            </div>

            {/* Working Hours */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-400/10 border border-purple-400/20 flex items-center justify-center text-purple-400">
                <Clock className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Operating Hours
              </div>
              <div className="text-sm font-bold text-white">
                {business.workingHours}
              </div>
              <p className="text-xs text-slate-400">
                Round-the-clock highway support
              </p>
            </div>
          </div>

          {/* Physical Address */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 shrink-0 mt-1">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Office & Fleet Depot
              </div>
              <div className="text-sm font-bold text-white">
                {business.address}, {business.city}, {business.state} - {business.pincode}
              </div>
              <div className="pt-2">
                <a
                  href={business.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:underline"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Map & Direct Action Box */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <h3 className="text-lg font-black text-white">
              Visit or Locate Our Garage
            </h3>
            {/* Interactive Map Embed */}
            <div className="h-64 w-full rounded-2xl overflow-hidden border border-white/10 relative">
              <iframe
                title="Office Location Map"
                src="https://maps.google.com/maps?q=Bengaluru&t=&z=12&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <a
                href={`tel:${business.phone}`}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Now</span>
              </a>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-lg shadow-emerald-500/20 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>WhatsApp Now</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
