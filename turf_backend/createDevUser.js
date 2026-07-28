/**
 * Create Developer Admin User
 * Run: node createDevUser.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const adminUserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["SUPER_ADMIN", "SCOPED_ADMIN", "TURF_MANAGER"] },
  scope: {
    cities: [{ type: mongoose.Schema.Types.ObjectId, ref: "City" }],
    venues: [{ type: mongoose.Schema.Types.ObjectId, ref: "Venue" }],
    turfs:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Turf" }],
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const AdminUser = mongoose.models.AdminUser || mongoose.model("AdminUser", adminUserSchema);

async function createDevUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const name     = "payalDev";
    const email    = "payaldev@uplift.com";
    const password = "P@y@l24092000";
    const role     = "SUPER_ADMIN";

    // Check if already exists
    const existing = await AdminUser.findOne({ email });
    if (existing) {
      console.log(`⚠️  Admin user with email "${email}" already exists.`);
      console.log("   Name:", existing.name);
      console.log("   Role:", existing.role);
      console.log("   Active:", existing.isActive);
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await AdminUser.create({
      name,
      email,
      password: hashedPassword,
      role,
      isActive: true,
    });

    console.log("🎉 Developer admin created successfully!");
    console.log("─────────────────────────────────────");
    console.log("  Name    :", admin.name);
    console.log("  Email   :", admin.email);
    console.log("  Role    :", admin.role);
    console.log("  ID      :", admin._id.toString());
    console.log("─────────────────────────────────────");
    console.log("  Login at: http://localhost:5175");
    console.log("  Email   :", email);
    console.log("  Password: P@y@l24092000");

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

createDevUser();
