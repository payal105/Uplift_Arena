const mongoose = require("mongoose");
const UserData = require("./src/models/UserData");
const Membership = require("./src/models/Membership");
const { hashPassword } = require("./src/utils/hash");
require("dotenv").config();

const usersToInsert = [
  { 
    name: "Sahil Kedia", 
    email: "sahilkedia3@gmail.com", 
    phone: "97330-05945", 
    startDate: "2026-03-24T00:00:00.000Z", 
    endDate: "2026-04-23T00:00:00.000Z", 
    type: "monthly-individual-activity", 
    activityChoice: "Gym",
    prefix: "sahil" 
  },
  { 
    name: "Angel Gupta", 
    email: "angelgupta2924@gmail.com", 
    phone: "93825-48483", 
    startDate: "2026-03-30T00:00:00.000Z", 
    endDate: "2026-04-29T00:00:00.000Z", 
    type: "monthly-individual-activity", 
    activityChoice: "Gym",
    prefix: "angel" 
  },
  { 
    name: "Aishwarya Gupta", 
    email: "aishwaryagupta062002@gmail.com", 
    phone: "78650-50144", 
    startDate: "2026-03-30T00:00:00.000Z", 
    endDate: "2026-04-29T00:00:00.000Z", 
    type: "monthly-individual-activity", 
    activityChoice: "Gym",
    prefix: "aishw" 
  },
  { 
    name: "Akshay Sarawgi", 
    email: "doon.akshay@gmail.com", 
    phone: "94347-56789", 
    startDate: "2026-04-16T00:00:00.000Z", 
    endDate: "2026-05-15T00:00:00.000Z", 
    type: "monthly-individual-activity", 
    activityChoice: "Gym",
    prefix: "aksha" 
  },
  { 
    name: "Dr. Rajesh Kumar", 
    email: "orthocarepoint@gmail.com", 
    phone: "97493-87705", 
    startDate: "2026-04-15T00:00:00.000Z", 
    endDate: "2026-05-14T00:00:00.000Z", 
    type: "monthly-individual-activity", 
    activityChoice: "Gym",
    prefix: "rajes" 
  },
  { 
    name: "Mrs. Neelam Kumari", 
    email: "neelam2305@yahoo.com", 
    phone: "79081-86863", 
    startDate: "2026-04-15T00:00:00.000Z", 
    endDate: "2026-05-14T00:00:00.000Z", 
    type: "monthly-individual-activity", 
    activityChoice: "Gym",
    prefix: "neela" 
  },
  { 
    name: "Aman Agarwal", 
    email: "amanagarwal477@gmail.com", 
    phone: "84671-99068", 
    startDate: "2026-04-02T00:00:00.000Z", 
    endDate: "2026-05-01T00:00:00.000Z", 
    type: "monthly-individual-activity", 
    activityChoice: "Gym",
    prefix: "amana" 
  }
];

const insertGymUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test");
    console.log("✅ Connected to MongoDB");

    for (let u of usersToInsert) {
      const existingUser = await UserData.findOne({ email: u.email });
      if (existingUser) {
        console.log(`⚠️ User ${u.email} already exists! Skipping...`);
        continue;
      }

      const passwordRaw = `${u.prefix}@1234`;
      const hashedPassword = await hashPassword(passwordRaw);

      // Create User
      const newUser = new UserData({
        name: u.name,
        email: u.email,
        phone: u.phone,
        password: hashedPassword,
        isVerified: true,
        isActive: true,
        isMember: 1
      });

      const savedUser = await newUser.save();

      // Create Membership
      const newMembership = new Membership({
        userId: savedUser._id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        membershipType: u.type,
        activityChoice: u.activityChoice,
        startDate: new Date(u.startDate),
        endDate: new Date(u.endDate),
        isActive: 1,
        paymentStatus: "SUCCESS"
      });

      await newMembership.save();
      console.log(`✅ Inserted: ${u.name} | Password: ${passwordRaw} | Type: ${u.type} [${u.activityChoice}]`);
    }

    console.log("===========================");
    console.log("🎉 Monthly Gym users inserted successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error running script:", error);
    process.exit(1);
  }
};

insertGymUsers();
