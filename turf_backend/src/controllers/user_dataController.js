const UserData = require("../models/UserData");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");
const crypto = require("crypto");
const { sendPasswordResetEmail } = require("../utils/emailService");

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await UserData.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserData.create({
      name,
      email,
      password: hashedPassword,
      isVerified: true,
      isAdmin: 0
    });

    const token = generateToken({ userId: user._id, role: "USER" });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        city: user.city || "",
        isAdmin: 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserData.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "Account is inactive" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ userId: user._id, role: "USER" });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        isAdmin: user.isAdmin || 0,
        isMember: user.isMember || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await UserData.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await UserData.findByIdAndUpdate(
      req.userId,
      { name, email },
      { new: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Forgot Password - Generate reset token and send email
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await UserData.findOne({ email });
    if (!user) {
      // Don't reveal if email exists for security
      return res.status(200).json({ message: "If an account exists with this email, you will receive a password reset link" });
    }

    // Generate reset token (32 random bytes converted to hex)
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Valid for 1 hour

    // Save token to database
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send email with reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(user.email, user.name, resetLink);

    res.status(200).json({ message: "If an account exists with this email, you will receive a password reset link" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset Password - Verify token and update password
exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: "Token and password are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Find user with valid reset token
    const user = await UserData.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users except admins, exclude password field
    const users = await UserData.find({ isAdmin: { $ne: 1 } }).select("-password");
    
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json({
      users: users,
      count: users.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
