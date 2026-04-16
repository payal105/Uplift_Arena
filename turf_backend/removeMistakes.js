const mongoose = require("mongoose");
const UserData = require("./src/models/UserData");
const Membership = require("./src/models/Membership");
require("dotenv").config();

const emailsToRemove = [
  "sauravberlia.bff@gmail.com",
  "nirmal86kaushik@gmail.com",
  "agmudit@gmail.com",
  "gopal.dalmia13@gmail.com",
  "amanagarwal477@gmail.com",
  "akash@mytripmakers.in",
  "rohit@kamac.in",
  "r1.rahulbansal@gmail.com",
  "wamikabansal3@gmail.com"
];

const removeMistakes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/test");
    console.log("✅ Connected to MongoDB");

    // Remove from Membership first
    const membershipResult = await Membership.deleteMany({ email: { $in: emailsToRemove } });
    console.log(`✅ Removed ${membershipResult.deletedCount} entries from Membership.`);

    // Remove from UserData 
    const userResult = await UserData.deleteMany({ email: { $in: emailsToRemove } });
    console.log(`✅ Removed ${userResult.deletedCount} entries from UserData.`);

    console.log("===========================");
    console.log("Cleanup complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error running script:", error);
    process.exit(1);
  }
};

removeMistakes();
