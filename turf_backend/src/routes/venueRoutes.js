const express = require("express");
const router = express.Router();
const venueController = require("../controllers/venueController");
const { authenticate } = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/role");

// Public routes
router.get("/", venueController.getAllVenues);
router.get("/city/:cityId", venueController.getVenuesByCity);
router.get("/:id", venueController.getVenueById);

// Admin routes
router.post("/", authenticate, requireAdmin, venueController.createVenue);
router.put("/:id", authenticate, requireAdmin, venueController.updateVenue);
router.delete("/:id", authenticate, requireAdmin, venueController.deleteVenue);

module.exports = router;
