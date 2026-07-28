const express = require("express");
const router = express.Router();
const { devLogin } = require("../controllers/devController");

// POST /api/dev/login  — authenticate against DevCreds collection
router.post("/login", devLogin);

module.exports = router;
