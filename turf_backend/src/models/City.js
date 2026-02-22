const mongoose = require("mongoose")

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  state: { type: String },
  country: { type: String, default: "India" },
  isActive: { type: Boolean, default: true }

}, { timestamps: true })

module.exports = mongoose.model("City", citySchema)
