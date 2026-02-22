const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
  turf: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Turf",
    required: true
  },

  venue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Venue",
    required: true
  },

  slot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Slot",
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null // guest booking
  },

  bookingDate: { type: String, required: true },

  customerName: { type: String, required: true },

  phone: { type: String, required: true },

  bookingType: {
    type: String,
    enum: ["ONLINE", "OFFLINE"],
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED", "OFFLINE", "REFUNDED"],
    required: true
  },

  status: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed"
  },

  paymentRef: String,

  invoiceUrl: String

}, { timestamps: true })

module.exports = mongoose.model("Booking", bookingSchema)
