const mongoose = require("mongoose");

const membershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserData",
    required: true,
  },

  name: { type: String, required: true },

  email: { type: String, required: true },

  phone: { type: String, required: true },

  membershipType: { type: String, required: true },

  activityChoice: { type: String, default: null }, // only for individual activity plans

  message: { type: String, default: "" },

  startDate: { type: Date, required: true },

  endDate: { type: Date, required: true },

  isActive: { type: Number, default: 1 }, // 1 = active, 0 = inactive

}, { timestamps: true });

module.exports = mongoose.model("Membership", membershipSchema);
