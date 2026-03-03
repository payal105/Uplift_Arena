const mongoose = require("mongoose")

const formBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
    default: null
  },

  customerName: { type: String, required: true },

  phone: { type: String, required: true },

  email: { type: String },

  sport: { type: String, required: true },

  turfId: { type: String, required: true },

  turfName: { type: String, required: true },

  bookingDate: { type: String, required: true },

  fromTime: { type: String, required: true },

  toTime: { type: String, required: true },

  bringGuests: { type: Boolean, default: false },

  guestCount: { type: Number, default: 0 },

  guestCharges: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed"
  }

}, { timestamps: true })

module.exports = mongoose.model("FormBooking", formBookingSchema)
