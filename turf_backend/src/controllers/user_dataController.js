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

// Admin: Create user (Developer Dashboard)
exports.adminCreateUser = async (req, res) => {
  try {
    const { name, email, phone, city, password, isActive, isMember } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existing = await UserData.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const rawPassword = password || "Uplift@123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const user = await UserData.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      city: city || "",
      isVerified: true,
      isActive: isActive !== undefined ? isActive : true,
      isMember: isMember !== undefined ? Number(isMember) : 0,
      isAdmin: 0
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        isActive: user.isActive,
        isMember: user.isMember
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Update user (Developer Dashboard)
exports.adminUpdateUser = async (req, res) => {
  try {
    const { name, email, phone, city, isActive, isMember, password } = req.body;
    const { id } = req.params;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (city !== undefined) updateData.city = city;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isMember !== undefined) updateData.isMember = Number(isMember);
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await UserData.findByIdAndUpdate(
      id,
      updateData,
      { new: true, select: "-password" }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Bulk import users from Excel payload (Developer Dashboard)
exports.adminBulkImport = async (req, res) => {
  try {
    const { users } = req.body; // Array of user objects

    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "A non-empty users array is required" });
    }

    const results = { created: 0, updated: 0, errors: [] };
    const DEFAULT_PASSWORD = "Uplift@123";

    for (const u of users) {
      try {
        if (!u.name || !u.email) {
          results.errors.push({ email: u.email || "unknown", reason: "name and email are required" });
          continue;
        }

        const existing = await UserData.findOne({ email: u.email.toLowerCase().trim() });

        if (existing) {
          // Update existing user (never overwrite password from Excel)
          const updateData = {
            name: u.name || existing.name,
            phone: u.phone || existing.phone || "",
            city: u.city || existing.city || "",
            isActive: u.isActive !== undefined ? Boolean(u.isActive) : existing.isActive,
            isMember: u.isMember !== undefined ? Number(u.isMember) : existing.isMember
          };
          await UserData.findByIdAndUpdate(existing._id, updateData);
          results.updated++;
        } else {
          const hashedPassword = await bcrypt.hash(u.password || DEFAULT_PASSWORD, 10);
          await UserData.create({
            name: u.name,
            email: u.email.toLowerCase().trim(),
            password: hashedPassword,
            phone: u.phone || "",
            city: u.city || "",
            isVerified: true,
            isActive: u.isActive !== undefined ? Boolean(u.isActive) : true,
            isMember: u.isMember !== undefined ? Number(u.isMember) : 0,
            isAdmin: 0
          });
          results.created++;
        }
      } catch (err) {
        results.errors.push({ email: u.email, reason: err.message });
      }
    }

    res.status(200).json({
      message: `Import complete: ${results.created} created, ${results.updated} updated`,
      ...results
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
