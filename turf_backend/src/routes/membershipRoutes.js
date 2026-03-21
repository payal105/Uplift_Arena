const express = require("express");
const router = express.Router();
const membershipController = require("../controllers/membershipController");
const { authenticate } = require("../middlewares/auth");

// All routes require authentication
router.post("/", authenticate, membershipController.createMembership);
router.get("/my", authenticate, membershipController.getMyMembership);

module.exports = router;
