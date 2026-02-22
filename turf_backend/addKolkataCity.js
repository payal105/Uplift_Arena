require("dotenv").config();
const mongoose = require("mongoose");
const City = require("./src/models/City");

async function addKolkataCity() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected\n");

    // Check existing cities
    const existingCities = await City.find({});
    console.log("📍 Existing cities:");
    existingCities.forEach(city => {
      console.log(`   - ${city.name} (${city._id})`);
    });
    console.log("\n");

    // Add Kolkata if it doesn't exist
    const kolkata = await City.findOne({ name: "Kolkata" });
    if (!kolkata) {
      const newCity = await City.create({
        name: "Kolkata",
        state: "West Bengal",
        country: "India",
        isActive: true
      });
      console.log(`✅ Added Kolkata city (${newCity._id})\n`);
    } else {
      console.log(`ℹ️  Kolkata city already exists (${kolkata._id})\n`);
    }

    // Show all cities again
    const allCities = await City.find({});
    console.log("📍 All cities after update:");
    allCities.forEach(city => {
      console.log(`   - ${city.name} (${city._id})`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 MongoDB connection closed");
  }
}

addKolkataCity();
