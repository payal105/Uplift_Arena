const express = require("express");
const router = express.Router();
const user_dataController = require("../controllers/user_dataController");
const { authenticate } = require("../middlewares/auth");

// Public routes
router.post("/register", user_dataController.register);
router.post("/login", user_dataController.login);

// Protected routes
router.get("/profile", authenticate, user_dataController.getProfile);
router.put("/profile", authenticate, user_dataController.updateProfile);

module.exports = router;
