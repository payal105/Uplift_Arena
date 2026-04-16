const mongoose = require("mongoose");
const UserData = require("./src/models/UserData");
const Membership = require("./src/models/Membership");
const { hashPassword } = require("./src/utils/hash");
require("dotenv").config();

const usersToInsert = [
  { name: "Sourav Berlia", email: "sauravberlia.bff@gmail.com", phone: "0000000000", startDate: "2026-04-04T00:00:00.000Z", endDate: "2027-04-03T00:00:00.000Z", type: "annual-individual-club", prefix: "soura" },
  { name: "Nirmal Sharma", email: "nirmal86kaushik@gmail.com", phone: "70471-68949", startDate: "2026-02-26T00:00:00.000Z", endDate: "2027-02-25T00:00:00.000Z", type: "annual-individual-club", prefix: "nirma" },
  { name: "Mudit Agarwal", email: "agmudit@gmail.com", phone: "97330-06606", startDate: "2026-02-26T00:00:00.000Z", endDate: "2027-02-25T00:00:00.000Z", type: "annual-individual-club", prefix: "mudit" },
  { name: "Gopal Dalmia", email: "gopal.dalmia13@gmail.com", phone: "98326-58683", startDate: "2026-04-01T00:00:00.000Z", endDate: "2027-03-31T00:00:00.000Z", type: "annual-individual-club", prefix: "gopal" },
  { name: "Akash Biswakarma", email: "akash@mytripmakers.in", phone: "90021-12068", startDate: "2026-03-07T00:00:00.000Z", endDate: "2027-03-06T00:00:00.000Z", type: "annual-individual-club", prefix: "akash" },
  { name: "Rohit Agarwal", email: "rohit@kamac.in", phone: "98324-33492", startDate: "2026-03-24T00:00:00.000Z", endDate: "2027-03-23T00:00:00.000Z", type: "annual-individual-club", prefix: "rohit" },
  { name: "Rahul Bansal", email: "r1.rahulbansal@gmail.com", phone: "97752-81111", startDate: "2026-03-18T00:00:00.000Z", endDate: "2027-03-17T00:00:00.000Z", type: "annual-family-club", prefix: "rahul" },
  { name: "Vamika Bansal", email: "wamikabansal3@gmail.com", phone: "97752-81111", startDate: "2026-03-18T00:00:00.000Z", endDate: "2027-03-17T00:00:00.000Z", type: "annual-family-club", prefix: "vamik" }
];

const insertFinalUsers = async () => {
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
        phone: u.phone, // Already defaults to 0000000000 for Sourav
        membershipType: u.type,
        activityChoice: null,
        startDate: new Date(u.startDate),
        endDate: new Date(u.endDate),
        isActive: 1,
        paymentStatus: "SUCCESS"
      });

      await newMembership.save();
      console.log(`✅ Inserted: ${u.name} | Password: ${passwordRaw} | Type: ${u.type}`);
    }

    console.log("===========================");
    console.log("🎉 All 8 final users inserted successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error running script:", error);
    process.exit(1);
  }
};

insertFinalUsers();
