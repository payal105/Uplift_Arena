const express = require("express");
const router = express.Router();
const turfController = require("../controllers/turfController");
const { authenticate } = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/role");
const upload = require("../middlewares/upload");

// Public routes
router.get("/", turfController.getAllTurfs);
router.get("/sport/:sportType", turfController.getTurfsBySportType);
router.get("/:id/slots", turfController.getTurfWithSlots);
router.get("/:id", turfController.getTurfById);

// Admin routes
router.post("/", authenticate, requireAdmin, upload.array('images', 5), turfController.createTurf);
router.put("/:id", authenticate, requireAdmin, upload.array('images', 5), turfController.updateTurf);
router.delete("/:id", authenticate, requireAdmin, turfController.deleteTurf);

module.exports = router;
