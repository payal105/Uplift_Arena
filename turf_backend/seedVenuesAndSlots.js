require("dotenv").config();
const mongoose = require("mongoose");
const City = require("./src/models/City");
const Venue = require("./src/models/Venue");
const Turf = require("./src/models/Turf");
const Slot = require("./src/models/Slot");

// Venue data for Siliguri and Kolkata
const venuesData = {
  Kolkata: [
    {
      name: "Uplift Sports Arena",
      address: "Kolkata",
      turfs: [
        { name: "Futsal Turf", sportType: "FOOTBALL", pricePerHour: 1200, amenities: ["Floodlights", "Parking"] },
        { name: "Cricket Turf", sportType: "CRICKET", pricePerHour: 1500, amenities: ["Floodlights", "Parking"] },
        { name: "Pickleball (Court 2)", sportType: "PICKLEBALL", pricePerHour: 800, amenities: ["Floodlights", "Water"] },
        { name: "Pickleball (Court 3)", sportType: "PICKLEBALL", pricePerHour: 800, amenities: ["Floodlights", "Water"] },
        { name: "Badminton(Court 1)", sportType: "BADMINTON", pricePerHour: 500, amenities: ["AC", "Water"] },
        { name: "Badminton(Court 4)", sportType: "BADMINTON", pricePerHour: 500, amenities: ["AC", "Water"] },
        { name: "Tennis (Court 1)", sportType: "TENNIS", pricePerHour: 1000, amenities: ["Floodlights", "Parking"] },
        { name: "Tennis (Court 2)", sportType: "TENNIS", pricePerHour: 1000, amenities: ["Floodlights", "Parking"] }
      ]
    }
  ]
};

// Generate time slots for a given date
function generateSlots(date) {
  const slots = [];
  // Morning slots: 6 AM to 10 AM
  for (let hour = 6; hour < 10; hour++) {
    slots.push({
      date,
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
      status: "AVAILABLE"
    });
  }
  // Evening slots: 6 PM to 10 PM
  for (let hour = 18; hour < 22; hour++) {
    slots.push({
      date,
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
      status: "AVAILABLE"
    });
  }
  return slots;
}

// Get dates for today and next 5 days
function getDateRange() {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    dates.push(dateStr);
  }
  return dates;
}

async function seedData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected\n");

    console.log("🗑️ Clearing existing slots...");
    await Slot.deleteMany({});
    console.log("✅ Existing slots cleared\n");

    const dates = getDateRange();
    console.log(`📅 Creating slots for dates: ${dates.join(", ")}\n`);

    // Process each city
    for (const [cityName, venues] of Object.entries(venuesData)) {
      console.log(`\n🏙️  Processing city: ${cityName}`);
      
      // Find the city (with regex to handle trailing spaces)
      const city = await City.findOne({ name: new RegExp(`^${cityName}\\s*$`, 'i') });
      if (!city) {
        console.log(`❌ City '${cityName}' not found. Skipping...`);
        continue;
      }
      console.log(`✅ Found city: ${cityName} (${city._id})`);

      // Process each venue
      for (const venueData of venues) {
        console.log(`\n  📍 Creating venue: ${venueData.name}`);
        
        // Check if venue already exists
        let venue = await Venue.findOne({ name: venueData.name, city: city._id });
        if (!venue) {
          venue = await Venue.create({
            city: city._id,
            name: venueData.name,
            address: venueData.address,
            isActive: true
          });
          console.log(`  ✅ Created venue: ${venueData.name}`);
        } else {
          console.log(`  ℹ️  Venue already exists: ${venueData.name}`);
        }

        // Process each turf
        for (const turfData of venueData.turfs) {
          console.log(`    🏟️  Processing turf: ${turfData.name}`);
          
          // Check if turf already exists
          let turf = await Turf.findOne({ name: turfData.name, venue: venue._id });
          if (!turf) {
            turf = await Turf.create({
              venue: venue._id,
              name: turfData.name,
              sportType: turfData.sportType,
              pricePerHour: turfData.pricePerHour,
              slotDurationMinutes: 60,
              bufferMinutes: 0,
              amenities: turfData.amenities,
              isActive: true
            });
            console.log(`    ✅ Created turf: ${turfData.name} (${turfData.sportType})`);
          } else {
            console.log(`    ℹ️  Turf already exists: ${turfData.name}`);
          }

          // Create slots for all dates
          let slotsCreated = 0;
          let slotsSkipped = 0;
          
          for (const date of dates) {
            const slotsForDate = generateSlots(date);
            
            for (const slotData of slotsForDate) {
              // Check if slot already exists
              const existingSlot = await Slot.findOne({
                turf: turf._id,
                date: slotData.date,
                startTime: slotData.startTime
              });

              if (!existingSlot) {
                await Slot.create({
                  turf: turf._id,
                  date: slotData.date,
                  startTime: slotData.startTime,
                  endTime: slotData.endTime,
                  status: slotData.status
                });
                slotsCreated++;
              } else {
                slotsSkipped++;
              }
            }
          }
          
          console.log(`    📅 Slots - Created: ${slotsCreated}, Skipped (already exist): ${slotsSkipped}`);
        }
      }
    }

    console.log("\n\n✅ ========================================");
    console.log("✅ SEED COMPLETED SUCCESSFULLY!");
    console.log("✅ ========================================\n");

    // Print summary
    const totalVenues = await Venue.countDocuments();
    const totalTurfs = await Turf.countDocuments();
    const totalSlots = await Slot.countDocuments();
    
    console.log("📊 DATABASE SUMMARY:");
    console.log(`   Total Venues: ${totalVenues}`);
    console.log(`   Total Turfs: ${totalTurfs}`);
    console.log(`   Total Slots: ${totalSlots}`);
    console.log("\n");

  } catch (error) {
    console.error("❌ Error seeding data:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 MongoDB connection closed");
  }
}

// Run the seed script
seedData();
