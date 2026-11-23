/**
 * Seed script — uploads your existing JSON data to Firestore.
 * Run ONCE after setting up Firebase (or whenever you reset the DB).
 *
 * Usage:
 *   npx tsx scripts/seed-firestore.ts
 */

import * as dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

// Load .env.local so Firebase credentials are available
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// ── Init ─────────────────────────────────────────────────────────────────────
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
  console.error("❌  Missing Firebase env vars. Make sure .env.local is correct.");
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const db = getFirestore();
const dataDir = path.resolve(__dirname, "../src/data");

function readJson<T>(filename: string): T {
  return JSON.parse(fs.readFileSync(path.join(dataDir, filename), "utf-8")) as T;
}

async function seed() {
  console.log("🌱  Seeding Firestore from local JSON files...\n");

  // ── config/business ───────────────────────────────────────────────────────
  const business = readJson("business.json");
  await db.collection("config").doc("business").set(business);
  console.log("✅  config/business");

  // ── config/rates ──────────────────────────────────────────────────────────
  const rates = readJson("rates.json");
  await db.collection("config").doc("rates").set(rates);
  console.log("✅  config/rates");

  // ── config/home ───────────────────────────────────────────────────────────
  const home = readJson("home.json");
  await db.collection("config").doc("home").set(home);
  console.log("✅  config/home");

  // ── fleet ─────────────────────────────────────────────────────────────────
  const fleet = readJson<{ id: string }[]>("fleet.json");
  const fleetBatch = db.batch();
  fleet.forEach((bus) => fleetBatch.set(db.collection("fleet").doc(bus.id), bus));
  await fleetBatch.commit();
  console.log(`✅  fleet (${fleet.length} buses)`);

  // ── gallery ───────────────────────────────────────────────────────────────
  const gallery = readJson<{ id: string }[]>("gallery.json");
  const galleryBatch = db.batch();
  gallery.forEach((item) =>
    galleryBatch.set(db.collection("gallery").doc(item.id), item)
  );
  await galleryBatch.commit();
  console.log(`✅  gallery (${gallery.length} items)`);

  // ── services ──────────────────────────────────────────────────────────────
  const services = readJson<{ id: string }[]>("services.json");
  const servicesBatch = db.batch();
  services.forEach((s) =>
    servicesBatch.set(db.collection("services").doc(s.id), s)
  );
  await servicesBatch.commit();
  console.log(`✅  services (${services.length} items)`);

  // ── enquiries — start empty (don't copy old file) ─────────────────────────
  console.log("ℹ️   enquiries collection left empty (new enquiries go here)");

  console.log("\n🎉  Seeding complete! Your Firestore is ready.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});
