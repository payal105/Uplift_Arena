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

  toDate: { type: String },  // auto-computed: same as bookingDate or next day if booking crosses midnight

  fromTime: { type: String, required: true },  // earliest slot start

  toTime: { type: String, required: true },    // latest slot end

  slots: [
    {
      startTime: { type: String, required: true },
      endTime:   { type: String, required: true }
    }
  ],

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
