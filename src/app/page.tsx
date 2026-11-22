import { repository } from "@/lib/repository";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { StatsSection } from "@/components/StatsSection";
import { AboutSection } from "@/components/AboutSection";
import { FleetSection } from "@/components/FleetSection";
import { ServicesSection } from "@/components/ServicesSection";
import { RateCardSection } from "@/components/RateCardSection";
import { GallerySection } from "@/components/GallerySection";
import { WhyChooseUsSection } from "@/components/WhyChooseUsSection";
import { EnquiryForm } from "@/components/EnquiryForm";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { FloatingActions } from "@/components/FloatingActions";
import { MobileBottomBar } from "@/components/MobileBottomBar";

export const revalidate = 0; // Ensures fresh data from editable repository

export default async function HomePage() {
  const [business, rates, fleet, services, gallery, homeContent] =
    await Promise.all([
      repository.getBusinessInfo(),
      repository.getRates(),
      repository.getFleet(),
      repository.getServices(),
      repository.getGallery(),
      repository.getHomeContent(),
    ]);

  return (
    <div className="relative min-h-screen bg-[#0b132b] text-slate-100 flex flex-col selection:bg-amber-400 selection:text-slate-950">
      {/* Sticky Glass Navbar */}
      <Navbar business={business} />

      <main className="flex-1 space-y-12 sm:space-y-16">
        {/* 1. Hero Section with Cinematic Visuals & Immediate Highlights */}
        <Hero business={business} homeContent={homeContent} />

        {/* Animated Statistics Counter */}
        <StatsSection stats={business.stats} />

        {/* 2. About Us: Story, Chauffeur Professionalism, Reliability */}
        <AboutSection business={business} />

        {/* 3. Our Fleet: Bus cards with capacities, AC/Non-AC, features, quote CTAs */}
        <FleetSection fleet={fleet} business={business} />

        {/* 4. Services: Local, Outstation, Weddings, Corporate, etc. */}
        <ServicesSection services={services} />

        {/* 5. Rate Card: Per-KM & Fixed 250 KM Day Package + Live Interactive Calculator */}
        <RateCardSection rates={rates} buses={fleet} business={business} />

        {/* 6. Travel Gallery / Past Trips: Moments, destinations, and modal lightbox */}
        <GallerySection gallery={gallery} />

        {/* 7. Why Choose Us: 8 Selling Point Cards */}
        <WhyChooseUsSection items={homeContent.whyChooseUs} />

        {/* 8. Booking / Enquiry Section: Multi-field form with email & WhatsApp dispatch */}
        <EnquiryForm buses={fleet} business={business} />

        {/* 9. Contact Section: Direct phones, WhatsApp, Map, hours, addresses */}
        <ContactSection business={business} />
      </main>

      {/* 10. Footer with complete navigation and credentials */}
      <Footer business={business} services={services} />

      {/* Conversion Enhancers */}
      <FloatingActions business={business} />
      <MobileBottomBar business={business} />
    </div>
  );
}
