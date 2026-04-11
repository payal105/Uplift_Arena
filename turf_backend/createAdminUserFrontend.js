const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const User = require("./src/models/User");
const UserData = require("./src/models/UserData");
const { hashPassword } = require("./src/utils/hash");
const connectDB = require("./src/config/db");

async function createAdminUser() {
  try {
    // Connect to database
    await connectDB();
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      email: "admin", 
      isAdmin: 1 
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists");
      await mongoose.connection.close();
      return;
    }

    // Hash the password
    const hashedPassword = await hashPassword("admin@1234");

    // Create admin user in User collection
    const adminUser = new User({
      name: "Admin",
      email: "admin",
      password: hashedPassword,
      isVerified: true,
      isActive: true,
      isAdmin: 1
    });

    await adminUser.save();
    console.log("✅ Admin user created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Username: admin");
    console.log("🔐 Password: admin@1234");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Also create entry in UserData for admin
    const adminUserData = new UserData({
      phone: "9999999999",
      email: "admin",
      city: "Admin",
      user_id: adminUser._id
    });

    await adminUserData.save();
    console.log("✅ Admin UserData created");

    await mongoose.connection.close();
    console.log("✅ Database connection closed\n");
  } catch (error) {
    console.error("❌ Error creating admin user:", error.message);
    process.exit(1);
  }
}

createAdminUser();
