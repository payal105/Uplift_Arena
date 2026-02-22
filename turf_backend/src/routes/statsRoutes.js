const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");
const { authenticate } = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/role");

// Public stats - no authentication required
router.get("/public", statsController.getPublicStats);

// Admin dashboard stats - requires admin authentication
router.get("/dashboard", authenticate, requireAdmin, statsController.getDashboardStats);

// Detailed analytics - requires admin authentication
router.get("/analytics", authenticate, requireAdmin, statsController.getDetailedAnalytics);

module.exports = router;
