/**
 * Patch existing payalDev admin with a username field
 * Run: node patchDevUserUsername.js
 */

require("dotenv").config();
const mongoose = require("mongoose");

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const adminUserSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true },
  password: String,
  role: String,
  scope: { cities: [], venues: [], turfs: [] },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema);

async function patchDevUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const result = await AdminUser.findOneAndUpdate(
      { email: "payaldev@uplift.com" },
      { $set: { username: "payalDev" } },
      { new: true }
    );

    if (!result) {
      console.log("❌ User payaldev@uplift.com not found in DB");
    } else {
      console.log("🎉 Username set successfully!");
      console.log("─────────────────────────────────────");
      console.log("  Name     :", result.name);
      console.log("  Username :", result.username);
      console.log("  Email    :", result.email);
      console.log("  Role     :", result.role);
      console.log("─────────────────────────────────────");
      console.log("  Login at: http://localhost:5175");
      console.log("  Username: payalDev");
      console.log("  Password: P@y@l24092000");
    }
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

patchDevUser();
