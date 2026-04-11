const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const { hashPassword } = require("./src/utils/hash");

async function createBackendAdminUser() {
  try {
    console.log("🔄 Creating admin user in backend...\n");
    
    // Connect to MongoDB with test database (backend)
    const mongoUri = "mongodb+srv://uplift:uplift%4012345678@cluster0.e9yk8ur.mongodb.net/test?retryWrites=true&w=majority";
    
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to backend database");

    const db = mongoose.connection.db;
    const userdatasCollection = db.collection("userdatas");

    // Check if admin already exists
    const existingAdmin = await userdatasCollection.findOne({ email: "admin@admin.com" });
    if (existingAdmin) {
      console.log("⚠️  Admin user already exists in backend");
      console.log(`Admin ID: ${existingAdmin._id}`);
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`isAdmin: ${existingAdmin.isAdmin}`);
      await mongoose.connection.close();
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword("admin@1234");

    // Create admin user document
    const adminUser = {
      name: "Admin",
      email: "admin@admin.com",
      password: hashedPassword,
      phone: "9999999999",
      city: "Admin City",
      isVerified: true,
      isActive: true,
      isAdmin: 1,
      isMember: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Insert the record
    const result = await userdatasCollection.insertOne(adminUser);
    
    console.log("\n✅ Backend admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email: admin@admin.com");
    console.log("🔐 Password: admin@1234");
    console.log("👑 Status: ADMIN (isAdmin: 1)");
    console.log("📊 Database: test");
    console.log("📚 Collection: userdatas");
    console.log("🆔 Document ID:", result.insertedId);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    await mongoose.connection.close();
    console.log("\n✅ Backend admin user creation completed!\n");
  } catch (error) {
    console.error("❌ Error creating backend admin user:", error.message);
    process.exit(1);
  }
}

createBackendAdminUser();
