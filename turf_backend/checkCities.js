require("dotenv").config();
const mongoose = require("mongoose");
const City = require("./src/models/City");

async function checkCities() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const cities = await City.find({});
    console.log("\nCities in database:");
    cities.forEach(city => {
      console.log(`Name: "${city.name}" (length: ${city.name.length})`);
      console.log(`ID: ${city._id}`);
      console.log(`Char codes: ${[...city.name].map(c => c.charCodeAt(0)).join(', ')}`);
      console.log('---');
    });

    // Try to find with trim
    const kolkata1 = await City.findOne({ name: "Kolkata" });
    const kolkata2 = await City.findOne({ name: "Kolkata " });
    const kolkata3 = await City.findOne({ name: /Kolkata/i });
    
    console.log(`\nSearch results:`);
    console.log(`"Kolkata": ${kolkata1 ? kolkata1._id : 'not found'}`);
    console.log(`"Kolkata ": ${kolkata2 ? kolkata2._id : 'not found'}`);
    console.log(`/Kolkata/i: ${kolkata3 ? kolkata3._id : 'not found'}`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.connection.close();
  }
}

checkCities();
