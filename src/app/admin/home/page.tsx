"use client";

import { useState, useEffect } from "react";
import {
  Home,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Plus,
  Trash2,
} from "lucide-react";
import { HomeContent } from "@/types";

export default function AdminHomePage() {
  const [content, setContent] = useState<HomeContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/home");
      const data = await res.json();
      setContent(data);
    } catch {
      setMessage({ type: "error", text: "Failed to load home content." });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });

      if (!res.ok) throw new Error("Failed to save home content");

      setMessage({
        type: "success",
        text: "Home page copy and selling points updated successfully!",
      });
    } catch (err: any) {
      setMessage({
        type: "error",
        text: err.message || "Failed to update home content",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
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
            <Home className="w-6 h-6 text-amber-400" />
            <span>Home Page Content & Selling Points</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Customize the hero banner headlines, badges, primary & secondary button text, and Why Choose Us highlights.
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
              <span>Save Home Content</span>
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
        {/* Section 1: Hero Section Copy */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Hero Banner Copy & Calls to Action</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Highlight Pill Badge
            </label>
            <input
              type="text"
              value={content.heroHighlightBadge}
              onChange={(e) =>
                setContent({ ...content, heroHighlightBadge: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-amber-300 font-semibold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Main Hero Headline *
            </label>
            <input
              type="text"
              required
              value={content.heroHeadline}
              onChange={(e) =>
                setContent({ ...content, heroHeadline: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white font-bold focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
              Supporting Sub-headline Description *
            </label>
            <textarea
              rows={3}
              required
              value={content.heroSubheadline}
              onChange={(e) =>
                setContent({ ...content, heroSubheadline: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Primary Button Text
              </label>
              <input
                type="text"
                value={content.primaryCtaText}
                onChange={(e) =>
                  setContent({ ...content, primaryCtaText: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase mb-1.5">
                Secondary Button Text (WhatsApp)
              </label>
              <input
                type="text"
                value={content.secondaryCtaText}
                onChange={(e) =>
                  setContent({ ...content, secondaryCtaText: e.target.value })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Why Choose Us Selling Points */}
        <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">
              Why Choose Us Selling Points ({content.whyChooseUs.length} Points)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {content.whyChooseUs.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-amber-400 uppercase">
                    Point #{idx + 1} ({item.icon})
                  </span>
                </div>

                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...content.whyChooseUs];
                    updated[idx].title = e.target.value;
                    setContent({ ...content, whyChooseUs: updated });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none"
                />

                <textarea
                  rows={2}
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...content.whyChooseUs];
                    updated[idx].description = e.target.value;
                    setContent({ ...content, whyChooseUs: updated });
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-xl shadow-amber-400/20 transition-all hover:scale-[1.01]"
          >
            {saving ? "Saving Changes..." : "Save All Home Copy"}
          </button>
        </div>
      </form>
    </div>
  );
}
