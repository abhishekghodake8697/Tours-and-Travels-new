import {
  BusinessInfo,
  RateConfig,
  Bus,
  GalleryItem,
  ServiceItem,
  HomeContent,
  Enquiry,
} from "@/types";

export interface IDataRepository {
  getBusinessInfo(): Promise<BusinessInfo>;
  updateBusinessInfo(data: Partial<BusinessInfo>): Promise<BusinessInfo>;

  getRates(): Promise<RateConfig>;
  updateRates(data: Partial<RateConfig>): Promise<RateConfig>;

  getFleet(): Promise<Bus[]>;
  updateFleet(fleet: Bus[]): Promise<Bus[]>;
  getBusById(id: string): Promise<Bus | null>;
  saveBus(bus: Bus): Promise<Bus>;
  deleteBus(id: string): Promise<boolean>;

  getGallery(): Promise<GalleryItem[]>;
  updateGallery(gallery: GalleryItem[]): Promise<GalleryItem[]>;
  saveGalleryItem(item: GalleryItem): Promise<GalleryItem>;
  deleteGalleryItem(id: string): Promise<boolean>;

  getServices(): Promise<ServiceItem[]>;
  updateServices(services: ServiceItem[]): Promise<ServiceItem[]>;
  saveService(service: ServiceItem): Promise<ServiceItem>;
  deleteService(id: string): Promise<boolean>;

  getHomeContent(): Promise<HomeContent>;
  updateHomeContent(data: Partial<HomeContent>): Promise<HomeContent>;

  getEnquiries(): Promise<Enquiry[]>;
  saveEnquiry(
    enquiry: Omit<Enquiry, "id" | "createdAt" | "status">
  ): Promise<Enquiry>;
  updateEnquiryStatus(
    id: string,
    status: Enquiry["status"]
  ): Promise<Enquiry | null>;
  deleteEnquiry(id: string): Promise<boolean>;
}
