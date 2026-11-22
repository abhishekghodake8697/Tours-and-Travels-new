"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Menu,
  X,
  Bus,
  ChevronRight,
  Lock,
} from "lucide-react";
import { BusinessInfo } from "@/types";
import { getGeneralWhatsAppUrl } from "@/lib/whatsapp";

interface NavbarProps {
  business: BusinessInfo;
}

export function Navbar({ business }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Our Fleet", href: "#fleet" },
    { name: "Services", href: "#services" },
    { name: "Rate Card", href: "#rates" },
    { name: "Gallery", href: "#gallery" },
    { name: "About Us", href: "#about" },
    { name: "Why Us", href: "#why-us" },
    { name: "Contact", href: "#contact" },
  ];

  const waUrl = getGeneralWhatsAppUrl(business.whatsapp, business.name);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[#0b132b]/90 backdrop-blur-md border-b border-white/10 shadow-xl py-3"
            : "bg-gradient-to-b from-[#0b132b]/80 via-[#0b132b]/40 to-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            {/* Logo & Business Name */}
            <Link
              href="/"
              className="flex items-center gap-3 group focus:outline-none shrink-0"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
                <Bus className="w-6 h-6 text-slate-950" />
              </div>
              <div>
                <span className="text-base lg:text-lg xl:text-xl font-extrabold tracking-tight text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5 whitespace-nowrap">
                  {business.name}
                </span>
                <span className="hidden 2xl:block text-xs text-slate-400 font-medium tracking-wide whitespace-nowrap">
                  {business.tagline}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation — centred */}
            <nav className="hidden lg:flex flex-1 items-center justify-center gap-0.5 xl:gap-1 flex-nowrap">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="px-2 xl:px-3 py-2 text-xs xl:text-sm font-medium text-slate-300 hover:text-amber-400 hover:bg-white/5 rounded-lg transition-all whitespace-nowrap"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Admin icon only */}
            <div className="hidden lg:flex items-center shrink-0">
              <Link
                href="/admin"
                className="h-10 w-10 inline-flex items-center justify-center text-slate-400 hover:text-amber-400 hover:bg-white/5 rounded-xl transition-all"
                title="Admin Portal"
              >
                <Lock className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-emerald-400 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:text-white bg-slate-800/80 rounded-xl border border-slate-700"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-slate-950/90 backdrop-blur-xl pt-24 px-6 pb-12 flex flex-col justify-between overflow-y-auto animate-in fade-in duration-200">
          <div className="space-y-3">
            <div className="pb-3 border-b border-white/10">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                Navigation
              </span>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-3 text-lg font-medium text-slate-200 hover:text-amber-400 border-b border-white/5"
              >
                <span>{link.name}</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </a>
            ))}
          </div>

          <div className="mt-8 space-y-3 pt-6 border-t border-white/10">
            <a
              href={`tel:${business.phone}`}
              className="flex items-center justify-center gap-2 w-full py-3.5 text-slate-100 font-semibold bg-slate-800 rounded-xl border border-slate-700 text-sm"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Call: {business.phone}</span>
            </a>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 text-slate-950 font-bold bg-emerald-400 hover:bg-emerald-300 rounded-xl text-sm shadow-lg shadow-emerald-500/20"
            >
              <MessageCircle className="w-4 h-4 fill-slate-950" />
              <span>Chat on WhatsApp</span>
            </a>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-slate-400 hover:text-amber-400 text-xs text-center"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin Portal Login</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
