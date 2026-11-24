/**
 * GitHubRepository — stores all site data as JSON files in the GitHub repo.
 *
 * How it works:
 *  - READ:  GitHub Contents API → base64-decode → parse JSON
 *           Results are tagged with 'site-data' so Next.js caches them.
 *  - WRITE: fetch current SHA → PUT updated file → revalidateTag('site-data')
 *           The website sees fresh data on the very next request.
 *
 * Required env vars:
 *   GITHUB_TOKEN   — Personal Access Token (repo scope)
 *   GITHUB_OWNER   — your GitHub username / org
 *   GITHUB_REPO    — repository name
 *   GITHUB_BRANCH  — branch to read/write (default: main)
 */

import {
  BusinessInfo,
  RateConfig,
  Bus,
  GalleryItem,
  ServiceItem,
  HomeContent,
  Enquiry,
} from "@/types";
import { IDataRepository } from "./types";

// Compile-time fallbacks (the JSON files committed in src/data/)
import defaultBusiness from "@/data/business.json";
import defaultRates from "@/data/rates.json";
import defaultFleet from "@/data/fleet.json";
import defaultServices from "@/data/services.json";
import defaultGallery from "@/data/gallery.json";
import defaultHome from "@/data/home.json";
import defaultEnquiries from "@/data/enquiries.json";


export class GitHubRepository implements IDataRepository {
  private owner: string;
  private repo: string;
  private branch: string;
  private token: string;
  private basePath: string;

  constructor() {
    this.owner = process.env.GITHUB_OWNER ?? "";
    this.repo = process.env.GITHUB_REPO ?? "";
    this.branch = process.env.GITHUB_BRANCH ?? "main";
    this.token = process.env.GITHUB_TOKEN ?? "";
    this.basePath = "src/data";
  }

  private get apiBase() {
    return `https://api.github.com/repos/${this.owner}/${this.repo}/contents/${this.basePath}`;
  }

