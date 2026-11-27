export interface BusinessStats {
  busesCount: number;
  experienceYears: number;
  tripsCompleted: number;
  happyCustomers: number;
}

export interface BusinessSocialLinks {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
}

export interface BusinessInfo {
  name: string;
  tagline: string;
  shortAbout: string;
  fullAbout: string;
  philosophy: string;
  safetyPromise: string;
  phone: string;
  phoneSecondary?: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  workingHours: string;
  googleMapsUrl: string;
  socialLinks: BusinessSocialLinks;
  stats: BusinessStats;
}

export interface RateConfig {
  currency: string;
  perKmRate: number;
  perKmMinDistance: number;
  dayPackagePrice: number;
  dayPackageKmLimit: number;
  extraKmRate: number;
  driverAllowancePerDay: number;
  nightHaltCharge: number;
  terms: string[];
  notes: string;
}

export interface Bus {
  id: string;
  name: string;
  category: "mini" | "standard" | "luxury" | "sleeper";
  seatingCapacity: number;
  isAc: boolean;
  features: string[];
  luggageCapacity: string;
  driverIncluded: boolean;
  isActive: boolean;
  image: string;
  description: string;
  badge?: string;
  customPerKmRate?: number;
  customDayPackagePrice?: number;
  dayPackageKmLimit?: number | null;
}

export interface GalleryItem {
  id: string;
  title: string;
  destination: string;
  category: "outstation" | "wedding" | "corporate" | "pilgrimage" | "tour";
  date: string;
  image: string;
  description: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  icon: string;
  highlights: string[];
  idealFor: string;
}

export interface WhyChooseUsItem {
  title: string;
  description: string;
  icon: string;
}

export interface HomeContent {
  heroHeadline: string;
  heroSubheadline: string;
  heroHighlightBadge: string;
  primaryCtaText: string;
  secondaryCtaText: string;
  whyChooseUs: WhyChooseUsItem[];
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email: string;
  travelDate: string;
  pickupLocation: string;
  destination: string;
  passengers: number;
  busType: string;
  tripType: "local" | "outstation" | "round_trip" | "one_way";
  approxDistanceKm?: number;
  message?: string;
  createdAt: string;
  status: "new" | "contacted" | "booked" | "cancelled";
}
