"use client";

import { useState } from "react";
import {
  Calculator,
  Compass,
  MessageCircle,
  HelpCircle,
  AlertCircle,
  Sparkles,
  Check,
  ChevronRight,
  TrendingDown,
} from "lucide-react";
import { RateConfig, Bus, BusinessInfo } from "@/types";
import { calculateTripFares } from "@/lib/calculator";
import { getCalculatorWhatsAppUrl } from "@/lib/whatsapp";

interface FareCalculatorProps {
  rates: RateConfig;
  buses: Bus[];
  business: BusinessInfo;
}

export function FareCalculator({
  rates,
  buses,
  business,
}: FareCalculatorProps) {
  const [distanceKm, setDistanceKm] = useState<number>(300);
  const [selectedModel, setSelectedModel] = useState<"day_package" | "per_km">(
    "day_package"
  );
  const [selectedBusId, setSelectedBusId] = useState<string>("all");

  const selectedBus = buses.find((b) => b.id === selectedBusId);

  const customPerKm = selectedBus?.customPerKmRate;
  const customDayPackage = selectedBus?.customDayPackagePrice;

  const calculation = calculateTripFares(
    distanceKm,
    rates,
    customPerKm,
    customDayPackage
  );

  const presets = [100, 180, 300, 400, 500];

  const estimatedTotal =
    selectedModel === "day_package"
      ? calculation.dayPackage.estimatedTotal
      : calculation.perKm.estimatedTotal;

  const waEstimateUrl = getCalculatorWhatsAppUrl(
    business.whatsapp,
    distanceKm,
    selectedModel,
    estimatedTotal,
    selectedBus?.name
  );

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8 lg:p-10 border border-amber-400/20 shadow-2xl relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Calculator className="w-3.5 h-3.5" />
            <span>Interactive Fare Estimator</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            Plan Your Journey Cost
          </h3>
          <p className="text-sm text-slate-300 mt-1">
            Slide the distance or enter your kilometers to view instant transparent estimates for both pricing models.
          </p>
        </div>

        {/* Bus Model Selector */}
        <div className="shrink-0">
          <label className="block text-xs font-semibold text-slate-400 mb-1.5">
            Select Bus Category (Optional)
          </label>
          <select
            value={selectedBusId}
            onChange={(e) => setSelectedBusId(e.target.value)}
            className="w-full sm:w-auto bg-slate-800 text-white border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-medium focus:ring-2 focus:ring-amber-400 focus:outline-none"
          >
            <option value="all">Standard Fleet Average</option>
            {buses
              .filter((b) => b.isActive)
              .map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.name} ({bus.seatingCapacity} Seats)
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Distance Slider & Inputs */}
      <div className="py-6 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Compass className="w-4 h-4 text-amber-400" />
            <span>Approximate Trip Distance (Round-trip / Garage-to-Garage)</span>
          </label>
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-amber-400/30 px-3.5 py-1.5 rounded-xl">
            <input
              type="number"
              min={10}
              max={1500}
              value={distanceKm}
              onChange={(e) =>
                setDistanceKm(Math.max(10, parseInt(e.target.value, 10) || 10))
              }
              className="w-20 bg-transparent text-xl font-black text-amber-400 text-right focus:outline-none"
            />
            <span className="text-xs font-bold text-slate-400">KM</span>
          </div>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min={20}
          max={600}
          step={5}
          value={distanceKm}
          onChange={(e) => setDistanceKm(parseInt(e.target.value, 10))}
          className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
        />

        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-slate-400 mr-1">Quick Select:</span>
          {presets.map((preset) => (
            <button
              key={preset}
              onClick={() => setDistanceKm(preset)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                distanceKm === preset
                  ? "bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20"
                  : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 border border-slate-700"
              }`}
            >
              {preset} KM {preset === 300 && "⭐ (Day Tour Limit)"}
            </button>
          ))}
        </div>
      </div>

      {/* Pricing Models Comparison Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Model 1: Fixed Day Package */}
        <div
          onClick={() => setSelectedModel("day_package")}
          className={`relative p-5 rounded-2xl cursor-pointer transition-all border ${
            selectedModel === "day_package"
              ? "bg-slate-800/90 border-amber-400 shadow-xl shadow-amber-500/10"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          {distanceKm <= rates.dayPackageKmLimit && (
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 shadow-md">
              <TrendingDown className="w-3 h-3" />
              Best Value for &lt;= 300 KM
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  selectedModel === "day_package"
                    ? "bg-amber-400 border-amber-400 text-slate-950"
                    : "border-slate-600"
                }`}
              >
                {selectedModel === "day_package" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <h4 className="font-extrabold text-white text-base">
                Fixed Day Package
              </h4>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-amber-300 font-semibold">
              Up to 300 KM & 12 Hrs
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300 pb-3 border-b border-white/5">
            <div className="flex justify-between">
              <span>Base Day Package (300 KM):</span>
              <span className="font-bold text-white">
                ₹{calculation.dayPackage.basePackagePrice.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Driver Allowance:</span>
              <span className="text-emerald-400 font-semibold">Included</span>
            </div>
            {calculation.dayPackage.extraKm > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Extra KM ({calculation.dayPackage.extraKm} KM @ ₹{calculation.dayPackage.extraKmRate}/km):</span>
                <span className="font-bold">
                  +₹{calculation.dayPackage.extraKmCost.toLocaleString("en-IN")}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-baseline justify-between pt-3">
            <span className="text-xs text-slate-400 font-medium">
              Estimated Total
            </span>
            <span className="text-2xl font-black text-white">
              ₹{calculation.dayPackage.estimatedTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Model 2: Per KM Rate */}
        <div
          onClick={() => setSelectedModel("per_km")}
          className={`relative p-5 rounded-2xl cursor-pointer transition-all border ${
            selectedModel === "per_km"
              ? "bg-slate-800/90 border-amber-400 shadow-xl shadow-amber-500/10"
              : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                  selectedModel === "per_km"
                    ? "bg-amber-400 border-amber-400 text-slate-950"
                    : "border-slate-600"
                }`}
              >
                {selectedModel === "per_km" && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
              <h4 className="font-extrabold text-white text-base">
                Per-KM Billing Model
              </h4>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-slate-300 font-semibold">
              Min {rates.perKmMinDistance} KM / Day
            </span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300 pb-3 border-b border-white/5">
            <div className="flex justify-between">
              <span>Rate per KM:</span>
              <span className="font-bold text-white">₹{calculation.perKm.ratePerKm} / KM</span>
            </div>
            <div className="flex justify-between">
              <span>Billable Distance:</span>
              <span>
                {calculation.perKm.billableKm} KM{" "}
                {calculation.perKm.minApplied && (
                  <span className="text-amber-400 text-[10px]">(Min applied)</span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Driver Allowance:</span>
              <span className="font-semibold text-slate-200">
                +₹{calculation.perKm.driverAllowance}
              </span>
            </div>
          </div>

          <div className="flex items-baseline justify-between pt-3">
            <span className="text-xs text-slate-400 font-medium">
              Estimated Total
            </span>
            <span className="text-2xl font-black text-white">
              ₹{calculation.perKm.estimatedTotal.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* Selected Total & Booking Call to Action */}
      <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-400/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
            Estimated Quote for {distanceKm} KM ({selectedModel === "day_package" ? "Fixed Day Package" : "Per-KM Model"})
          </div>
          <div className="text-3xl font-black text-white flex items-center justify-center sm:justify-start gap-2">
            <span>₹{estimatedTotal.toLocaleString("en-IN")}</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              Driver Included
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>Tolls, parking, and state permits are billed on actuals. Not a legally binding quote until dates are confirmed.</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto shrink-0">
          <a
            href={waEstimateUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4 fill-slate-950" />
            <span>Book Quote on WhatsApp</span>
          </a>

          <a
            href="#enquiry"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-5 py-3.5 text-sm font-bold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl transition-all"
          >
            <span>Fill Detailed Enquiry</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
