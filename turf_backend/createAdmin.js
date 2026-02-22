const mongoose = require("mongoose");
const AdminUser = require("./src/models/AdminUser");
const { hashPassword } = require("./src/utils/hash");
require("dotenv").config();

const createFirstAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/turf_booking");
    console.log("✅ Connected to MongoDB");

    // Check if admin already exists
    const existingAdmin = await AdminUser.findOne({});
    if (existingAdmin) {
      console.log("❌ Admin user already exists!");
      console.log("Email:", existingAdmin.email);
      process.exit(0);
    }

    // Create first admin
    const hashedPassword = await hashPassword("admin123");
    
    const admin = new AdminUser({
      name: "Super Admin",
      email: "admin@turf.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isActive: true
    });

    await admin.save();

    console.log("✅ First admin created successfully!");
    console.log("========================");
    console.log("Email: admin@turf.com");
    console.log("Password: admin123");
    console.log("========================");
    console.log("⚠️  Please change the password after first login!");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

createFirstAdmin();
