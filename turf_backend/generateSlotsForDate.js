/**
 * Generate slots for a specific date (or date range) across all active turfs.
 * Does NOT delete existing slots — safe to run anytime.
 *
 * Usage:
 *   node generateSlotsForDate.js 2026-11-22
 *   node generateSlotsForDate.js 2026-11-22 2026-11-30   ← range
 */

require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// ── Minimal inline schemas (avoids import path issues) ──────────────────────
const Turf = mongoose.models.Turf || mongoose.model("Turf", new mongoose.Schema({
  name: String,
  isActive: Boolean,
}));

const Slot = mongoose.models.Slot || mongoose.model("Slot", new mongoose.Schema({
  turf:      { type: mongoose.Schema.Types.ObjectId, ref: "Turf" },
  date:      String,   // YYYY-MM-DD
  startTime: String,   // HH:MM
  endTime:   String,   // HH:MM
  status:    { type: String, default: "AVAILABLE" },
}, { timestamps: true }));

// Fixed 8 slots per day (morning + evening)
const TIME_SLOTS = [
  { startTime: "06:00", endTime: "07:00" },
  { startTime: "07:00", endTime: "08:00" },
  { startTime: "08:00", endTime: "09:00" },
  { startTime: "09:00", endTime: "10:00" },
  { startTime: "18:00", endTime: "19:00" },
  { startTime: "19:00", endTime: "20:00" },
  { startTime: "20:00", endTime: "21:00" },
  { startTime: "21:00", endTime: "22:00" },
];

// Build an array of YYYY-MM-DD strings from startDate to endDate (inclusive)
function buildDateRange(startStr, endStr) {
  const dates = [];
  const cur = new Date(startStr);
  const end = new Date(endStr || startStr);
  while (cur <= end) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

async function run() {
  const [startArg, endArg] = process.argv.slice(2);

  if (!startArg) {
    console.error("❌  Usage: node generateSlotsForDate.js YYYY-MM-DD [YYYY-MM-DD]");
    process.exit(1);
  }

  const dates = buildDateRange(startArg, endArg);
  console.log(`📅  Generating slots for: ${dates.join(", ")}\n`);

  await mongoose.connect(MONGODB_URI);
  console.log("✅  Connected to MongoDB\n");

  const turfs = await Turf.find({ isActive: true }).select("_id name");
  if (!turfs.length) {
    console.log("⚠️   No active turfs found.");
    await mongoose.disconnect();
    return;
  }

  let created = 0;
  let skipped = 0;

  for (const turf of turfs) {
    for (const date of dates) {
      for (const { startTime, endTime } of TIME_SLOTS) {
        const exists = await Slot.findOne({ turf: turf._id, date, startTime });
        if (exists) { skipped++; continue; }

        await Slot.create({ turf: turf._id, date, startTime, endTime, status: "AVAILABLE" });
        created++;
      }
    }
    console.log(`  ✅  ${turf.name} — done`);
  }

  console.log("\n──────────────────────────────────────────");
  console.log(`  Created : ${created} slots`);
  console.log(`  Skipped : ${skipped} (already existed)`);
  console.log("──────────────────────────────────────────");
  console.log("  Now open the dev dashboard and block the slots you need.");

  await mongoose.disconnect();
}

run().catch(err => {
  console.error("❌  Error:", err.message);
  process.exit(1);
});
