/**
 * Reset DevCreds passwords to match DEVS array (force update existing records)
 * Run: node resetDevPassword.js
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const devCredsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const DevCreds = mongoose.models.DevCreds || mongoose.model("DevCreds", devCredsSchema);

// Update this list to match seedDevCreds.js whenever passwords change
const DEVS = [
  { username: "payalDev", password: "P@y@l24092000" },
  { username: "rishiDev", password: "footb@ll5TEAM" },
];

async function resetPasswords() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    for (const dev of DEVS) {
      const hashed = await bcrypt.hash(dev.password, 10);
      const result = await DevCreds.findOneAndUpdate(
        { username: dev.username },
        { password: hashed },
        { new: true, upsert: true }   // create if not exists, update if exists
      );
      console.log(`✅  Updated: ${result.username}  (id: ${result._id})`);
    }

    console.log("\n──────────────────────────────────────");
    console.log("  Passwords reset successfully!");
    console.log("──────────────────────────────────────");

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

resetPasswords();
