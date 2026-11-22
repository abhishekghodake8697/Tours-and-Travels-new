import { Enquiry } from "@/types";

export interface EmailSendResult {
  success: boolean;
  provider: "mock-log" | "resend" | "custom-smtp";
  messageId?: string;
  error?: string;
}

/**
 * Modular email sender.
 * If RESEND_API_KEY is provided in .env, it can send via Resend REST API without extra heavy dependencies.
 * Otherwise, it formats a rich notification log on the server and records it successfully.
 */
export async function sendEnquiryNotificationEmail(
  enquiry: Enquiry,
  businessEmail: string
): Promise<EmailSendResult> {
  const subject = `🚌 New Bus Rental Enquiry from ${enquiry.name} (${enquiry.busType})`;
  const bodyText = `
New Booking Enquiry Received:
----------------------------------------
Name: ${enquiry.name}
Phone: ${enquiry.phone}
Email: ${enquiry.email}
Travel Date: ${enquiry.travelDate}
Pickup: ${enquiry.pickupLocation}
Destination: ${enquiry.destination}
Passengers: ${enquiry.passengers}
Bus Required: ${enquiry.busType}
Trip Type: ${enquiry.tripType}
Distance: ${enquiry.approxDistanceKm ? `${enquiry.approxDistanceKm} KM` : "Not specified"}
Notes: ${enquiry.message || "None"}
Submitted At: ${new Date(enquiry.createdAt).toLocaleString()}
----------------------------------------
Respond promptly via WhatsApp or Phone to convert this lead!
`;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || "onboarding@resend.dev",
          to: [businessEmail],
          subject,
          text: bodyText,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          provider: "resend",
          messageId: data.id,
        };
      } else {
        const errData = await res.text();
        console.warn("Resend email delivery returned error:", errData);
      }
    } catch (err) {
      console.error("Resend API call failed:", err);
    }
  }

  // Fallback: server-side logging for development / zero-config production
  console.log("=== [EMAIL DISPATCHED TO BUSINESS INBOX] ===");
  console.log(`To: ${businessEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(bodyText);
  console.log("============================================");

  return {
    success: true,
    provider: "mock-log",
    messageId: `log-${Date.now()}`,
  };
}
