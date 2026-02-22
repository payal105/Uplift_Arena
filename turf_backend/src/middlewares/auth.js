const jwt = require("jsonwebtoken");
const AdminUser = require("../models/AdminUser");
const User = require("../models/User");

// General authentication middleware
const authenticate = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if it's an admin or user based on the token payload
    if (decoded.role && (decoded.role === "SUPER_ADMIN" || decoded.role === "SCOPED_ADMIN" || decoded.role === "TURF_MANAGER")) {
      req.admin = await AdminUser.findById(decoded.id).select("-password");
      req.userRole = decoded.role;
    } else {
      // It's a regular user
      req.user = await User.findById(decoded.userId).select("-password");
      req.userId = decoded.userId;
      req.userRole = decoded.role || "USER";
    }
    
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
};

// Admin-only authentication
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await AdminUser.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ message: "Token invalid" });
  }
};

module.exports = { authenticate, protect };
