const mongoose = require("mongoose");
const AdminUser = require("./src/models/AdminUser");
const { hashPassword } = require("./src/utils/hash");
require("dotenv").config();

const resetAdminPassword = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/turf_booking");
    console.log("✅ Connected to MongoDB");

    const email = "admin@example.com";
    const newPassword = "admin123";

    const admin = await AdminUser.findOne({ email });
    
    if (!admin) {
      console.log("❌ Admin not found with email:", email);
      process.exit(1);
    }

    const hashedPassword = await hashPassword(newPassword);
    admin.password = hashedPassword;
    await admin.save();

    console.log("✅ Admin password reset successfully!");
    console.log("========================");
    console.log("Email:", email);
    console.log("Password:", newPassword);
    console.log("========================");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

resetAdminPassword();
