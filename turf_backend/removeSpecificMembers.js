const mongoose = require("mongoose");
const UserData = require("./src/models/UserData");
require("dotenv").config();

const specificEmailsToRemove = [
  "payal@test.uplift",
  "rishikalpadas@gmail.com",
  "test@gmail.com",
  "payaladhikary2000@gmail.com"
];

const removeSpecificMembers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test");
    console.log("✅ Connected to MongoDB");

    const result = await UserData.deleteMany({ email: { $in: specificEmailsToRemove } });
    
    console.log(`✅ Successfully removed ${result.deletedCount} specific users from the database.`);
    console.log("===========================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error running removal script:", error);
    process.exit(1);
  }
};

removeSpecificMembers();
