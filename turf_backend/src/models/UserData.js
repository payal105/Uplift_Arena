const mongoose = require("mongoose")

const userDataSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  isVerified: { type: Boolean, default: false },

  isActive: { type: Boolean, default: true },

  isMember: { type: Number, default: 0 }, // 0 = non-member, 1 = member

  resetToken: { type: String, default: null },

  resetTokenExpiry: { type: Date, default: null }

}, { timestamps: true })

module.exports = mongoose.model("UserData", userDataSchema)
