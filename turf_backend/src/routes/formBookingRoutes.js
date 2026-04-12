const express = require("express");
const router = express.Router();
const formBookingController = require("../controllers/formBookingController");
const { authenticate } = require("../middlewares/auth");

// Create booking (authenticated)
router.post("/", authenticate, formBookingController.createFormBooking);

// Get my bookings
router.get("/my", authenticate, formBookingController.getMyFormBookings);

// Admin: get all
router.get("/all", authenticate, formBookingController.getAllFormBookings);

// Admin: get booking details for a specific slot
router.get("/slot-details/:turfId", authenticate, formBookingController.getSlotBookingDetails);

module.exports = router;
