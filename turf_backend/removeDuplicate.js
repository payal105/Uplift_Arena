require("dotenv").config();
const mongoose = require("mongoose");
const City = require("./src/models/City");

async function removeDuplicate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected\n");

    // Delete the newer duplicate
    await City.deleteOne({ _id: "6961d92ac9d9bcca13b94444" });
    console.log("✅ Deleted duplicate Kolkata city\n");

    const finalCities = await City.find({});
    console.log("📍 Final cities:");
    finalCities.forEach(city => {
      console.log(`   - ${city.name} (${city._id})`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.connection.close();
  }
}

removeDuplicate();
