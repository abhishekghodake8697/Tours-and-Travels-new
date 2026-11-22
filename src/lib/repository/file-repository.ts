import fs from "fs/promises";
import path from "path";
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

// Static imports as guaranteed defaults/fallbacks for serverless environments
import defaultBusiness from "@/data/business.json";
import defaultRates from "@/data/rates.json";
import defaultFleet from "@/data/fleet.json";
import defaultServices from "@/data/services.json";
import defaultGallery from "@/data/gallery.json";
import defaultHome from "@/data/home.json";
import defaultEnquiries from "@/data/enquiries.json";

// In-memory cache for fast access and fallback if filesystem is read-only
interface MemoryCache {
  business: BusinessInfo;
  rates: RateConfig;
  fleet: Bus[];
  services: ServiceItem[];
  gallery: GalleryItem[];
  home: HomeContent;
  enquiries: Enquiry[];
}

const memoryStore: MemoryCache = {
  business: defaultBusiness as BusinessInfo,
  rates: defaultRates as RateConfig,
  fleet: defaultFleet as Bus[],
  services: defaultServices as ServiceItem[],
  gallery: defaultGallery as GalleryItem[],
  home: defaultHome as HomeContent,
  enquiries: defaultEnquiries as Enquiry[],
};

export class FileDataRepository implements IDataRepository {
  private dataDir: string;

  constructor() {
    this.dataDir = path.join(process.cwd(), "src", "data");
  }

  private async readFileSafe<T>(filename: string, fallback: T): Promise<T> {
    try {
      const filePath = path.join(this.dataDir, filename);
      const content = await fs.readFile(filePath, "utf-8");
      return JSON.parse(content) as T;
    } catch {
      // In serverless / read error, return current memory cache or fallback
      return fallback;
    }
  }

  private async writeFileSafe<T>(filename: string, data: T): Promise<void> {
    try {
      const filePath = path.join(this.dataDir, filename);
      await fs.mkdir(this.dataDir, { recursive: true });
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
    } catch {
      // If filesystem is read-only in serverless/edge environments,
      // it silently succeeds because memoryStore was updated
    }
  }

  async getBusinessInfo(): Promise<BusinessInfo> {
    const data = await this.readFileSafe<BusinessInfo>(
      "business.json",
      memoryStore.business
    );
    memoryStore.business = data;
    return data;
  }

  async updateBusinessInfo(data: Partial<BusinessInfo>): Promise<BusinessInfo> {
    const current = await this.getBusinessInfo();
    const updated: BusinessInfo = {
      ...current,
      ...data,
      stats: {
        ...current.stats,
        ...(data.stats || {}),
      },
      socialLinks: {
        ...current.socialLinks,
        ...(data.socialLinks || {}),
      },
    };
    memoryStore.business = updated;
    await this.writeFileSafe("business.json", updated);
    return updated;
  }

  async getRates(): Promise<RateConfig> {
    const data = await this.readFileSafe<RateConfig>(
      "rates.json",
      memoryStore.rates
    );
    memoryStore.rates = data;
    return data;
  }

  async updateRates(data: Partial<RateConfig>): Promise<RateConfig> {
    const current = await this.getRates();
    const updated: RateConfig = {
      ...current,
      ...data,
    };
    memoryStore.rates = updated;
    await this.writeFileSafe("rates.json", updated);
    return updated;
  }

  async getFleet(): Promise<Bus[]> {
    const data = await this.readFileSafe<Bus[]>("fleet.json", memoryStore.fleet);
    memoryStore.fleet = data;
    return data;
  }

  async updateFleet(fleet: Bus[]): Promise<Bus[]> {
    memoryStore.fleet = fleet;
    await this.writeFileSafe("fleet.json", fleet);
    return fleet;
  }

  async getBusById(id: string): Promise<Bus | null> {
    const fleet = await this.getFleet();
    return fleet.find((b) => b.id === id) || null;
  }

  async saveBus(bus: Bus): Promise<Bus> {
    const fleet = await this.getFleet();
    const index = fleet.findIndex((b) => b.id === bus.id);
    let updatedFleet: Bus[];
    if (index >= 0) {
      updatedFleet = [...fleet];
      updatedFleet[index] = bus;
    } else {
      updatedFleet = [bus, ...fleet];
    }
    await this.updateFleet(updatedFleet);
    return bus;
  }

