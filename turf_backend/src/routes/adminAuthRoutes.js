const express = require("express");
const router = express.Router();
const { createSuperAdmin, loginAdmin, registerFirstAdmin } = require("../controllers/adminAuthController");
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/role");

router.post("/register", registerFirstAdmin); // Public route for first admin
router.post("/create", protect, allowRoles("SUPER_ADMIN"), createSuperAdmin);
router.post("/login", loginAdmin);

module.exports = router;
