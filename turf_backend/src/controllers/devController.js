const DevCreds = require("../models/DevCreds");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../utils/jwt");

// POST /api/dev/login
exports.devLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const dev = await DevCreds.findOne({ username: username.trim(), isActive: true });
    if (!dev) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, dev.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Reuse the same JWT format so the existing auth middleware stays compatible
    const token = generateToken({
      id: dev._id,
      role: "SUPER_ADMIN",   // Dev creds carry full admin privileges
      isDev: true
    });

    res.json({
      message: "Login successful",
      token,
      admin: {
        id: dev._id,
        name: dev.username,
        username: dev.username,
        role: "SUPER_ADMIN"
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
