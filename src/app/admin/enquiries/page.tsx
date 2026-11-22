"use client";

import { useState, useEffect } from "react";
import {
  MessageSquare,
  Phone,
  MessageCircle,
  Trash2,
  CheckCircle2,
  Clock,
  Filter,
  Loader2,
  Calendar,
  MapPin,
  Users,
  Bus as BusIcon,
  Compass,
} from "lucide-react";
import { Enquiry } from "@/types";

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    loadEnquiries();
  }, []);

  const loadEnquiries = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/enquiries");
      const data = await res.json();
      setEnquiries(data);
    } catch {
      setErrorMsg("Failed to load customer enquiries.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Enquiry["status"]) => {
    try {
      const res = await fetch("/api/admin/enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        setEnquiries(
          enquiries.map((e) => (e.id === id ? { ...e, status } : e))
        );
      }
    } catch {
      setErrorMsg("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this inquiry record?")) return;
    try {
      const res = await fetch(
        `/api/admin/enquiries?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setEnquiries(enquiries.filter((e) => e.id !== id));
      }
    } catch {
      setErrorMsg("Failed to delete enquiry");
    }
  };

  const filtered =
    filter === "all"
      ? enquiries
      : enquiries.filter((e) => e.status === filter);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-amber-400" />
            <span>Customer Booking Leads ({enquiries.length})</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review quote requests, contact clients directly on WhatsApp, and manage booking progress.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {["all", "new", "contacted", "booked", "cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === st
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center text-slate-400 text-sm">
          No customer inquiries found for the selected filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((enq) => {
            const cleanPhone = enq.phone.replace(/[^0-9]/g, "");
            const waReplyUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hello ${enq.name}, thank you for your bus rental enquiry regarding your journey to ${enq.destination} on ${enq.travelDate}. We have prepared your quotation!`
            )}`;

            return (
              <div
                key={enq.id}
                className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4 hover:border-amber-400/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center font-bold text-amber-400">
                      {enq.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-white text-base">
                        {enq.name}
                      </h3>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span>Submitted: {new Date(enq.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400">Status:</span>
                    <select
                      value={enq.status}
                      onChange={(e) =>
                        handleStatusChange(enq.id, e.target.value as any)
                      }
                      className="bg-slate-900 border border-slate-700 text-xs font-bold rounded-xl px-3 py-1.5 text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="new">🟡 New Inquiry</option>
                      <option value="contacted">🔵 Contacted</option>
                      <option value="booked">🟢 Confirmed Booked</option>
                      <option value="cancelled">⚪ Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Details Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
                    <span className="text-slate-400 block">📞 Contact</span>
                    <a href={`tel:${enq.phone}`} className="font-bold text-white hover:text-amber-400">
                      {enq.phone}
                    </a>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
                    <span className="text-slate-400 block">📅 Travel Date</span>
                    <span className="font-bold text-white">{enq.travelDate}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
                    <span className="text-slate-400 block">🚌 Bus & Capacity</span>
                    <span className="font-bold text-white truncate block">
                      {enq.busType} ({enq.passengers} pax)
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
                    <span className="text-slate-400 block">🛣️ Trip Type & Distance</span>
                    <span className="font-bold text-white capitalize block">
                      {enq.tripType} {enq.approxDistanceKm ? `(~${enq.approxDistanceKm} KM)` : ""}
                    </span>
                  </div>
                </div>

                {/* Route & Notes */}
                <div className="text-xs text-slate-300 space-y-1">
                  <div>
                    <strong className="text-slate-400">Route: </strong>
                    <span className="text-white">{enq.pickupLocation}</span> ➔{" "}
                    <span className="text-amber-400 font-semibold">{enq.destination}</span>
                  </div>

                  {enq.message && (
                    <div>
                      <strong className="text-slate-400">Client Notes: </strong>
                      <span className="italic text-slate-300">{enq.message}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <a
                      href={waReplyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Reply on WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${enq.phone}`}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span>Call Client</span>
                    </a>
                  </div>

                  <button
                    onClick={() => handleDelete(enq.id)}
                    className="p-2 text-slate-400 hover:text-rose-400 rounded-xl hover:bg-rose-500/10 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
