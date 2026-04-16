const mongoose = require("mongoose");
const UserData = require("./src/models/UserData");
const Membership = require("./src/models/Membership");
const { hashPassword } = require("./src/utils/hash");
require("dotenv").config();

const insertRahul = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test");
    console.log("✅ Connected to MongoDB");

    const email = "ca.rahulslg@gmail.com";
    const name = "Rahul Agarwal";
    const phone = "98323-55580";
    const passwordRaw = "rahul@1234";

    // 1. Create UserData
    const existingUser = await UserData.findOne({ email });
    if (existingUser) {
      console.log(`⚠️ User ${email} already exists! Skipping user creation...`);
      process.exit(0);
    }

    const hashedPassword = await hashPassword(passwordRaw);

    const newUser = new UserData({
      name,
      email,
      phone,
      password: hashedPassword,
      isVerified: true,
      isActive: true,
      isMember: 1 // Crucial
    });

    const savedUser = await newUser.save();
    console.log(`✅ Created UserData for ${name}.`);

    // 2. Create Membership 
    const startDate = new Date("2026-02-19T00:00:00.000Z"); // 19-02-2026
    const endDate = new Date("2027-02-18T00:00:00.000Z");   // 18-02-2027

    const newMembership = new Membership({
      userId: savedUser._id,
      name,
      email,
      phone,
      membershipType: "annual-individual-club",
      activityChoice: null,
      startDate,
      endDate,
      isActive: 1,
      paymentStatus: "SUCCESS"
    });

    await newMembership.save();
    console.log(`✅ Created Membership for ${name} [${startDate.toDateString()} to ${endDate.toDateString()}]`);

    console.log("===========================");
    console.log("🎉 Rahul Agarwal inserted successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error running script:", error);
    process.exit(1);
  }
};

insertRahul();
