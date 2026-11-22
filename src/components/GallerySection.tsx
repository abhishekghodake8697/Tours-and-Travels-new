"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Camera,
  MapPin,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from "lucide-react";
import { GalleryItem } from "@/types";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

export function GallerySection({ gallery }: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  const categories = [
    { label: "All Moments", value: "all" },
    { label: "Outstation Trips", value: "outstation" },
    { label: "Weddings & Baraat", value: "wedding" },
    { label: "Corporate Offsites", value: "corporate" },
    { label: "Pilgrimages", value: "pilgrimage" },
    { label: "Tour Groups", value: "tour" },
  ];

  const filteredItems =
    activeCategory === "all"
      ? gallery
      : gallery.filter((item) => item.category === activeCategory);

  const openModal = (index: number) => {
    setActiveModalIndex(index);
  };

  const closeModal = () => {
    setActiveModalIndex(null);
  };

  const nextModal = () => {
    if (activeModalIndex !== null) {
      setActiveModalIndex((activeModalIndex + 1) % filteredItems.length);
    }
  };

  const prevModal = () => {
    if (activeModalIndex !== null) {
      setActiveModalIndex(
        (activeModalIndex - 1 + filteredItems.length) % filteredItems.length
      );
    }
  };

  return (
    <section id="gallery" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Camera className="w-3.5 h-3.5" />
          <span>Past Trips & Memories</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
          Moments From the Open Road
        </h2>
        <p className="text-sm sm:text-base text-slate-300">
          A glimpse into the thousands of successful family picnics, hill station expeditions, destination weddings, and corporate offsites traveled with our fleet.
        </p>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                activeCategory === cat.value
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div
            key={item.id}
            onClick={() => openModal(idx)}
            className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer border border-white/10 hover:border-amber-400/40 transition-all duration-300 hover:shadow-2xl shadow-slate-950/50 bg-slate-900"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent group-hover:via-slate-950/60 transition-colors" />

            {/* Badges on Top */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <span className="px-3 py-1 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/10 text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                {item.date}
              </span>
              <span className="p-2 rounded-full bg-slate-950/70 text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4 text-amber-400" />
              </span>
            </div>

            {/* Bottom Info */}
            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{item.destination}</span>
              </div>
              <h3 className="text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeModalIndex !== null && filteredItems[activeModalIndex] && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200">
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-all"
            aria-label="Close image modal"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevModal}
            className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-all"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextModal}
            className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white z-50 transition-all"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full rounded-3xl overflow-hidden glass-panel border border-white/20 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="relative h-80 sm:h-[500px] w-full bg-black">
              <Image
                src={filteredItems[activeModalIndex].image}
                alt={filteredItems[activeModalIndex].title}
                fill
                className="object-contain"
              />
            </div>
            <div className="p-6 bg-slate-900/95 space-y-2">
              <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {filteredItems[activeModalIndex].destination}
                </span>
                <span>{filteredItems[activeModalIndex].date}</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                {filteredItems[activeModalIndex].title}
              </h3>
              <p className="text-sm text-slate-300">
                {filteredItems[activeModalIndex].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
