const mongoose = require("mongoose");
const UserData = require("./src/models/UserData");
const Membership = require("./src/models/Membership");
const { hashPassword } = require("./src/utils/hash");
require("dotenv").config();

const usersToInsert = [
  { 
    name: "Shakti Agarwal", 
    email: "skt.shakti@gmail.com", 
    phone: "98000-11911", 
    startDate: "2026-03-17T00:00:00.000Z", 
    endDate: "2026-04-16T00:00:00.000Z", 
    type: "monthly-individual-activity", 
    activityChoice: "Badminton",
    prefix: "shakt" 
  },
  { 
    name: "Nancy Gupta", 
    email: "nancykansal6557@gmail.com", 
    phone: "97347-79899", 
    startDate: "2026-03-17T00:00:00.000Z", 
    endDate: "2026-04-16T00:00:00.000Z", 
    type: "monthly-individual-activity", 
    activityChoice: "Badminton",
    prefix: "nancy" 
  }
];

const insertMonthlyUsers = async () => {
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
    console.log("🎉 Monthly activity users inserted successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error running script:", error);
    process.exit(1);
  }
};

insertMonthlyUsers();
