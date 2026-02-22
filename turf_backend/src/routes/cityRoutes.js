const express = require("express");
const router = express.Router();
const cityController = require("../controllers/cityController");
const { authenticate } = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/role");

// Public routes
router.get("/", cityController.getAllCities);
router.get("/:id", cityController.getCityById);

// Admin routes
router.post("/", authenticate, requireAdmin, cityController.createCity);
router.put("/:id", authenticate, requireAdmin, cityController.updateCity);
router.delete("/:id", authenticate, requireAdmin, cityController.deleteCity);

module.exports = router;
