const mongoose = require("mongoose")

const turfSchema = new mongoose.Schema({
  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
    required: true
  },

  name: { type: String, required: true },

  sportType: {
    type: String,
    enum: ["CRICKET", "FOOTBALL", "PICKLEBALL", "BADMINTON", "TENNIS"],
    required: true
  },

  pricePerHour: { type: Number, required: true },

  slotDurationMinutes: { type: Number, default: 60 },

  bufferMinutes: { type: Number, default: 0 },

  amenities: [String],

  images: [String],

  isActive: { type: Boolean, default: true }

}, { timestamps: true })

module.exports = mongoose.model("Turf", turfSchema)
