"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import { ServiceItem } from "@/types";

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ServiceItem>>({
    title: "",
    shortDescription: "",
    description: "",
    icon: "Compass",
    highlights: [],
    idealFor: "",
  });

  const [highlightsInput, setHighlightsInput] = useState("");

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setServices(data);
    } catch {
      setErrorMsg("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingService(null);
    setFormData({
      title: "",
      shortDescription: "",
      description: "",
      icon: "Compass",
      highlights: [],
      idealFor: "",
    });
    setHighlightsInput("");
    setModalOpen(true);
  };

  const handleOpenEdit = (svc: ServiceItem) => {
    setEditingService(svc);
    setFormData(svc);
    setHighlightsInput(svc.highlights ? svc.highlights.join(", ") : "");
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.shortDescription) return;
    setSaving(true);
    setErrorMsg(null);

    const highlights = highlightsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: ServiceItem = {
      id: editingService ? editingService.id : `service-${Date.now()}`,
      title: formData.title!,
      slug:
        formData.slug ||
        formData.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      shortDescription: formData.shortDescription!,
      description: formData.description || formData.shortDescription!,
      icon: formData.icon || "Compass",
      highlights,
      idealFor: formData.idealFor || "",
    };

    try {
      const method = editingService ? "PUT" : "POST";
      const res = await fetch("/api/admin/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save service");

      await loadServices();
      setModalOpen(false);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this service?")) return;
    try {
      const res = await fetch(
        `/api/admin/services?id=${encodeURIComponent(id)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setServices(services.filter((s) => s.id !== id));
      }
    } catch {
      setErrorMsg("Failed to delete service");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-amber-400" />
            <span>Rental Services Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure rental packages, descriptions, highlights, and icons for all travel categories.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add New Service</span>
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{errorMsg}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="glass-panel rounded-3xl p-5 border border-white/10 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20">
                    Icon: {svc.icon}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(svc)}
                      className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-white/5"
                      title="Edit Service"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(svc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                      title="Delete Service"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-extrabold text-white text-base">
                  {svc.title}
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {svc.shortDescription}
                </p>

                {svc.highlights && svc.highlights.length > 0 && (
                  <ul className="mt-3 space-y-1 text-xs text-slate-400">
                    {svc.highlights.slice(0, 3).map((h, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {svc.idealFor && (
                <div className="text-[11px] text-slate-400 p-2 rounded-xl bg-slate-900/60 border border-white/5">
                  <strong className="text-slate-300">Ideal for: </strong>
                  {svc.idealFor}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Service Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-lg w-full glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">
                {editingService ? "Edit Service" : "Add New Service"}
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding & Event Transportation"
                  value={formData.title || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Icon Identifier
                </label>
                <select
                  value={formData.icon || "Compass"}
                  onChange={(e) =>
                    setFormData({ ...formData, icon: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="MapPin">MapPin (Local)</option>
                  <option value="Navigation">Navigation (Outstation)</option>
                  <option value="HeartHandshake">HeartHandshake (Wedding)</option>
                  <option value="Briefcase">Briefcase (Corporate)</option>
                  <option value="Users">Users (Family)</option>
                  <option value="GraduationCap">GraduationCap (School)</option>
                  <option value="Compass">Compass (Pilgrimage)</option>
                  <option value="Sun">Sun (One-Day Package)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Concise overview for service card..."
                  value={formData.shortDescription || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Key Highlights (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="Verified Chauffeurs, 100% On-time, Clean AC Coaches"
                  value={highlightsInput}
                  onChange={(e) => setHighlightsInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Ideal For
                </label>
                <input
                  type="text"
                  placeholder="e.g. Baraat movements, reception shuttles"
                  value={formData.idealFor || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, idealFor: e.target.value })
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg"
                >
                  {saving ? "Saving..." : "Save Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
