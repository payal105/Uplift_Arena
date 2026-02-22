const mongoose = require("mongoose")

const slotSchema = new mongoose.Schema({
  turf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Turf",
    required: true
  },

  date: { type: String, required: true }, // YYYY-MM-DD

  startTime: { type: String, required: true }, // HH:mm

  endTime: { type: String, required: true },

  status: {
    type: String,
    enum: ["AVAILABLE", "BLOCKED", "BOOKED"],
    default: "AVAILABLE"
  },

  blockedBy: {
    type: String,
    enum: ["SYSTEM", "ADMIN", "TURF_MANAGER"]
  }

}, { timestamps: true })

// 🔐 Prevent double booking
slotSchema.index(
  { turf: 1, date: 1, startTime: 1 },
  { unique: true }
)

module.exports = mongoose.model("Slot", slotSchema)
