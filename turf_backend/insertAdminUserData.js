const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const { hashPassword } = require("./src/utils/hash");

async function insertAdminUser() {
  try {
    // Connect to MongoDB using the uplift_arena database
    const mongoUri = "mongodb+srv://uplift:uplift%4012345678@cluster0.e9yk8ur.mongodb.net/uplift_arena?retryWrites=true&w=majority";
    
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to uplift_arena database");

    // Get the database and collection
    const db = mongoose.connection.db;
    const userdatasCollection = db.collection("userdatas");

    // Hash the password
    const hashedPassword = await hashPassword("admin@1234");

    // Check if admin already exists
    const existingAdmin = await userdatasCollection.findOne({ email: "admin" });
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists in userdatas collection");
      await mongoose.connection.close();
      return;
    }

    // Create admin user document
    const adminUser = {
      email: "admin",
      password: hashedPassword,
      name: "Admin",
      phone: "9999999999",
      city: "Admin City",
      isAdmin: 1,
      isVerified: 1,
      isActive: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the record
    const result = await userdatasCollection.insertOne(adminUser);
    
    console.log("✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email: admin");
    console.log("🔐 Password: admin@1234");
    console.log("🗂️  Database: uplift_arena");
    console.log("📊 Collection: userdatas");
    console.log("🆔 Document ID:", result.insertedId);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    await mongoose.connection.close();
    console.log("✅ Database connection closed\n");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
}

insertAdminUser();
