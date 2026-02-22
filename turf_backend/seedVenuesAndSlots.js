require("dotenv").config();
const mongoose = require("mongoose");
const City = require("./src/models/City");
const Venue = require("./src/models/Venue");
const Turf = require("./src/models/Turf");
const Slot = require("./src/models/Slot");

// Venue data for Siliguri and Kolkata
const venuesData = {
  Siliguri: [
    {
      name: "Green Valley Sports Complex",
      address: "Sevoke Road, Siliguri - 734001",
      turfs: [
        { name: "Cricket Ground A", sportType: "CRICKET", pricePerHour: 1200, amenities: ["Floodlights", "Parking", "Changing Room"] },
        { name: "Football Field 1", sportType: "FOOTBALL", pricePerHour: 1000, amenities: ["Floodlights", "Parking", "Washroom"] },
        { name: "Badminton Court 1", sportType: "BADMINTON", pricePerHour: 400, amenities: ["AC", "Parking", "Water"] },
        { name: "Tennis Court 1", sportType: "TENNIS", pricePerHour: 600, amenities: ["Floodlights", "Parking", "Water"] }
      ]
    },
    {
      name: "Mahananda Sports Arena",
      address: "Hill Cart Road, Siliguri - 734010",
      turfs: [
        { name: "Premium Cricket Turf", sportType: "CRICKET", pricePerHour: 1500, amenities: ["Floodlights", "Pavilion", "Scoreboard", "Parking"] },
        { name: "Football Arena", sportType: "FOOTBALL", pricePerHour: 1200, amenities: ["Floodlights", "Seating", "Parking"] },
        { name: "Tennis Court Premium", sportType: "TENNIS", pricePerHour: 800, amenities: ["Floodlights", "Parking", "Pro Shop"] }
      ]
    },
    {
      name: "City Sports Hub",
      address: "Pradhan Nagar, Siliguri - 734003",
      turfs: [
        { name: "Multi-Sport Turf 1", sportType: "FOOTBALL", pricePerHour: 900, amenities: ["Floodlights", "Parking"] },
        { name: "Badminton Complex", sportType: "BADMINTON", pricePerHour: 350, amenities: ["AC", "Parking", "Changing Room"] },
        { name: "Pickleball Court 1", sportType: "PICKLEBALL", pricePerHour: 500, amenities: ["Floodlights", "Water", "Parking"] },
        { name: "Tennis Court Standard", sportType: "TENNIS", pricePerHour: 550, amenities: ["Floodlights", "Parking"] }
      ]
    },
    {
      name: "North Bengal Sports Center",
      address: "Dagapur, Siliguri - 734015",
      turfs: [
        { name: "Cricket Academy Ground", sportType: "CRICKET", pricePerHour: 1300, amenities: ["Floodlights", "Nets", "Coaching", "Parking"] },
        { name: "Football Training Field", sportType: "FOOTBALL", pricePerHour: 1100, amenities: ["Floodlights", "Parking", "Washroom"] },
        { name: "Pickleball Court 2", sportType: "PICKLEBALL", pricePerHour: 450, amenities: ["Floodlights", "Parking", "Water"] }
      ]
    }
  ],
  Kolkata: [
    {
      name: "Salt Lake Sports Complex",
      address: "Salt Lake, Sector V, Kolkata - 700091",
      turfs: [
        { name: "Premium Cricket Pitch 1", sportType: "CRICKET", pricePerHour: 2000, amenities: ["Floodlights", "Pavilion", "Scoreboard", "Parking", "Washroom"] },
        { name: "Football Ground A", sportType: "FOOTBALL", pricePerHour: 1800, amenities: ["Floodlights", "Seating", "Parking"] },
        { name: "Badminton Arena 1", sportType: "BADMINTON", pricePerHour: 600, amenities: ["AC", "Parking", "Pro Shop"] },
        { name: "Tennis Court Elite", sportType: "TENNIS", pricePerHour: 1000, amenities: ["Floodlights", "Parking", "Washroom", "Pro Shop"] }
      ]
    },
    {
      name: "Rajarhat Sports Hub",
      address: "New Town, Rajarhat, Kolkata - 700156",
      turfs: [
        { name: "Cricket Stadium View", sportType: "CRICKET", pricePerHour: 2200, amenities: ["Floodlights", "Pavilion", "Scoreboard", "Parking", "Cafeteria"] },
        { name: "Football Championship Field", sportType: "FOOTBALL", pricePerHour: 1900, amenities: ["Floodlights", "Seating", "Parking", "Washroom"] },
        { name: "Badminton Courts (3 Courts)", sportType: "BADMINTON", pricePerHour: 700, amenities: ["AC", "Parking", "Changing Room", "Water"] },
        { name: "Pickleball Courts (2 Courts)", sportType: "PICKLEBALL", pricePerHour: 750, amenities: ["Floodlights", "Parking", "Water"] }
      ]
    },
    {
      name: "EM Bypass Sports Arena",
      address: "EM Bypass, Kasba, Kolkata - 700107",
      turfs: [
        { name: "Cricket Practice Ground", sportType: "CRICKET", pricePerHour: 1800, amenities: ["Floodlights", "Nets", "Parking"] },
        { name: "Football Turf Pro", sportType: "FOOTBALL", pricePerHour: 1600, amenities: ["Floodlights", "Parking", "Washroom"] },
        { name: "Pickleball Courts (4 Courts)", sportType: "PICKLEBALL", pricePerHour: 700, amenities: ["Floodlights", "Parking", "Water"] },
        { name: "Tennis Court Pro", sportType: "TENNIS", pricePerHour: 900, amenities: ["Floodlights", "Parking", "Pro Shop"] }
      ]
    },
    {
      name: "Lake Gardens Sports Complex",
      address: "Lake Gardens, Kolkata - 700045",
      turfs: [
        { name: "Elite Cricket Ground", sportType: "CRICKET", pricePerHour: 2500, amenities: ["Floodlights", "Pavilion", "Scoreboard", "Parking", "Club House"] },
        { name: "Football Field Elite", sportType: "FOOTBALL", pricePerHour: 2000, amenities: ["Floodlights", "Seating", "Parking", "Cafeteria"] },
        { name: "Badminton Center", sportType: "BADMINTON", pricePerHour: 650, amenities: ["AC", "Parking", "Pro Shop", "Coaching"] },
        { name: "Tennis Court Championship", sportType: "TENNIS", pricePerHour: 1200, amenities: ["Floodlights", "Parking", "Pro Shop", "Club House"] }
      ]
    },
    {
      name: "Behala Sports Park",
      address: "Behala, Kolkata - 700034",
      turfs: [
        { name: "Community Cricket Ground", sportType: "CRICKET", pricePerHour: 1500, amenities: ["Floodlights", "Parking", "Washroom"] },
        { name: "Football Academy Field", sportType: "FOOTBALL", pricePerHour: 1300, amenities: ["Floodlights", "Parking", "Coaching"] },
        { name: "Badminton Courts Complex", sportType: "BADMINTON", pricePerHour: 500, amenities: ["AC", "Parking", "Water"] },
        { name: "Pickleball Courts", sportType: "PICKLEBALL", pricePerHour: 600, amenities: ["Floodlights", "Parking", "Water"] }
      ]
    }
  ]
};

// Generate time slots for a given date
function generateSlots(date) {
  const slots = [];
  // Morning slots: 6 AM to 12 PM
  for (let hour = 6; hour < 12; hour++) {
    slots.push({
      date,
      startTime: `${hour.toString().padStart(2, '0')}:00`,
      endTime: `${(hour + 1).toString().padStart(2, '0')}:00`,
      status: "AVAILABLE"
    });
  }
  // Afternoon/Evening slots: 2 PM to 10 PM
  for (let hour = 14; hour < 22; hour++) {
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
