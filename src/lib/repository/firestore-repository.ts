import { db } from "@/lib/firebase-admin";
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

// ── Firestore collection / document paths ─────────────────────────────────────
const CONFIG = "config"; // single-document configs: business, rates, home
const FLEET = "fleet";
const GALLERY = "gallery";
const SERVICES = "services";
const ENQUIRIES = "enquiries";

export class FirestoreRepository implements IDataRepository {
  // ── Business ──────────────────────────────────────────────────────────────
  async getBusinessInfo(): Promise<BusinessInfo> {
    const snap = await db.collection(CONFIG).doc("business").get();
    if (!snap.exists) throw new Error("Business info not found in Firestore. Run the seed script.");
    return snap.data() as BusinessInfo;
  }

  async updateBusinessInfo(data: Partial<BusinessInfo>): Promise<BusinessInfo> {
    const current = await this.getBusinessInfo();
    const updated: BusinessInfo = {
      ...current,
      ...data,
      stats: { ...current.stats, ...(data.stats ?? {}) },
      socialLinks: { ...current.socialLinks, ...(data.socialLinks ?? {}) },
    };
    await db.collection(CONFIG).doc("business").set(updated);
    return updated;
  }

  // ── Rates ─────────────────────────────────────────────────────────────────
  async getRates(): Promise<RateConfig> {
    const snap = await db.collection(CONFIG).doc("rates").get();
    if (!snap.exists) throw new Error("Rates not found in Firestore. Run the seed script.");
    return snap.data() as RateConfig;
  }

  async updateRates(data: Partial<RateConfig>): Promise<RateConfig> {
    const current = await this.getRates();
    const updated: RateConfig = { ...current, ...data };
    await db.collection(CONFIG).doc("rates").set(updated);
    return updated;
  }

  // ── Fleet ─────────────────────────────────────────────────────────────────
  async getFleet(): Promise<Bus[]> {
    const snap = await db.collection(FLEET).get();
    return snap.docs.map((d) => d.data() as Bus);
  }

  async updateFleet(fleet: Bus[]): Promise<Bus[]> {
    const batch = db.batch();
    // Remove all existing bus documents
    const existing = await db.collection(FLEET).get();
    existing.docs.forEach((d) => batch.delete(d.ref));
    // Write fresh list
    fleet.forEach((bus) => batch.set(db.collection(FLEET).doc(bus.id), bus));
    await batch.commit();
    return fleet;
  }

  async getBusById(id: string): Promise<Bus | null> {
    const snap = await db.collection(FLEET).doc(id).get();
    return snap.exists ? (snap.data() as Bus) : null;
  }

  async saveBus(bus: Bus): Promise<Bus> {
    await db.collection(FLEET).doc(bus.id).set(bus);
    return bus;
  }

  async deleteBus(id: string): Promise<boolean> {
    const snap = await db.collection(FLEET).doc(id).get();
    if (!snap.exists) return false;
    await db.collection(FLEET).doc(id).delete();
    return true;
  }

  // ── Gallery ───────────────────────────────────────────────────────────────
  async getGallery(): Promise<GalleryItem[]> {
    const snap = await db.collection(GALLERY).get();
    return snap.docs.map((d) => d.data() as GalleryItem);
  }

  async updateGallery(gallery: GalleryItem[]): Promise<GalleryItem[]> {
    const batch = db.batch();
    const existing = await db.collection(GALLERY).get();
    existing.docs.forEach((d) => batch.delete(d.ref));
    gallery.forEach((item) =>
      batch.set(db.collection(GALLERY).doc(item.id), item)
    );
    await batch.commit();
    return gallery;
  }

  async saveGalleryItem(item: GalleryItem): Promise<GalleryItem> {
    await db.collection(GALLERY).doc(item.id).set(item);
    return item;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    const snap = await db.collection(GALLERY).doc(id).get();
    if (!snap.exists) return false;
    await db.collection(GALLERY).doc(id).delete();
    return true;
  }

  // ── Services ──────────────────────────────────────────────────────────────
  async getServices(): Promise<ServiceItem[]> {
    const snap = await db.collection(SERVICES).get();
    return snap.docs.map((d) => d.data() as ServiceItem);
  }

  async updateServices(services: ServiceItem[]): Promise<ServiceItem[]> {
    const batch = db.batch();
    const existing = await db.collection(SERVICES).get();
    existing.docs.forEach((d) => batch.delete(d.ref));
    services.forEach((s) =>
      batch.set(db.collection(SERVICES).doc(s.id), s)
    );
    await batch.commit();
    return services;
  }

  async saveService(service: ServiceItem): Promise<ServiceItem> {
    await db.collection(SERVICES).doc(service.id).set(service);
    return service;
  }

  async deleteService(id: string): Promise<boolean> {
    const snap = await db.collection(SERVICES).doc(id).get();
    if (!snap.exists) return false;
    await db.collection(SERVICES).doc(id).delete();
    return true;
  }

  // ── Home Content ──────────────────────────────────────────────────────────
  async getHomeContent(): Promise<HomeContent> {
    const snap = await db.collection(CONFIG).doc("home").get();
    if (!snap.exists) throw new Error("Home content not found in Firestore. Run the seed script.");
    return snap.data() as HomeContent;
  }

  async updateHomeContent(data: Partial<HomeContent>): Promise<HomeContent> {
    const current = await this.getHomeContent();
    const updated: HomeContent = {
      ...current,
      ...data,
      whyChooseUs: data.whyChooseUs ?? current.whyChooseUs,
    };
    await db.collection(CONFIG).doc("home").set(updated);
    return updated;
  }

  // ── Enquiries ─────────────────────────────────────────────────────────────
  async getEnquiries(): Promise<Enquiry[]> {
    const snap = await db
      .collection(ENQUIRIES)
      .orderBy("createdAt", "desc")
      .get();
    return snap.docs.map((d) => d.data() as Enquiry);
  }

  async saveEnquiry(
    enquiryData: Omit<Enquiry, "id" | "createdAt" | "status">
  ): Promise<Enquiry> {
    const newEnquiry: Enquiry = {
      ...enquiryData,
      id: `enq-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      status: "new",
    };
    await db.collection(ENQUIRIES).doc(newEnquiry.id).set(newEnquiry);
    return newEnquiry;
  }

  async updateEnquiryStatus(
    id: string,
    status: Enquiry["status"]
  ): Promise<Enquiry | null> {
    const ref = db.collection(ENQUIRIES).doc(id);
    const snap = await ref.get();
    if (!snap.exists) return null;
    await ref.update({ status });
    return { ...(snap.data() as Enquiry), status };
  }

  async deleteEnquiry(id: string): Promise<boolean> {
    const snap = await db.collection(ENQUIRIES).doc(id).get();
    if (!snap.exists) return false;
    await db.collection(ENQUIRIES).doc(id).delete();
    return true;
  }
}
