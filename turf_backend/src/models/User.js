const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  phone: { type: String, required: true, unique: true },

  email: { type: String },

  password: { type: String }, // optional (OTP-based login)

  isVerified: { type: Boolean, default: false },

  isActive: { type: Boolean, default: true }

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
