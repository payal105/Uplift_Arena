const express = require("express");
const router = express.Router();
const userAuthController = require("../controllers/userAuthController");
const { authenticate } = require("../middlewares/auth");

// Public routes
router.post("/register", userAuthController.register);
router.post("/login", userAuthController.login);

// Protected routes
router.get("/profile", authenticate, userAuthController.getProfile);
router.put("/profile", authenticate, userAuthController.updateProfile);

module.exports = router;
