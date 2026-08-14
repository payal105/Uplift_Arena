const cron = require("node-cron");
const Turf = require("../models/Turf");
const Slot = require("../models/Slot");

/**
 * Runs every day at 00:05 AM IST.
 * Generates slots for a rolling 365-day window across all active turfs.
 * Uses bulk insertMany (ordered:false) so duplicates are silently skipped — safe to run anytime.
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
    if (!turfs.length) {
      console.log("[SlotGenCron] No active turfs found.");
      return;
    }

    // Build list of dates: today → 365 days from now
    const dates = [];
    const today = new Date();
    const yearAhead = new Date(today);
    yearAhead.setDate(today.getDate() + 365);
    for (let d = new Date(today); d <= yearAhead; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split("T")[0]);
    }

    // Build all slot documents in memory
    const slotsToInsert = [];
    for (const turf of turfs) {
      for (const date of dates) {
        for (const { startTime, endTime } of TIME_SLOTS) {
          slotsToInsert.push({
            turf: turf._id,
            date,
            startTime,
            endTime,
            status: "AVAILABLE",
          });
        }
      }
    }

    // Bulk insert — ordered:false means duplicates are skipped, rest still inserted
    let created = 0;
    let skipped = 0;
    try {
      const result = await Slot.insertMany(slotsToInsert, { ordered: false });
      created = result.length;
    } catch (bulkErr) {
      if (bulkErr.code === 11000 || bulkErr.name === "BulkWriteError") {
        // Partial success: some inserted, some were duplicates
        created = bulkErr.result?.nInserted ?? bulkErr.insertedDocs?.length ?? 0;
        skipped = slotsToInsert.length - created;
      } else {
        throw bulkErr; // real error — rethrow
      }
    }

    console.log(`[SlotGenCron] Done. Created: ${created} | Skipped (already existed): ${skipped} | Turfs: ${turfs.length} | Dates: ${dates.length}`);
  } catch (err) {
    console.error("[SlotGenCron] Error:", err.message);
  }
}

const startSlotGenerationCron = () => {
  // Run once immediately on server startup to fill any gaps
  generateUpcomingSlots().then(() => {
    console.log("[SlotGenCron] Startup slot generation complete.");
  });

  // Then run every day at 00:05 AM IST
  cron.schedule("5 0 * * *", async () => {
    console.log("[SlotGenCron] Daily slot generation started...");
    await generateUpcomingSlots();
  }, {
    timezone: "Asia/Kolkata",
  });

  console.log("[SlotGenCron] Cron scheduled (daily 00:05 AM IST, rolling 365-day window).");
};

module.exports = { startSlotGenerationCron };
