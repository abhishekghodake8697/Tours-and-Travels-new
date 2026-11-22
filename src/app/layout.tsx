import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { repository } from "@/lib/repository";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const business = await repository.getBusinessInfo();
  const rates = await repository.getRates();

  return {
    title: `${business.name} | Premium Bus & Coach Rental with Verified Driver`,
    description: `${business.tagline}. Reliable bus rentals for local and outstation travel. Fixed day packages up to 250 KM starting at ₹${rates.dayPackagePrice} and per-KM rates from ₹${rates.perKmRate}/KM with experienced commercial chauffeurs.`,
    keywords: [
      "bus rental",
      "bus rental with driver",
      "luxury bus rental",
      "mini bus rental",
      "tempo traveller hire",
      "outstation bus hire",
      "250 km bus package",
      "wedding bus rental",
      "corporate bus transportation",
      "tourist coach booking",
      business.city,
      business.state,
    ],
    authors: [{ name: business.name }],
    openGraph: {
      title: `${business.name} - Luxury Bus Rental with Driver`,
      description: business.shortAbout,
      type: "website",
      locale: "en_IN",
      siteName: business.name,
      images: [
        {
          url: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
          width: 1200,
          height: 630,
          alt: `${business.name} Luxury Bus Fleet`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${business.name} - Premium Bus Rentals`,
      description: business.shortAbout,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const business = await repository.getBusinessInfo();

  // LocalBusiness / AutoRental Schema JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: business.name,
    description: business.fullAbout,
    telephone: business.phone,
    email: business.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: business.address,
      addressLocality: business.city,
      addressRegion: business.state,
      postalCode: business.pincode,
      addressCountry: "IN",
    },
    openingHours: "Mo-Su 00:00-24:00",
    priceRange: "₹₹",
    areaServed: ["Local", "Outstation", "Interstate"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Bus Rental Packages",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Fixed 250 KM Day Bus Rental Package",
            description: "Full day 12-hour rental covering up to 250 KM with professional driver.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Outstation Per-Kilometer Bus Rental",
            description: "Per KM billing model for multi-day outstation and interstate travel.",
          },
        },
      ],
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-[#0b132b] text-slate-100 flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
