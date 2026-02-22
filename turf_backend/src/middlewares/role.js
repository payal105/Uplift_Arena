const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.admin.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

const requireAdmin = (req, res, next) => {
  if (!req.admin && !req.userRole) {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
  
  const adminRoles = ["SUPER_ADMIN", "SCOPED_ADMIN", "TURF_MANAGER"];
  if (!adminRoles.includes(req.userRole)) {
    return res.status(403).json({ message: "Access denied - Admin only" });
  }
  
  next();
};

module.exports = { allowRoles, requireAdmin };
