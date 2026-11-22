"use client";

import Link from "next/link";
import {
  Bus,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Heart,
  Lock,
  ArrowUp,
} from "lucide-react";
import { BusinessInfo, ServiceItem } from "@/types";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

interface FooterProps {
  business: BusinessInfo;
  services: ServiceItem[];
}

export function Footer({ business, services }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const waUrl = getGeneralWhatsAppUrl(business.whatsapp, business.name);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-16 pb-24 sm:pb-16 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20">
                <Bus className="w-6 h-6 text-slate-950" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                {business.name}
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm">
              {business.shortAbout}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all"
                aria-label="WhatsApp Us"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${business.phone}`}
                className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 hover:bg-amber-400 hover:text-slate-950 transition-all"
                aria-label="Call Directly"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href={`mailto:${business.email}`}
                className="w-9 h-9 rounded-xl bg-sky-400/10 border border-sky-400/30 flex items-center justify-center text-sky-400 hover:bg-sky-400 hover:text-slate-950 transition-all"
                aria-label="Email Us"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <a href="#hero" className="hover:text-amber-400 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#fleet" className="hover:text-amber-400 transition-colors">
                  Our Fleet
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#rates" className="hover:text-amber-400 transition-colors">
                  Rate Card & Calculator
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-amber-400 transition-colors">
                  Travel Gallery
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-400 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Rental Services
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {services.slice(0, 6).map((svc) => (
                <li key={svc.id}>
                  <a
                    href="#enquiry"
                    className="hover:text-amber-400 transition-colors"
                  >
                    {svc.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Reach Us */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Head Office
            </h4>
            <div className="space-y-2 text-xs">
              <p className="text-slate-300">
                {business.address}, {business.city}, {business.state}
              </p>
              <p className="text-amber-400 font-bold">{business.phone}</p>
              <p className="text-slate-300">{business.email}</p>
              <p className="text-emerald-400 text-[11px] font-semibold">
                {business.workingHours}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div>
            © {currentYear} {business.name}. All rights reserved. Professional Driver Included with every booking.
          </div>

          <div className="flex items-center gap-6">
            <a href="#rates" className="hover:text-white transition-colors">
              Terms & Conditions
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-slate-500 hover:text-amber-400 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal</span>
            </Link>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
