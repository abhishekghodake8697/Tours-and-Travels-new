"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Bus as BusIcon,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertCircle,
  X,
  Sparkles,
  Users,
  Wind,
  Luggage,
} from "lucide-react";
import { Bus } from "@/types";

export default function AdminFleetPage() {
  const [fleet, setFleet] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [editingBus, setEditingBus] = useState<Bus | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Bus>>({
    name: "",
    category: "standard",
    seatingCapacity: 32,
    isAc: true,
    features: [
      "Reclining Push-Back Seats",
      "Chilled Air Conditioning",
      "High-Def TV & Surround Audio",
      "Overhead & Underfloor Luggage",
      "Experienced Driver Included",
    ],
    luggageCapacity: "25-30 Suitcases",
    driverIncluded: true,
    isActive: true,
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    description: "Comfortable and spacious coach for group excursions.",
    badge: "Popular Choice",
    customPerKmRate: 26,
    customDayPackagePrice: 6499,
  });

  const [featuresInput, setFeaturesInput] = useState("");

  useEffect(() => {
    loadFleet();
  }, []);

  const loadFleet = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/fleet");
      const data = await res.json();
      setFleet(data);
    } catch {
      setErrorMsg("Failed to load fleet.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingBus(null);
    setFormData({
      name: "",
      category: "standard",
      seatingCapacity: 32,
      isAc: true,
      features: [
        "Reclining Push-Back Seats",
        "Chilled Air Conditioning",
        "High-Def TV & Surround Audio",
        "Spacious Luggage Boot",
        "Experienced Driver Included",
      ],
      luggageCapacity: "25-30 Suitcases",
      driverIncluded: true,
      isActive: true,
      image:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
      description: "Comfortable and spacious coach for group excursions.",
      badge: "Popular Choice",
      customPerKmRate: 26,
      customDayPackagePrice: 6499,
    });
    setFeaturesInput(
      "Reclining Push-Back Seats, Chilled Air Conditioning, High-Def TV & Surround Audio, Spacious Luggage Boot, Experienced Driver Included"
    );
    setModalOpen(true);
  };

  const handleOpenEditModal = (bus: Bus) => {
    setEditingBus(bus);
    setFormData(bus);
    setFeaturesInput(bus.features.join(", "));
    setModalOpen(true);
  };

  const handleSaveBus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.seatingCapacity) return;
    setSaving(true);
    setErrorMsg(null);

    const parsedFeatures = featuresInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const busPayload: Bus = {
      id: editingBus ? editingBus.id : `bus-${Date.now()}`,
      name: formData.name!,
      category: formData.category || "standard",
      seatingCapacity: Number(formData.seatingCapacity),
      isAc: !!formData.isAc,
      features: parsedFeatures.length > 0 ? parsedFeatures : ["Air Conditioned"],
      luggageCapacity: formData.luggageCapacity || "Standard Luggage",
      driverIncluded: true,
      isActive: formData.isActive ?? true,
      image:
        formData.image ||
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
      description: formData.description || "",
      badge: formData.badge || "",
      customPerKmRate: formData.customPerKmRate
        ? Number(formData.customPerKmRate)
        : undefined,
      customDayPackagePrice: formData.customDayPackagePrice
        ? Number(formData.customDayPackagePrice)
        : undefined,
    };

    try {
      const method = editingBus ? "PUT" : "POST";
      const res = await fetch("/api/admin/fleet", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(busPayload),
      });

      if (!res.ok) throw new Error("Failed to save bus");

      await loadFleet();
      setModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save bus");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBus = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/fleet?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFleet(fleet.filter((b) => b.id !== id));
        setDeleteConfirmId(null);
      }
    } catch {
      setErrorMsg("Failed to delete bus");
    }
  };

  const handleToggleActive = async (bus: Bus) => {
    const updated = { ...bus, isActive: !bus.isActive };
    try {
      await fetch("/api/admin/fleet", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      setFleet(fleet.map((b) => (b.id === bus.id ? updated : b)));
    } catch {
      setErrorMsg("Failed to update status");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <BusIcon className="w-6 h-6 text-amber-400" />
            <span>Fleet Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Add new coaches, configure seating capacity, features, AC status, and toggle availability.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Bus</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Fleet Cards Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fleet.map((bus) => (
            <div
              key={bus.id}
              className={`glass-panel rounded-3xl overflow-hidden border transition-all ${
                bus.isActive
                  ? "border-white/10 hover:border-amber-400/40"
                  : "border-slate-800 opacity-60"
              }`}
            >
              {/* Bus Image */}
              <div className="relative h-48 w-full bg-slate-900">
                <Image
                  src={bus.image}
                  alt={bus.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      bus.isActive
                        ? "bg-emerald-500/90 text-slate-950"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {bus.isActive ? "Active / Available" : "Inactive / Off-duty"}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-full bg-slate-950/80 text-white text-[10px] font-bold">
                    {bus.isAc ? "AC" : "Non-AC"}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-white text-base">
                    {bus.name}
                  </h3>
                  {bus.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 shrink-0">
                      {bus.badge}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 py-2 border-y border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>{bus.seatingCapacity} Seats</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Luggage className="w-3.5 h-3.5 text-amber-400" />
                    <span className="truncate">{bus.luggageCapacity}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {bus.description}
                </p>

                {/* Rates */}
                <div className="text-xs text-slate-300">
                  <span className="text-slate-400">Rate: </span>
                  <strong className="text-white">
                    ₹{bus.customDayPackagePrice || 5999} / Day (250 KM)
                  </strong>{" "}
                  • ₹{bus.customPerKmRate || 24}/KM
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleActive(bus)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                      bus.isActive
                        ? "text-slate-400 hover:text-white bg-white/5"
                        : "text-emerald-400 bg-emerald-500/10"
                    }`}
                  >
                    {bus.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(bus)}
                      className="p-1.5 text-slate-300 hover:text-amber-400 hover:bg-white/5 rounded-lg"
                      title="Edit Bus"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteConfirmId(bus.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg"
                      title="Delete Bus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full glass-panel rounded-3xl p-6 border border-white/10 space-y-4 animate-in zoom-in-95">
            <h3 className="text-lg font-bold text-white">Delete Bus?</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove this bus from your fleet showcase? This action will remove it from the public website immediately.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteBus(deleteConfirmId)}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Bus Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-2xl w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6 my-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">
                {editingBus ? "Edit Bus Details" : "Add New Bus to Fleet"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBus} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Bus Name / Model *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 32-Seater Luxury AC Coach"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.category || "standard"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="mini">Mini Coach (17-26 Seats)</option>
                    <option value="standard">Standard AC (32-40 Seats)</option>
                    <option value="luxury">Luxury Cruiser (45-55 Seats)</option>
                    <option value="sleeper">Sleeper / Semi-Sleeper</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Seating Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.seatingCapacity || 32}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seatingCapacity: parseInt(e.target.value, 10) || 0,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Luggage Capacity
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 25-30 Suitcases"
                    value={formData.luggageCapacity || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        luggageCapacity: e.target.value,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Fixed Day Package (₹ / 250 KM)
                  </label>
                  <input
                    type="number"
                    value={formData.customDayPackagePrice || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customDayPackagePrice:
                          parseInt(e.target.value, 10) || undefined,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Per KM Rate (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.customPerKmRate || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customPerKmRate:
                          parseInt(e.target.value, 10) || undefined,
                      })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Bus Image URL (Unsplash or Local Path) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Features (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="Push-Back Seats, Chilled AC, LED TV, Charging Ports, Driver Included"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Description / Suitable For
                </label>
                <textarea
                  rows={2}
                  placeholder="Ideal for wedding entourages, corporate offsites, and pilgrimage tours..."
                  value={formData.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAc}
                    onChange={(e) =>
                      setFormData({ ...formData, isAc: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400"
                  />
                  <span className="text-xs font-bold text-slate-200">
                    Air Conditioned (AC)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-amber-400 focus:ring-amber-400"
                  />
                  <span className="text-xs font-bold text-slate-200">
                    Active on Website
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg transition-all"
                >
                  {saving ? "Saving..." : "Save Bus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
