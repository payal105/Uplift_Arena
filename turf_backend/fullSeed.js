/**
 * Full seed: Cities → Venues → Turfs → Slots
 * Run: node fullSeed.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const City   = require("./src/models/City");
const Venue  = require("./src/models/Venue");
const Turf   = require("./src/models/Turf");
const Slot   = require("./src/models/Slot");

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// ── Data ────────────────────────────────────────────────────────────────────
const DATA = {
  Siliguri: {
    state: "West Bengal",
    venues: [
      {
        name: "Uplift Sports Arena",
        address: "Sevoke Road, Siliguri - 734001",
        turfs: [
          { name: "Cricket Ground A",   sportType: "CRICKET",    pricePerHour: 1200, amenities: ["Floodlights","Parking","Changing Room"] },
          { name: "Football Field 1",   sportType: "FOOTBALL",   pricePerHour: 1000, amenities: ["Floodlights","Parking","Washroom"] },
          { name: "Badminton Court 1",  sportType: "BADMINTON",  pricePerHour:  400, amenities: ["AC","Parking","Water"] },
          { name: "Pickleball Court 1", sportType: "PICKLEBALL", pricePerHour:  500, amenities: ["Floodlights","Parking","Water"] },
        ],
      },
      {
        name: "Mahananda Sports Arena",
        address: "Hill Cart Road, Siliguri - 734010",
        turfs: [
          { name: "Premium Cricket Turf", sportType: "CRICKET",  pricePerHour: 1500, amenities: ["Floodlights","Pavilion","Parking"] },
          { name: "Football Arena",       sportType: "FOOTBALL", pricePerHour: 1200, amenities: ["Floodlights","Seating","Parking"] },
          { name: "Tennis Court Premium", sportType: "TENNIS",   pricePerHour:  800, amenities: ["Floodlights","Parking"] },
        ],
      },
    ],
  },
  Kolkata: {
    state: "West Bengal",
    venues: [
      {
        name: "Salt Lake Sports Complex",
        address: "Salt Lake Sector V, Kolkata - 700091",
        turfs: [
          { name: "Cricket Pitch 1",    sportType: "CRICKET",    pricePerHour: 2000, amenities: ["Floodlights","Pavilion","Parking"] },
          { name: "Football Ground A",  sportType: "FOOTBALL",   pricePerHour: 1800, amenities: ["Floodlights","Seating","Parking"] },
          { name: "Badminton Arena 1",  sportType: "BADMINTON",  pricePerHour:  600, amenities: ["AC","Parking","Pro Shop"] },
          { name: "Pickleball Courts",  sportType: "PICKLEBALL", pricePerHour:  750, amenities: ["Floodlights","Parking","Water"] },
        ],
      },
      {
        name: "Rajarhat Sports Hub",
        address: "New Town, Rajarhat, Kolkata - 700156",
        turfs: [
          { name: "Cricket Stadium",    sportType: "CRICKET",    pricePerHour: 2200, amenities: ["Floodlights","Pavilion","Cafeteria"] },
          { name: "Football Championship Field", sportType: "FOOTBALL", pricePerHour: 1900, amenities: ["Floodlights","Seating","Parking"] },
          { name: "Badminton (3 Courts)", sportType: "BADMINTON", pricePerHour: 700, amenities: ["AC","Changing Room","Water"] },
        ],
      },
    ],
  },
};

// ── Slot generator ───────────────────────────────────────────────────────────
function generateSlots(date) {
  const slots = [];
  // Morning 06:00–12:00
  for (let h = 6; h < 12; h++) {
    slots.push({ date, startTime: `${String(h).padStart(2,"0")}:00`, endTime: `${String(h+1).padStart(2,"0")}:00`, status: "AVAILABLE" });
  }
  // Afternoon / Evening 14:00–22:00
  for (let h = 14; h < 22; h++) {
    slots.push({ date, startTime: `${String(h).padStart(2,"0")}:00`, endTime: `${String(h+1).padStart(2,"0")}:00`, status: "AVAILABLE" });
  }
  return slots;
}

function getNext7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const dates = getNext7Days();
    console.log(`📅 Will create slots for: ${dates.join(", ")}\n`);

    let totalVenues = 0, totalTurfs = 0, totalSlots = 0;

    for (const [cityName, cityInfo] of Object.entries(DATA)) {
      // Upsert city
      let city = await City.findOne({ name: new RegExp(`^${cityName}\\s*$`, "i") });
      if (!city) {
        city = await City.create({ name: cityName, state: cityInfo.state, isActive: true });
        console.log(`🏙️  Created city: ${cityName}`);
      } else {
        console.log(`🏙️  Using existing city: ${cityName}`);
      }

      for (const vd of cityInfo.venues) {
        // Upsert venue
        let venue = await Venue.findOne({ name: vd.name, city: city._id });
        if (!venue) {
          venue = await Venue.create({ city: city._id, name: vd.name, address: vd.address, isActive: true });
          console.log(`  📍 Created venue: ${vd.name}`);
          totalVenues++;
        } else {
          console.log(`  📍 Exists: ${vd.name}`);
        }

        for (const td of vd.turfs) {
          // Upsert turf
          let turf = await Turf.findOne({ name: td.name, venue: venue._id });
          if (!turf) {
            turf = await Turf.create({
              venue: venue._id, name: td.name, sportType: td.sportType,
              pricePerHour: td.pricePerHour, slotDurationMinutes: 60,
              bufferMinutes: 0, amenities: td.amenities, isActive: true,
            });
            console.log(`    🏟️  Created turf: ${td.name} (${td.sportType})`);
            totalTurfs++;
          } else {
            console.log(`    🏟️  Exists: ${td.name}`);
          }

          // Create slots (skip existing)
          let created = 0;
          for (const date of dates) {
            for (const s of generateSlots(date)) {
              const exists = await Slot.findOne({ turf: turf._id, date: s.date, startTime: s.startTime });
              if (!exists) {
                await Slot.create({ turf: turf._id, ...s });
                created++;
              }
            }
          }
          if (created) { console.log(`       ✅ ${created} slots created`); totalSlots += created; }
        }
      }
      console.log();
    }

    console.log("═══════════════════════════════════════");
    console.log("  SEED COMPLETE");
    console.log(`  Cities  : ${Object.keys(DATA).length}`);
    console.log(`  Venues  : ${totalVenues}`);
    console.log(`  Turfs   : ${totalTurfs}`);
    console.log(`  Slots   : ${totalSlots}`);
    console.log("═══════════════════════════════════════");

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
