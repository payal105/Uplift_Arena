const mongoose = require("mongoose")

const userDataSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  isVerified: { type: Boolean, default: false },

  isActive: { type: Boolean, default: true }

}, { timestamps: true })

module.exports = mongoose.model("UserData", userDataSchema)
