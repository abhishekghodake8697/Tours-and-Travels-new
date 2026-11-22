import { NextResponse } from "next/server";
import { repository } from "@/lib/repository";
import { sendEnquiryNotificationEmail } from "@/lib/email";
import { getEnquiryWhatsAppUrl } from "@/lib/whatsapp";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      travelDate,
      pickupLocation,
      destination,
      passengers,
      busType,
      tripType,
      approxDistanceKm,
      message,
    } = body;

    // Validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Please enter a valid full name." },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string" || phone.trim().length < 7) {
      return NextResponse.json(
        { error: "Please enter a valid phone/mobile number." },
        { status: 400 }
      );
    }

    if (!travelDate) {
      return NextResponse.json(
        { error: "Please select your planned travel date." },
        { status: 400 }
      );
    }

    if (!pickupLocation || !destination) {
      return NextResponse.json(
        { error: "Please provide both pickup location and destination." },
        { status: 400 }
      );
    }

    const passengerCount = parseInt(passengers, 10) || 1;
    const distance = approxDistanceKm ? parseInt(approxDistanceKm, 10) : undefined;

    // 1. Save enquiry to database-free repository (with in-memory cache & file storage)
    const savedEnquiry = await repository.saveEnquiry({
      name: name.trim(),
      phone: phone.trim(),
      email: (email || "").trim(),
      travelDate,
      pickupLocation: pickupLocation.trim(),
      destination: destination.trim(),
      passengers: passengerCount,
      busType: busType || "Standard AC Coach",
      tripType: tripType || "outstation",
      approxDistanceKm: distance,
      message: (message || "").trim(),
    });

    // 2. Fetch business info for dispatch & WhatsApp URL generation
    const business = await repository.getBusinessInfo();

    // 3. Dispatch modular server-side email (zero credentials exposed to frontend)
    await sendEnquiryNotificationEmail(savedEnquiry, business.email);

    // 4. Generate direct WhatsApp redirection URL with filled details
    const whatsappUrl = getEnquiryWhatsAppUrl(business.whatsapp, savedEnquiry);

    return NextResponse.json({
      success: true,
      message: "Enquiry submitted successfully! Our team will contact you shortly.",
      enquiryId: savedEnquiry.id,
      whatsappUrl,
    });
  } catch (error) {
    console.error("Enquiry API submission error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try WhatsApp directly." },
      { status: 500 }
    );
  }
}
