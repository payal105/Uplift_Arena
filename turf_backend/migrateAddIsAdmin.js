const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

async function addIsAdminColumn() {
  try {
    console.log("🔄 Starting migration to add isAdmin column...\n");
    
    // Connect to MongoDB
    const mongoUri = "mongodb+srv://uplift:uplift%4012345678@cluster0.e9yk8ur.mongodb.net/uplift_arena?retryWrites=true&w=majority";
    
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to uplift_arena database");

    const db = mongoose.connection.db;
    const userdatasCollection = db.collection("userdatas");

    // Step 1: Add isAdmin field to all existing documents (default 0)
    const updateResult = await userdatasCollection.updateMany(
      { isAdmin: { $exists: false } },
      { $set: { isAdmin: 0 } }
    );

    console.log(`✅ Updated ${updateResult.modifiedCount} documents: added isAdmin: 0`);

    // Step 2: Set admin user to isAdmin: 1
    const adminUpdateResult = await userdatasCollection.updateOne(
      { email: "admin" },
      { $set: { isAdmin: 1 } }
    );

    console.log(`✅ Updated admin user: isAdmin: 1`);

    // Step 3: Show summary
    const totalUsers = await userdatasCollection.countDocuments();
    const adminUsers = await userdatasCollection.countDocuments({ isAdmin: 1 });
    const regularUsers = await userdatasCollection.countDocuments({ isAdmin: 0 });

    console.log("\n📊 Migration Summary:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Admin Users (isAdmin=1): ${adminUsers}`);
    console.log(`Regular Users (isAdmin=0): ${regularUsers}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Step 4: Show sample admin user
    const adminUser = await userdatasCollection.findOne({ email: "admin" });
    if (adminUser) {
      console.log("\n👤 Admin User Details:");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(`Email: ${adminUser.email}`);
      console.log(`Name: ${adminUser.name}`);
      console.log(`isAdmin: ${adminUser.isAdmin}`);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    await mongoose.connection.close();
    console.log("\n✅ Migration completed successfully!\n");
  } catch (error) {
    console.error("❌ Error during migration:", error.message);
    process.exit(1);
  }
}

addIsAdminColumn();
