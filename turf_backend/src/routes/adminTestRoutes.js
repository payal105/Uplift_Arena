const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/role");

router.get(
  "/dashboard",
  protect,
  allowRoles("SUPER_ADMIN", "SCOPED_ADMIN"),
  (req, res) => {
    res.json({ message: "Admin Dashboard Access Granted" });
  }
);

module.exports = router;
