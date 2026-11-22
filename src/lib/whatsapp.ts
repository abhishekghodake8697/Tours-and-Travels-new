import { Enquiry } from "@/types";

/**
 * Clean phone number for WhatsApp link (removes spaces, dashes, parentheses)
 */
export function sanitizeWhatsAppNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

/**
 * Generate standard enquiry WhatsApp message URL
 */
export function getGeneralWhatsAppUrl(
  phoneNumber: string,
  businessName: string
): string {
  const cleanPhone = sanitizeWhatsAppNumber(phoneNumber);
  const message = `Hello ${businessName}, I am interested in renting a bus. I would like to know the availability and pricing for my trip.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate bus-specific enquiry WhatsApp message URL
 */
export function getBusEnquiryWhatsAppUrl(
  phoneNumber: string,
  busName: string,
  seatingCapacity: number
): string {
  const cleanPhone = sanitizeWhatsAppNumber(phoneNumber);
  const message = `Hello, I would like to enquire about renting the *${busName}* (${seatingCapacity} Seats). Please let me know the availability and quotation for my journey.`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate formatted WhatsApp message from full booking enquiry
 */
export function getEnquiryWhatsAppUrl(
  phoneNumber: string,
  enquiry: Partial<Enquiry>
): string {
  const cleanPhone = sanitizeWhatsAppNumber(phoneNumber);
  const lines = [
    `*Hello! I would like to enquire about a bus rental.*`,
    ``,
    `👤 *Name:* ${enquiry.name || "N/A"}`,
    `📞 *Phone:* ${enquiry.phone || "N/A"}`,
    `📅 *Travel Date:* ${enquiry.travelDate || "Flexible"}`,
    `📍 *Pickup:* ${enquiry.pickupLocation || "N/A"}`,
    `🏁 *Destination:* ${enquiry.destination || "N/A"}`,
    `👥 *Passengers:* ${enquiry.passengers || "N/A"}`,
    `🚌 *Bus Required:* ${enquiry.busType || "Any suitable"}`,
    `🛣️ *Trip Type:* ${enquiry.tripType ? enquiry.tripType.toUpperCase() : "N/A"}`,
    enquiry.approxDistanceKm
      ? `📏 *Approx Distance:* ${enquiry.approxDistanceKm} KM`
      : "",
    enquiry.message ? `💬 *Notes:* ${enquiry.message}` : "",
    ``,
    `Please share the availability and detailed quotation. Thank you!`,
  ].filter(Boolean);

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(lines.join("\n"))}`;
}

/**
 * Generate WhatsApp message from fare calculator result
 */
export function getCalculatorWhatsAppUrl(
  phoneNumber: string,
  distanceKm: number,
  selectedModel: "per_km" | "day_package",
  estimatedTotal: number,
  busName?: string
): string {
  const cleanPhone = sanitizeWhatsAppNumber(phoneNumber);
  const modelText =
    selectedModel === "day_package"
      ? "Fixed Day Package (Up to 250 KM)"
      : "Per-KM Rate";

  const message = [
    `*Trip Fare Estimate Enquiry*`,
    ``,
    busName ? `🚌 *Bus Model:* ${busName}` : "",
    `📏 *Distance:* ~${distanceKm} KM`,
    `🏷️ *Pricing Model:* ${modelText}`,
    `💰 *Estimated Total:* ₹${estimatedTotal.toLocaleString("en-IN")}`,
    `👨‍✈️ *Driver:* Included`,
    ``,
    `Please check date availability and send me an official quotation.`,
  ]
    .filter(Boolean)
    .join("\n");

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
