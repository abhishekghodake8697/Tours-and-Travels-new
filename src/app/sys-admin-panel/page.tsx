"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle2,
  XCircle,
  UserCog,
  Lock,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";

interface AdminRecord {
  id: string;
  username: string;
  displayName: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

const SUPER_KEY_STORAGE = "sys_super_key";

export default function SysAdminPanelPage() {
  const [superKey, setSuperKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newDisplayName, setNewDisplayName] = useState("");
  const [showNewPw, setShowNewPw] = useState(false);

  // Edit modal
  const [editAdmin, setEditAdmin] = useState<AdminRecord | null>(null);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [showEditPw, setShowEditPw] = useState(false);
  const [saving, setSaving] = useState(false);

  // Toast helper
  const showToast = (msg: string, ok: boolean) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAdmins = useCallback(async (key: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/super-admin/admins", {
        headers: { "x-super-admin-key": key },
      });
      if (!res.ok) throw new Error("Unauthorized");
      const data = await res.json();
      setAdmins(data);
      setAuthenticated(true);
    } catch {
      setAuthError("Invalid super-admin key. Access denied.");
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setSuperKey(inputKey);
    await fetchAdmins(inputKey);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/super-admin/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-super-admin-key": superKey,
        },
        body: JSON.stringify({
          username: newUsername,
          password: newPassword,
          displayName: newDisplayName,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdmins((prev) => [...prev, { ...data, isActive: true }]);
      setNewUsername("");
      setNewPassword("");
      setNewDisplayName("");
      setShowCreate(false);
      showToast("Admin created successfully.", true);
    } catch (err: any) {
      showToast(err.message ?? "Failed to create admin.", false);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAdmin) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = { displayName: editDisplayName };
      if (editPassword) body.password = editPassword;

      const res = await fetch(`/api/super-admin/admins/${editAdmin.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-super-admin-key": superKey,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdmins((prev) =>
        prev.map((a) => (a.id === editAdmin.id ? { ...a, ...data } : a))
      );
      setEditAdmin(null);
      showToast("Admin updated successfully.", true);
    } catch (err: any) {
      showToast(err.message ?? "Failed to update.", false);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (admin: AdminRecord) => {
    try {
      const res = await fetch(`/api/super-admin/admins/${admin.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-super-admin-key": superKey,
        },
        body: JSON.stringify({ isActive: !admin.isActive }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdmins((prev) =>
        prev.map((a) => (a.id === admin.id ? { ...a, isActive: !admin.isActive } : a))
      );
      showToast(
        `Admin ${!admin.isActive ? "activated" : "deactivated"}.`,
        true
      );
    } catch (err: any) {
      showToast(err.message ?? "Failed to update.", false);
    }
  };

  const handleDelete = async (admin: AdminRecord) => {
    if (!confirm(`Delete admin "${admin.displayName}" (@${admin.username})? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/super-admin/admins/${admin.id}`, {
        method: "DELETE",
        headers: { "x-super-admin-key": superKey },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      showToast("Admin deleted.", true);
    } catch (err: any) {
      showToast(err.message ?? "Failed to delete.", false);
    }
  };

  // ── Auth Gate ────────────────────────────────────────────────────────────
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#060b1a] flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 mb-2">
              <ShieldCheck className="w-7 h-7 text-rose-400" />
            </div>
            <h1 className="text-2xl font-black text-white">
              System Admin Panel
            </h1>
            <p className="text-xs text-slate-400">
              Restricted access. Enter your super-admin key to continue.
            </p>
          </div>

          <form
            onSubmit={handleUnlock}
            className="bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4"
          >
            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <XCircle className="w-4 h-4 shrink-0" />
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wider">
                Super Admin Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={inputKey}
                  onChange={(e) => setInputKey(e.target.value)}
                  required
                  placeholder="Enter super-admin key..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white pr-10 focus:outline-none focus:border-rose-400"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  tabIndex={-1}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              Authenticate
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6">
            This page is not linked anywhere. Access is by direct URL only.
          </p>
        </div>
      </div>
    );
  }

  // ── Admin Panel ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#060b1a] text-slate-100 px-4 py-10">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold shadow-2xl border ${
            toast.ok
              ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
              : "bg-rose-500/20 border-rose-500/40 text-rose-300"
          }`}
        >
          {toast.ok ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <XCircle className="w-4 h-4" />
          )}
          {toast.msg}
        </div>
      )}

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
              <UserCog className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Admin Manager</h1>
              <p className="text-xs text-slate-400">
                {admins.length} admin{admins.length !== 1 ? "s" : ""} registered
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAdmins(superKey)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              New Admin
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreate && (
          <form
            onSubmit={handleCreate}
            className="bg-slate-900 border border-rose-500/20 rounded-2xl p-6 space-y-4"
          >
            <h2 className="font-extrabold text-white flex items-center gap-2 text-sm">
              <Plus className="w-4 h-4 text-rose-400" />
              Create New Admin
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Username
                </label>
                <input
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  placeholder="e.g. john.doe"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                  Display Name
                </label>
                <input
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  required
                  placeholder="e.g. John Doe"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showNewPw ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Set a strong password..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white pr-10 focus:outline-none focus:border-rose-400"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPw(!showNewPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  tabIndex={-1}
                >
                  {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm disabled:opacity-50"
              >
                {creating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Create Admin
              </button>
            </div>
          </form>
        )}

        {/* Admin List */}
        <div className="space-y-3">
          {admins.map((admin) => (
            <div
              key={admin.id}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${
                admin.isActive
                  ? "bg-slate-900 border-white/10"
                  : "bg-slate-900/50 border-white/5 opacity-60"
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                <span className="text-rose-400 font-black text-sm uppercase">
                  {admin.username[0]}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="font-bold text-white text-sm">
                  {admin.displayName}
                </div>
                <div className="text-xs text-slate-400">
                  @{admin.username} ·{" "}
                  <span className="text-slate-500">
                    {new Date(admin.createdAt).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    admin.isActive
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {admin.isActive ? "Active" : "Disabled"}
                </span>

                {/* Toggle active */}
                <button
                  onClick={() => handleToggleActive(admin)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                  title={admin.isActive ? "Disable" : "Enable"}
                >
                  {admin.isActive ? (
                    <ToggleRight className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>

                {/* Edit */}
                <button
                  onClick={() => {
                    setEditAdmin(admin);
                    setEditDisplayName(admin.displayName);
                    setEditPassword("");
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400 hover:text-amber-400 transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(admin)}
                  className="p-1.5 rounded-lg hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {admins.length === 0 && (
            <div className="text-center py-16 text-slate-500 text-sm">
              No admins found. Create one above.
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editAdmin && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl"
          >
            <h2 className="font-extrabold text-white flex items-center gap-2 text-sm">
              <Pencil className="w-4 h-4 text-amber-400" />
              Edit Admin — @{editAdmin.username}
            </h2>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                Display Name
              </label>
              <input
                value={editDisplayName}
                onChange={(e) => setEditDisplayName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">
                New Password{" "}
                <span className="normal-case font-normal text-slate-500">
                  (leave blank to keep current)
                </span>
              </label>
              <div className="relative">
                <input
                  type={showEditPw ? "text" : "password"}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="New password..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white pr-10 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowEditPw(!showEditPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  tabIndex={-1}
                >
                  {showEditPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setEditAdmin(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
