"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Award,
} from "lucide-react";
import { BusinessInfo } from "@/types";

export default function AdminBusinessPage() {
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadBusiness();
  }, []);

  const loadBusiness = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/business");
      const data = await res.json();
      setBusiness(data);
    } catch {
      setMessage({ type: "error", text: "Failed to load business profile." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!business) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/business", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(business),
      });

      if (!res.ok) throw new Error("Failed to update business profile");

      setMessage({
        type: "success",
        text: "Business details, contact channels, and statistics updated successfully!",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update business info",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !business) {
    return (
      <div className="flex items-center justify-center min-h-[350px]">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-400" />
            <span>Business Profile & Contacts</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update company identity, phone numbers, WhatsApp link, depot address, and counter statistics.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Business Info</span>
            </>
          )}
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border border-rose-500/30 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Core Identity */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
            Brand & Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Business Name *
              </label>
              <input
                type="text"
                required
                value={business.name}
                onChange={(e) =>
                  setBusiness({ ...business, name: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Tagline *
              </label>
              <input
                type="text"
                required
                value={business.tagline}
                onChange={(e) =>
                  setBusiness({ ...business, tagline: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Short Summary (Footer & Cards)
            </label>
            <textarea
              rows={2}
              value={business.shortAbout}
              onChange={(e) =>
                setBusiness({ ...business, shortAbout: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Full About Story (About Us Section)
            </label>
            <textarea
              rows={4}
              value={business.fullAbout}
              onChange={(e) =>
                setBusiness({ ...business, fullAbout: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Section 2: Contact Channels */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <MessageCircle className="w-4 h-4 fill-emerald-400" />
            <span>Contact Channels & Conversions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Primary Phone *
              </label>
              <input
                type="text"
                required
                value={business.phone}
                onChange={(e) =>
                  setBusiness({ ...business, phone: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Secondary Phone (Optional)
              </label>
              <input
                type="text"
                value={business.phoneSecondary || ""}
                onChange={(e) =>
                  setBusiness({ ...business, phoneSecondary: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                WhatsApp Number (with country code) *
              </label>
              <input
                type="text"
                required
                placeholder="+919876543210"
                value={business.whatsapp}
                onChange={(e) =>
                  setBusiness({ ...business, whatsapp: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-emerald-400 font-bold focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Business Email *
              </label>
              <input
                type="email"
                required
                value={business.email}
                onChange={(e) =>
                  setBusiness({ ...business, email: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Operating Hours
              </label>
              <input
                type="text"
                value={business.workingHours}
                onChange={(e) =>
                  setBusiness({ ...business, workingHours: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Physical Location & Maps */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>Depot Location & Google Maps</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Street Address
              </label>
              <input
                type="text"
                value={business.address}
                onChange={(e) =>
                  setBusiness({ ...business, address: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                City
              </label>
              <input
                type="text"
                value={business.city}
                onChange={(e) =>
                  setBusiness({ ...business, city: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                State
              </label>
              <input
                type="text"
                value={business.state}
                onChange={(e) =>
                  setBusiness({ ...business, state: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Google Maps Link / Coordinates URL
              </label>
              <input
                type="url"
                value={business.googleMapsUrl}
                onChange={(e) =>
                  setBusiness({ ...business, googleMapsUrl: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Public Statistics Counters */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Award className="w-4 h-4" />
            <span>Public Website Milestone Statistics</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Buses Count
              </label>
              <input
                type="number"
                min={1}
                value={business.stats.busesCount}
                onChange={(e) =>
                  setBusiness({
                    ...business,
                    stats: {
                      ...business.stats,
                      busesCount: parseInt(e.target.value, 10) || 0,
                    },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Years of Experience
              </label>
              <input
                type="number"
                min={1}
                value={business.stats.experienceYears}
                onChange={(e) =>
                  setBusiness({
                    ...business,
                    stats: {
                      ...business.stats,
                      experienceYears: parseInt(e.target.value, 10) || 0,
                    },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Trips Completed
              </label>
              <input
                type="number"
                min={1}
                value={business.stats.tripsCompleted}
                onChange={(e) =>
                  setBusiness({
                    ...business,
                    stats: {
                      ...business.stats,
                      tripsCompleted: parseInt(e.target.value, 10) || 0,
                    },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Happy Customers
              </label>
              <input
                type="number"
                min={1}
                value={business.stats.happyCustomers}
                onChange={(e) =>
                  setBusiness({
                    ...business,
                    stats: {
                      ...business.stats,
                      happyCustomers: parseInt(e.target.value, 10) || 0,
                    },
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.01]"
          >
            {saving ? "Saving Changes..." : "Save All Business Information"}
          </button>
        </div>
      </form>
    </div>
  );
}
