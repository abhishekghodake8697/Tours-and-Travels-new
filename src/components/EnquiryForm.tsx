"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import {
  Send,
  MessageCircle,
  Calendar,
  MapPin,
  Users,
  Bus as BusIcon,
  Compass,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Phone,
  Mail,
  User,
} from "lucide-react";
import { Bus, BusinessInfo } from "@/types";
import { getEnquiryWhatsAppUrl } from "@/lib/whatsapp";

interface EnquiryFormProps {
  buses: Bus[];
  business: BusinessInfo;
  defaultSelectedBus?: string;
  defaultTripType?: string;
}

export function EnquiryForm({
  buses,
  business,
  defaultSelectedBus = "",
  defaultTripType = "outstation",
}: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    travelDate: "",
    pickupLocation: "",
    destination: "",
    passengers: 20,
    busType: defaultSelectedBus || "32-Seater Premium Luxury AC Bus",
    tripType: defaultTripType || "outstation",
    approxDistanceKm: 250,
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    whatsappUrl: string;
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Basic frontend checks
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMsg("Please enter your full name.");
      return;
    }

    if (!formData.phone.trim() || formData.phone.trim().length < 8) {
      setErrorMsg("Please enter a valid mobile number.");
      return;
    }

    if (!formData.travelDate) {
      setErrorMsg("Please select your travel date.");
      return;
    }

    if (!formData.pickupLocation.trim() || !formData.destination.trim()) {
      setErrorMsg("Please provide both pickup and destination locations.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Submission failed");
      }

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#F59E0B", "#10B981", "#3B82F6"],
        });
      } catch {
        // Safe if canvas-confetti is not loaded
      }

      setSuccessData({
        whatsappUrl: data.whatsappUrl,
        message: data.message,
      });
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit enquiry. Please try WhatsApp directly.");
    } finally {
      setLoading(false);
    }
  };

  const handleDirectWhatsApp = () => {
    const directWaUrl = getEnquiryWhatsAppUrl(business.whatsapp, {
      name: formData.name || "Traveler",
      phone: formData.phone || "Not specified",
      travelDate: formData.travelDate,
      pickupLocation: formData.pickupLocation,
      destination: formData.destination,
      passengers: formData.passengers,
      busType: formData.busType,
      tripType: formData.tripType as any,
      approxDistanceKm: formData.approxDistanceKm,
      message: formData.message,
    });
    window.open(directWaUrl, "_blank");
  };

  return (
    <section id="enquiry" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="glass-panel rounded-3xl p-6 sm:p-10 lg:p-12 border border-amber-400/30 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast Availability & Quote</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Request Your Bus Rental Quote
          </h2>
          <p className="text-sm text-slate-300">
            Tell us your journey itinerary. We will calculate the most cost-effective package (Fixed 250 KM Day Package or Per-KM) with an experienced driver.
          </p>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3 animate-in fade-in">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Modal / State */}
        {successData ? (
          <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-emerald-400/40 text-center space-y-6 max-w-2xl mx-auto animate-in zoom-in-95 duration-300 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-emerald-400/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white">
                Enquiry Successfully Received!
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {successData.message} We have dispatched your request to our operations desk.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1 text-left">
              <div><strong>Name:</strong> {formData.name}</div>
              <div><strong>Route:</strong> {formData.pickupLocation} ➔ {formData.destination}</div>
              <div><strong>Date:</strong> {formData.travelDate} ({formData.busType})</div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href={successData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-black text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                <MessageCircle className="w-4 h-4 fill-slate-950" />
                <span>Open in WhatsApp for Faster Response</span>
              </a>

              <button
                onClick={() => setSuccessData(null)}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700"
              >
                Submit Another Enquiry
              </button>
            </div>
          </div>
        ) : (
          /* Form */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  <span>Full Name *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Phone / Mobile */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mobile Number *</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Travel Date */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Travel Date *</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.travelDate}
                  onChange={(e) =>
                    setFormData({ ...formData, travelDate: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Pickup Location */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pickup City / Location *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Indiranagar, Bengaluru"
                  value={formData.pickupLocation}
                  onChange={(e) =>
                    setFormData({ ...formData, pickupLocation: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Destination *</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mysuru / Ooty / Nandi Hills"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Number of Passengers */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-amber-400" />
                  <span>Number of Passengers</span>
                </label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={formData.passengers}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      passengers: parseInt(e.target.value, 10) || 1,
                    })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Required Bus */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <BusIcon className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preferred Bus Type</span>
                </label>
                <select
                  value={formData.busType}
                  onChange={(e) =>
                    setFormData({ ...formData, busType: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                >
                  <option value="Any Suitable Bus">Any Suitable Bus</option>
                  {buses
                    .filter((b) => b.isActive)
                    .map((bus) => (
                      <option key={bus.id} value={bus.name}>
                        {bus.name} ({bus.seatingCapacity} Seats)
                      </option>
                    ))}
                </select>
              </div>

              {/* Trip Type */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-amber-400" />
                  <span>Trip Type</span>
                </label>
                <select
                  value={formData.tripType}
                  onChange={(e) =>
                    setFormData({ ...formData, tripType: e.target.value as any })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                >
                  <option value="outstation">Outstation Trip</option>
                  <option value="local">Local City Rental</option>
                  <option value="round_trip">Round-Trip Outstation</option>
                  <option value="one_way">One-Way Drop</option>
                </select>
              </div>
            </div>

            {/* Approximate Distance & Message */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Approx. Distance (KM)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 250"
                  value={formData.approxDistanceKm}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      approxDistanceKm: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Trip Notes / Special Requests (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Need multiple pickups in Indiranagar; returning next day evening."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero database lock-in. Immediate dispatch to booking desk & WhatsApp.</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDirectWhatsApp}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-sm transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-emerald-400" />
                  <span>Enquire via WhatsApp</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-400/25 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-slate-950" />
                      <span>Submit Booking Enquiry</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
