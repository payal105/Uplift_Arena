const express = require("express");
const router = express.Router();
const { submitContact, getAllContacts } = require("../controllers/contactController");
const { authenticate } = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/role");

router.post("/", submitContact);
router.get("/", authenticate, requireAdmin, getAllContacts);

module.exports = router;
