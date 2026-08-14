const cron = require("node-cron");
const mongoose = require("mongoose");
const Turf = require("../models/Turf");
const Slot = require("../models/Slot");

/**
 * Runs every day at 00:05 AM IST.
 * Generates slots until Dec 31 of current year across all active turfs.
 * Skips slots that already exist — completely safe to run multiple times.
 */

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

async function generateUpcomingSlots() {
  try {
    const turfs = await Turf.find({ isActive: true }).select("_id name");
    if (!turfs.length) return;

    // Build list of dates: today → 365 days from now (rolling 1-year window)
    const dates = [];
    const today = new Date();
    const yearAhead = new Date(today);
    yearAhead.setDate(today.getDate() + 365);
    for (let d = new Date(today); d <= yearAhead; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split("T")[0]);
    }

    let created = 0;
    let skipped = 0;

    for (const turf of turfs) {
      for (const date of dates) {
        for (const { startTime, endTime } of TIME_SLOTS) {
          const exists = await Slot.exists({ turf: turf._id, date, startTime });
          if (exists) { skipped++; continue; }

          await Slot.create({ turf: turf._id, date, startTime, endTime, status: "AVAILABLE" });
          created++;
        }
      }
    }

    console.log(`[SlotGenCron] Created: ${created} slots, Skipped: ${skipped} (already existed).`);
  } catch (err) {
    console.error("[SlotGenCron] Error generating slots:", err.message);
  }
}

const startSlotGenerationCron = () => {
  // Run once immediately on server startup to fill any gaps
  generateUpcomingSlots().then(() => {
    console.log("[SlotGenCron] Initial slot generation complete.");
  });

  // Then run every day at 00:05 AM IST to top up the next 90 days
  cron.schedule("5 0 * * *", async () => {
    console.log("[SlotGenCron] Daily slot generation started...");
    await generateUpcomingSlots();
  }, {
    timezone: "Asia/Kolkata",
  });

  console.log(`[SlotGenCron] Slot generation cron scheduled (daily at 00:05 AM IST, rolling 365-day window).`);
};

module.exports = { startSlotGenerationCron };
