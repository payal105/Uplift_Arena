require("dotenv").config();
const mongoose = require("mongoose");
const City = require("./src/models/City");
const Venue = require("./src/models/Venue");

async function cleanupDuplicateCities() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected\n");

    // Find all cities
    const cities = await City.find({}).sort({ createdAt: 1 });
    console.log("📍 All cities:");
    cities.forEach(city => {
      console.log(`   - ${city.name} (${city._id}) - Created: ${city.createdAt}`);
    });

    // Group by name
    const cityGroups = {};
    cities.forEach(city => {
      if (!cityGroups[city.name]) {
        cityGroups[city.name] = [];
      }
      cityGroups[city.name].push(city);
    });

    // Remove duplicates (keep the oldest one with venues)
    for (const [name, citiesWithSameName] of Object.entries(cityGroups)) {
      if (citiesWithSameName.length > 1) {
        console.log(`\n⚠️  Found ${citiesWithSameName.length} entries for ${name}`);
        
        // Check which city has venues
        for (const city of citiesWithSameName) {
          const venueCount = await Venue.countDocuments({ city: city._id });
          console.log(`   ${city._id} has ${venueCount} venues`);
        }

        // Keep the one with most venues (or oldest if tied)
        const cityWithVenues = citiesWithSameName.sort((a, b) => {
          return b.createdAt - a.createdAt; // Keep newest
        })[citiesWithSameName.length - 1];

        console.log(`   Keeping: ${cityWithVenues._id}`);

        // Delete others
        for (const city of citiesWithSameName) {
          if (city._id.toString() !== cityWithVenues._id.toString()) {
            const venueCount = await Venue.countDocuments({ city: city._id });
            if (venueCount === 0) {
              await City.deleteOne({ _id: city._id });
              console.log(`   ❌ Deleted duplicate: ${city._id}`);
            } else {
              console.log(`   ⚠️  Skipping ${city._id} - has venues`);
            }
          }
        }
      }
    }

    console.log("\n\n✅ Cleanup completed");

    // Show final cities
    const finalCities = await City.find({});
    console.log("\n📍 Final cities:");
    finalCities.forEach(city => {
      console.log(`   - ${city.name} (${city._id})`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 MongoDB connection closed");
  }
}

cleanupDuplicateCities();
