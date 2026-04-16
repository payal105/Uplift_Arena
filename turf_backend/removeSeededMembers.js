const mongoose = require("mongoose");
const UserData = require("./src/models/UserData");
require("dotenv").config();

const seededEmails = [
  "ca.rahulslg@gmail.com",
  "sauravberlia.bff@gmail.com",
  "nirmal86kaushik@gmail.com",
  "agmudit@gmail.com",
  "gopal.dalmia13@gmail.com",
  "akash@mytripmakers.in",
  "rohit@kamac.in",
  "r1.rahulbansal@gmail.com",
  "wamikabansal3@gmail.com",
  "akash.agarwal711@gmail.com",
  "skt.shakti@gmail.com",
  "nancykansal6557@gmail.com",
  "sahilkedia3@gmail.com",
  "angelgupta2924@gmail.com",
  "aishwaryagupta062002@gmail.com",
  "doon.akshay@gmail.com",
  "orthocarepoint@gmail.com",
  "neelam2305@yahoo.com",
  "amanagarwal477@gmail.com"
];

const removeSeededMembers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test");
    console.log("✅ Connected to MongoDB");

    const result = await UserData.deleteMany({ email: { $in: seededEmails } });
    
    console.log(`✅ Successfully removed ${result.deletedCount} seeded users from the database.`);
    console.log("===========================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error running removal script:", error);
    process.exit(1);
  }
};

removeSeededMembers();