  private get authHeaders(): HeadersInit {
    return {
      Authorization: `Bearer ${this.token}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    };
  }

  // ── Helpers ──────────────────────────────────────────────────────────────

  /** Fetch a JSON file from GitHub (cached by Next.js with the site-data tag). */
  private async readFile<T>(filename: string, fallback: T): Promise<T> {
    if (!this.token || !this.owner || !this.repo) {
      console.warn("[GitHubRepository] Missing env vars — using local fallback.");
      return fallback;
    }

    try {
      const res = await fetch(
        `${this.apiBase}/${filename}?ref=${this.branch}`,
        {
          headers: this.authHeaders,
          next: { tags: ["site-data"] }, // Next.js cache tag
        }
      );
      if (!res.ok) return fallback;

      const { content } = await res.json();
      const decoded = Buffer.from(content, "base64").toString("utf-8");
      return JSON.parse(decoded) as T;
    } catch (err) {
      console.error(`[GitHubRepository] readFile(${filename}) failed:`, err);
      return fallback;
    }
  }

  /** Get the current SHA of a file (needed for GitHub PUT). Uses no-store. */
  private async getFileSha(filename: string): Promise<string | undefined> {
    try {
      const res = await fetch(
        `${this.apiBase}/${filename}?ref=${this.branch}`,
        {
          headers: this.authHeaders,
          cache: "no-store",
        }
      );
      if (!res.ok) return undefined;
      const data = await res.json();
      return data.sha as string;
    } catch {
      return undefined;
    }
  }

  /**
   * Write a JSON file to GitHub (creates or updates) and immediately
   * invalidates the Next.js site-data cache so the website gets fresh data.
   */
  private async writeFile<T>(filename: string, data: T): Promise<void> {
    if (!this.token || !this.owner || !this.repo) {
      throw new Error(
        "GitHubRepository: GITHUB_TOKEN, GITHUB_OWNER and GITHUB_REPO must be set."
      );
    }

    const sha = await this.getFileSha(filename);
    const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

    const body: Record<string, unknown> = {
      message: `chore: update ${filename} via admin portal`,
      content,
      branch: this.branch,
    };
    if (sha) body.sha = sha;

    const res = await fetch(`${this.apiBase}/${filename}`, {
      method: "PUT",
      headers: this.authHeaders,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`GitHub write failed for ${filename}: ${text}`);
    }

    // Bust the Next.js cache so the website reflects changes immediately.
    // revalidatePath('/', 'layout') clears all cached fetches for every page.
    try {
      const { revalidatePath } = await import("next/cache");
      revalidatePath("/", "layout");
    } catch {
      // Not in a Next.js request context (e.g., standalone scripts) — ignore.
    }
  }

  // ── Business ──────────────────────────────────────────────────────────────

  async getBusinessInfo(): Promise<BusinessInfo> {
    return this.readFile("business.json", defaultBusiness as BusinessInfo);
  }

  async updateBusinessInfo(data: Partial<BusinessInfo>): Promise<BusinessInfo> {
    const current = await this.getBusinessInfo();
    const updated: BusinessInfo = {
      ...current,
      ...data,
      stats: { ...current.stats, ...(data.stats ?? {}) },
      socialLinks: { ...current.socialLinks, ...(data.socialLinks ?? {}) },
    };
    await this.writeFile("business.json", updated);
    return updated;
  }

  // ── Rates ─────────────────────────────────────────────────────────────────

  async getRates(): Promise<RateConfig> {
    return this.readFile("rates.json", defaultRates as RateConfig);
  }

  async updateRates(data: Partial<RateConfig>): Promise<RateConfig> {
    const current = await this.getRates();
    const updated: RateConfig = { ...current, ...data };
    await this.writeFile("rates.json", updated);
    return updated;
  }

  // ── Fleet ─────────────────────────────────────────────────────────────────

  async getFleet(): Promise<Bus[]> {
    return this.readFile("fleet.json", defaultFleet as Bus[]);
  }

  async updateFleet(fleet: Bus[]): Promise<Bus[]> {
    await this.writeFile("fleet.json", fleet);
    return fleet;
  }

  async getBusById(id: string): Promise<Bus | null> {
    const fleet = await this.getFleet();
    return fleet.find((b) => b.id === id) ?? null;
  }

  async saveBus(bus: Bus): Promise<Bus> {
    const fleet = await this.getFleet();
    const idx = fleet.findIndex((b) => b.id === bus.id);
    const updated = idx >= 0
      ? fleet.map((b, i) => (i === idx ? bus : b))
      : [bus, ...fleet];
    await this.writeFile("fleet.json", updated);
    return bus;
  }

  async deleteBus(id: string): Promise<boolean> {
    const fleet = await this.getFleet();
    const filtered = fleet.filter((b) => b.id !== id);
    if (filtered.length === fleet.length) return false;
    await this.writeFile("fleet.json", filtered);
    return true;
  }

  // ── Gallery ───────────────────────────────────────────────────────────────

  async getGallery(): Promise<GalleryItem[]> {
    return this.readFile("gallery.json", defaultGallery as GalleryItem[]);
  }

  async updateGallery(gallery: GalleryItem[]): Promise<GalleryItem[]> {
    await this.writeFile("gallery.json", gallery);
    return gallery;
  }

  async saveGalleryItem(item: GalleryItem): Promise<GalleryItem> {
    const gallery = await this.getGallery();
    const idx = gallery.findIndex((g) => g.id === item.id);
    const updated = idx >= 0
      ? gallery.map((g, i) => (i === idx ? item : g))
      : [item, ...gallery];
    await this.writeFile("gallery.json", updated);
    return item;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    const gallery = await this.getGallery();
    const filtered = gallery.filter((g) => g.id !== id);
    if (filtered.length === gallery.length) return false;
    await this.writeFile("gallery.json", filtered);
    return true;
  }

  // ── Services ──────────────────────────────────────────────────────────────

  async getServices(): Promise<ServiceItem[]> {
    return this.readFile("services.json", defaultServices as ServiceItem[]);
  }

  async updateServices(services: ServiceItem[]): Promise<ServiceItem[]> {
    await this.writeFile("services.json", services);
    return services;
  }

  async saveService(service: ServiceItem): Promise<ServiceItem> {
    const services = await this.getServices();
    const idx = services.findIndex((s) => s.id === service.id);
    const updated = idx >= 0
      ? services.map((s, i) => (i === idx ? service : s))
      : [...services, service];
    await this.writeFile("services.json", updated);
    return service;
  }

  async deleteService(id: string): Promise<boolean> {
    const services = await this.getServices();
    const filtered = services.filter((s) => s.id !== id);
    if (filtered.length === services.length) return false;
    await this.writeFile("services.json", filtered);
    return true;
  }

  // ── Home Content ──────────────────────────────────────────────────────────

  async getHomeContent(): Promise<HomeContent> {
    return this.readFile("home.json", defaultHome as HomeContent);
  }

  async updateHomeContent(data: Partial<HomeContent>): Promise<HomeContent> {
    const current = await this.getHomeContent();
    const updated: HomeContent = {
      ...current,
      ...data,
      whyChooseUs: data.whyChooseUs ?? current.whyChooseUs,
    };
    await this.writeFile("home.json", updated);
    return updated;
  }

  // ── Enquiries ─────────────────────────────────────────────────────────────

  async getEnquiries(): Promise<Enquiry[]> {
    return this.readFile("enquiries.json", defaultEnquiries as Enquiry[]);
  }

  async saveEnquiry(
    enquiryData: Omit<Enquiry, "id" | "createdAt" | "status">
  ): Promise<Enquiry> {
    const enquiries = await this.getEnquiries();
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: "new",
    };
    await this.writeFile("enquiries.json", [newEnquiry, ...enquiries]);
    return newEnquiry;
  }

  async updateEnquiryStatus(
    id: string,
    status: Enquiry["status"]
  ): Promise<Enquiry | null> {
    const enquiries = await this.getEnquiries();
    const idx = enquiries.findIndex((e) => e.id === id);
    if (idx === -1) return null;
    const updated = enquiries.map((e, i) =>
      i === idx ? { ...e, status } : e
    );
    await this.writeFile("enquiries.json", updated);
    return updated[idx];
  }

  async deleteEnquiry(id: string): Promise<boolean> {
    const enquiries = await this.getEnquiries();
    const filtered = enquiries.filter((e) => e.id !== id);
    if (filtered.length === enquiries.length) return false;
    await this.writeFile("enquiries.json", filtered);
    return true;
  }
}
