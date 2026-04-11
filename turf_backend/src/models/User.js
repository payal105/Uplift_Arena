const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String },

  password: { type: String }, // optional (OTP-based login)

  isVerified: { type: Boolean, default: false },

  isActive: { type: Boolean, default: true },

  isAdmin: { type: Number, default: 0 } // 0 = regular user, 1 = admin

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)
