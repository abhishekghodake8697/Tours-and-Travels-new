"use client";

import { useState, useEffect } from "react";
import {
  Tag,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
  Eye,
  RefreshCw,
  Sparkles,
  Info,
} from "lucide-react";
import { RateConfig } from "@/types";

export default function AdminRatesPage() {
  const [rates, setRates] = useState<RateConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [newTerm, setNewTerm] = useState("");

  useEffect(() => {
    fetchRates();
  }, []);

  const fetchRates = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/rates");
      const data = await res.json();
      setRates(data);
    } catch {
      setMessage({ type: "error", text: "Failed to load rate settings." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rates) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/rates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rates),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");

      setMessage({
        type: "success",
        text: "Rate card updated successfully! The public website reflects these changes immediately.",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update rates.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddTerm = () => {
    if (!newTerm.trim() || !rates) return;
    setRates({
      ...rates,
      terms: [...rates.terms, newTerm.trim()],
    });
    setNewTerm("");
  };

  const handleRemoveTerm = (index: number) => {
    if (!rates) return;
    setRates({
      ...rates,
      terms: rates.terms.filter((_, i) => i !== index),
    });
  };

  if (loading || !rates) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
      </div>
    );
  }

  // Quick live demo calculation
  const sampleDistance = 250;
  const dayPackageCost =
    sampleDistance <= rates.dayPackageKmLimit
      ? rates.dayPackagePrice
      : rates.dayPackagePrice +
        (sampleDistance - rates.dayPackageKmLimit) * rates.extraKmRate;

  const perKmCost =
    Math.max(sampleDistance, rates.perKmMinDistance) * rates.perKmRate +
    rates.driverAllowancePerDay;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Tag className="w-6 h-6 text-amber-400" />
            <span>Rate & Tariff Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update Per-KM charges, Fixed 250 KM package rates, driver allowances, and policy conditions in seconds.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02] disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Rates & Publish</span>
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

      {/* Main Grid: Rate Form + Live Preview */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Editable Fields */}
        <div className="lg:col-span-8 space-y-6">
          {/* Group 1: Fixed Day Package */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Model A: Fixed Day Package (Up to 250 KM)</span>
              </h3>
              <span className="text-xs text-amber-400 font-semibold">
                Single-Day Rental
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Fixed Package Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={rates.dayPackagePrice}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      dayPackagePrice: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Package Distance Limit (KM) *
                </label>
                <input
                  type="number"
                  required
                  min={50}
                  value={rates.dayPackageKmLimit}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      dayPackageKmLimit: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Extra KM Charge (₹ / KM) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={rates.extraKmRate}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      extraKmRate: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Group 2: Per KM Rate Model */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-400" />
                <span>Model B: Per-KM Billing Model</span>
              </h3>
              <span className="text-xs text-sky-400 font-semibold">
                Multi-Day & Long Distance
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Per KM Baseline Rate (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={rates.perKmRate}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      perKmRate: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Minimum Billable Distance (KM / Day) *
                </label>
                <input
                  type="number"
                  required
                  min={50}
                  value={rates.perKmMinDistance}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      perKmMinDistance: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Group 3: Driver & Operational Allowances */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 pb-3 border-b border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Driver Allowances & Night Surcharges</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Driver Allowance Per Day (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={rates.driverAllowancePerDay}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      driverAllowancePerDay: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Night Halt / Late Driving Charge (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={rates.nightHaltCharge}
                  onChange={(e) =>
                    setRates({
                      ...rates,
                      nightHaltCharge: parseInt(e.target.value, 10) || 0,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Group 4: Terms and Conditions List */}
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <h3 className="text-base font-extrabold text-white pb-3 border-b border-white/10">
              Billing Terms & Conditions (Displayed on Public Rate Card)
            </h3>

            <div className="space-y-2">
              {rates.terms.map((term, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/80 border border-white/5"
                >
                  <input
                    type="text"
                    value={term}
                    onChange={(e) => {
                      const updated = [...rates.terms];
                      updated[idx] = e.target.value;
                      setRates({ ...rates, terms: updated });
                    }}
                    className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveTerm(idx)}
                    className="p-1 text-slate-500 hover:text-rose-400"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add New Term */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                placeholder="Add new condition/note..."
                value={newTerm}
                onChange={(e) => setNewTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTerm();
                  }
                }}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleAddTerm}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            {/* General Notes */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                Public Disclaimer Note
              </label>
              <textarea
                rows={2}
                value={rates.notes}
                onChange={(e) => setRates({ ...rates, notes: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Live Rate Card Preview */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-amber-400/30 space-y-4 sticky top-6">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                <Eye className="w-4 h-4" />
                <span>Live Public Rate Preview</span>
              </div>
              <span className="text-[10px] text-slate-400">Sample: 250 KM</span>
            </div>

            {/* Sample Day Package */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2">
              <div className="text-xs text-amber-300 font-bold uppercase">
                Fixed 250 KM Day Package
              </div>
              <div className="text-2xl font-black text-white">
                ₹{dayPackageCost.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-slate-400">
                Covers up to {rates.dayPackageKmLimit} KM • Driver Included
              </p>
            </div>

            {/* Sample Per KM */}
            <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/10 space-y-2">
              <div className="text-xs text-sky-300 font-bold uppercase">
                Per KM Model (for 250 KM)
              </div>
              <div className="text-2xl font-black text-white">
                ₹{perKmCost.toLocaleString("en-IN")}
              </div>
              <p className="text-[11px] text-slate-400">
                ₹{rates.perKmRate}/KM + ₹{rates.driverAllowancePerDay} Driver Allowance
              </p>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg transition-all"
              >
                {saving ? "Saving Changes..." : "Save All Changes"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
