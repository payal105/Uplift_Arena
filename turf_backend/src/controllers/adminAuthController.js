const AdminUser = require("../models/AdminUser");
const { comparePassword, hashPassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

// Register first admin (public route)
exports.registerFirstAdmin = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please provide name, email, and password" });
    }

    const existingAdmin = await AdminUser.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin with this email already exists" });
    }

    if (username) {
      const existingUsername = await AdminUser.findOne({ username });
      if (existingUsername) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    const hashedPassword = await hashPassword(password);

    const newAdmin = new AdminUser({
      name,
      username: username || undefined,
      email,
      password: hashedPassword,
      role: "SUPER_ADMIN",
      isActive: true
    });

    await newAdmin.save();

    const token = generateToken({
      id: newAdmin._id,
      role: newAdmin.role
    });

    res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createSuperAdmin = async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please provide name, email, password, and role" })
    }

    const validRoles = ["SUPER_ADMIN", "SCOPED_ADMIN", "TURF_MANAGER"]
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: `Role must be one of: ${validRoles.join(", ")}` })
    }

    const existingAdmin = await AdminUser.findOne({ email })
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin with this email already exists" })
    }

    if (username) {
      const existingUsername = await AdminUser.findOne({ username })
      if (existingUsername) {
        return res.status(409).json({ message: "Username already taken" })
      }
    }

    const hashedPassword = await hashPassword(password)

    const newAdmin = new AdminUser({
      name,
      username: username || undefined,
      email,
      password: hashedPassword,
      role,
      isActive: true
    })

    await newAdmin.save()

    res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: newAdmin._id,
        name: newAdmin.name,
        username: newAdmin.username,
        email: newAdmin.email,
        role: newAdmin.role
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.loginAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Accept login by username OR email
    const identifier = username || email;
    if (!identifier || !password) {
      return res.status(400).json({ message: "Username/email and password are required" });
    }

    // Try to find by username first, then by email
    const admin = await AdminUser.findOne({
      $and: [
        { isActive: true },
        { $or: [{ username: identifier }, { email: identifier }] }
      ]
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await comparePassword(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken({
      id: admin._id,
      role: admin.role
    });

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        username: admin.username,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