  async deleteBus(id: string): Promise<boolean> {
    const fleet = await this.getFleet();
    const filtered = fleet.filter((b) => b.id !== id);
    if (filtered.length !== fleet.length) {
      await this.updateFleet(filtered);
      return true;
    }
    return false;
  }

  async getGallery(): Promise<GalleryItem[]> {
    const data = await this.readFileSafe<GalleryItem[]>(
      "gallery.json",
      memoryStore.gallery
    );
    memoryStore.gallery = data;
    return data;
  }

  async updateGallery(gallery: GalleryItem[]): Promise<GalleryItem[]> {
    memoryStore.gallery = gallery;
    await this.writeFileSafe("gallery.json", gallery);
    return gallery;
  }

  async saveGalleryItem(item: GalleryItem): Promise<GalleryItem> {
    const gallery = await this.getGallery();
    const index = gallery.findIndex((g) => g.id === item.id);
    let updated: GalleryItem[];
    if (index >= 0) {
      updated = [...gallery];
      updated[index] = item;
    } else {
      updated = [item, ...gallery];
    }
    await this.updateGallery(updated);
    return item;
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    const gallery = await this.getGallery();
    const filtered = gallery.filter((g) => g.id !== id);
    if (filtered.length !== gallery.length) {
      await this.updateGallery(filtered);
      return true;
    }
    return false;
  }

  async getServices(): Promise<ServiceItem[]> {
    const data = await this.readFileSafe<ServiceItem[]>(
      "services.json",
      memoryStore.services
    );
    memoryStore.services = data;
    return data;
  }

  async updateServices(services: ServiceItem[]): Promise<ServiceItem[]> {
    memoryStore.services = services;
    await this.writeFileSafe("services.json", services);
    return services;
  }

  async saveService(service: ServiceItem): Promise<ServiceItem> {
    const services = await this.getServices();
    const index = services.findIndex((s) => s.id === service.id);
    let updated: ServiceItem[];
    if (index >= 0) {
      updated = [...services];
      updated[index] = service;
    } else {
      updated = [...services, service];
    }
    await this.updateServices(updated);
    return service;
  }

  async deleteService(id: string): Promise<boolean> {
    const services = await this.getServices();
    const filtered = services.filter((s) => s.id !== id);
    if (filtered.length !== services.length) {
      await this.updateServices(filtered);
      return true;
    }
    return false;
  }

  async getHomeContent(): Promise<HomeContent> {
    const data = await this.readFileSafe<HomeContent>(
      "home.json",
      memoryStore.home
    );
    memoryStore.home = data;
    return data;
  }

  async updateHomeContent(data: Partial<HomeContent>): Promise<HomeContent> {
    const current = await this.getHomeContent();
    const updated: HomeContent = {
      ...current,
      ...data,
      whyChooseUs: data.whyChooseUs || current.whyChooseUs,
    };
    memoryStore.home = updated;
    await this.writeFileSafe("home.json", updated);
    return updated;
  }

  async getEnquiries(): Promise<Enquiry[]> {
    const data = await this.readFileSafe<Enquiry[]>(
      "enquiries.json",
      memoryStore.enquiries
    );
    memoryStore.enquiries = data;
    return data;
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
    const updated = [newEnquiry, ...enquiries];
    memoryStore.enquiries = updated;
    await this.writeFileSafe("enquiries.json", updated);
    return newEnquiry;
  }

  async updateEnquiryStatus(
    id: string,
    status: Enquiry["status"]
  ): Promise<Enquiry | null> {
    const enquiries = await this.getEnquiries();
    const index = enquiries.findIndex((e) => e.id === id);
    if (index === -1) return null;
    enquiries[index].status = status;
    memoryStore.enquiries = [...enquiries];
    await this.writeFileSafe("enquiries.json", memoryStore.enquiries);
    return enquiries[index];
  }

  async deleteEnquiry(id: string): Promise<boolean> {
    const enquiries = await this.getEnquiries();
    const filtered = enquiries.filter((e) => e.id !== id);
    if (filtered.length !== enquiries.length) {
      memoryStore.enquiries = filtered;
      await this.writeFileSafe("enquiries.json", filtered);
      return true;
    }
    return false;
  }
}
