const express = require("express");
const router = express.Router();
const slotController = require("../controllers/slotController");
const { authenticate } = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/role");

// Public routes
router.get("/", slotController.getSlotsByDate);
router.get("/venue", slotController.getSlotsByVenue);

// Admin routes
router.post("/generate", authenticate, requireAdmin, slotController.generateSlots);
router.post("/bulk-generate", authenticate, requireAdmin, slotController.bulkGenerateSlots);
router.put("/:id", authenticate, requireAdmin, slotController.updateSlotStatus);
router.delete("/:id", authenticate, requireAdmin, slotController.deleteSlot);

module.exports = router;
