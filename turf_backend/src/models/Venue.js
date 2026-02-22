const mongoose = require("mongoose")

const venueSchema = new mongoose.Schema({
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "City",
    required: true
  },

  name: { type: String, required: true },

  address: String,

  isActive: { type: Boolean, default: true }

}, { timestamps: true })

module.exports = mongoose.model("Venue", venueSchema)
