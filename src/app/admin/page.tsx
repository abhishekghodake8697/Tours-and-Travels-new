import Link from "next/link";
import {
  Bus,
  Tag,
  Image as ImageIcon,
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { repository } from "@/lib/repository";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const [business, rates, fleet, gallery, enquiries] = await Promise.all([
    repository.getBusinessInfo(),
    repository.getRates(),
    repository.getFleet(),
    repository.getGallery(),
    repository.getEnquiries(),
  ]);

  const activeBuses = fleet.filter((b) => b.isActive).length;
  const recentEnquiries = enquiries.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Welcome back! Monitor your live fleet, update pricing, and review recent bookings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/rates"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all hover:scale-[1.02]"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Update Rates</span>
          </Link>
          <Link
            href="/admin/fleet"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all"
          >
            <Bus className="w-3.5 h-3.5 text-amber-400" />
            <span>Manage Fleet</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Total Fleet */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Fleet Size
            </span>
            <div className="p-2 rounded-xl bg-amber-400/10 text-amber-400">
              <Bus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {fleet.length}{" "}
            <span className="text-xs font-medium text-emerald-400">
              ({activeBuses} Active)
            </span>
          </div>
          <Link
            href="/admin/fleet"
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 pt-1"
          >
            <span>View all buses</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Card 2: Day Package Rate */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Day Package Rate
            </span>
            <div className="p-2 rounded-xl bg-emerald-400/10 text-emerald-400">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            ₹{rates.dayPackagePrice.toLocaleString("en-IN")}
          </div>
          <div className="text-xs text-slate-400">
            Up to {rates.dayPackageKmLimit} KM (Extra: ₹{rates.extraKmRate}/km)
          </div>
        </div>

        {/* Card 3: Per KM Rate */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Per-KM Rate
            </span>
            <div className="p-2 rounded-xl bg-sky-400/10 text-sky-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            ₹{rates.perKmRate}{" "}
            <span className="text-xs font-normal text-slate-400">/ KM</span>
          </div>
          <div className="text-xs text-slate-400">
            Min {rates.perKmMinDistance} KM / Day (Driver: ₹{rates.driverAllowancePerDay})
          </div>
        </div>

        {/* Card 4: Gallery Items */}
        <div className="glass-panel rounded-2xl p-5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">
              Travel Photos
            </span>
            <div className="p-2 rounded-xl bg-purple-400/10 text-purple-400">
              <ImageIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">
            {gallery.length}
          </div>
          <Link
            href="/admin/gallery"
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 pt-1"
          >
            <span>Manage photo gallery</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Recent Leads + Quick Business Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Recent Customer Enquiries */}
        <div className="lg:col-span-8 glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 font-extrabold text-base text-white">
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Recent Customer Inquiries ({enquiries.length} Total)</span>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No inquiries yet. Test the website form to see leads populate here!
            </div>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <div
                  key={enq.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-white/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-white">{enq.name}</strong>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          enq.status === "new"
                            ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                            : enq.status === "contacted"
                            ? "bg-sky-400/20 text-sky-300 border border-sky-400/30"
                            : "bg-emerald-400/20 text-emerald-300 border border-emerald-400/30"
                        }`}
                      >
                        {enq.status}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span>📞 {enq.phone}</span>
                      <span>📅 {enq.travelDate}</span>
                      <span>🚌 {enq.busType}</span>
                    </div>

                    <div className="text-xs text-slate-400">
                      📍 {enq.pickupLocation} ➔ {enq.destination}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                        `Hello ${enq.name}, thank you for your bus rental enquiry with ${business.name}. We would love to assist you with the booking!`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="WhatsApp Customer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span className="hidden sm:inline">WhatsApp</span>
                    </a>

                    <a
                      href={`tel:${enq.phone}`}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Call Customer"
                    >
                      <Phone className="w-3.5 h-3.5 text-amber-400" />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Business Contacts & Quick Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                Business Information
              </span>
              <Link
                href="/admin/business"
                className="text-xs text-slate-400 hover:text-white"
              >
                Edit info
              </Link>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block">Company Name:</span>
                <span className="font-bold text-white text-sm">
                  {business.name}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">Primary Phone:</span>
                <span className="font-bold text-amber-400">{business.phone}</span>
              </div>

              <div>
                <span className="text-slate-400 block">WhatsApp Number:</span>
                <span className="font-bold text-emerald-400">
                  {business.whatsapp}
                </span>
              </div>

              <div>
                <span className="text-slate-400 block">Email Address:</span>
                <span className="font-bold text-slate-200">{business.email}</span>
              </div>

              <div>
                <span className="text-slate-400 block">Office Depot:</span>
                <span>
                  {business.address}, {business.city}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/admin/business"
                className="flex items-center justify-center w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
              >
                <span>Edit Business & Contact Info</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
