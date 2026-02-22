const mongoose = require("mongoose")

const adminUserSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["SUPER_ADMIN", "SCOPED_ADMIN", "TURF_MANAGER"],
    required: true
  },

  scope: {
    cities: [{ type: mongoose.Schema.Types.ObjectId, ref: "City" }],
    venues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Venue" }],
    turfs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Turf" }]
  },

  isActive: { type: Boolean, default: true }

}, { timestamps: true })

module.exports = mongoose.model("AdminUser", adminUserSchema)
