/**
 * Seed DevCreds collection
 * Creates: payalDev, rishiDev
 * Run: node seedDevCreds.js
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

const DEVS = [
  { username: "payalDev", password: "P@y@l24092000" },
  { username: "rishiDev", password: "footb@ll5TEAM" },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB\n");

    for (const dev of DEVS) {
      const existing = await DevCreds.findOne({ username: dev.username });

      if (existing) {
        console.log(`⚠️  "${dev.username}" already exists — skipping.`);
        continue;
      }

      const hashed = await bcrypt.hash(dev.password, 10);
      const created = await DevCreds.create({ username: dev.username, password: hashed });

      console.log(`✅  Created: ${created.username}  (id: ${created._id})`);
    }

    console.log("\n──────────────────────────────────────");
    console.log("  DevCreds seeded successfully!");
    console.log("  Login at : http://localhost:5175");
    console.log("  payalDev : P@y@l24092000");
    console.log("  rishiDev : Footb@ll5TEAM");
    console.log("──────────────────────────────────────");

  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
