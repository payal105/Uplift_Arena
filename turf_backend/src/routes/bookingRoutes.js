const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { authenticate } = require("../middlewares/auth");
const { requireAdmin } = require("../middlewares/role");

// User routes
router.get("/user/my-bookings", authenticate, bookingController.getUserBookings);
router.post("/", authenticate, bookingController.createBooking);
router.post("/verify-payment", authenticate, bookingController.verifyPayment);
router.get("/:id", authenticate, bookingController.getBookingById);
router.put("/:id/cancel", authenticate, bookingController.cancelBooking);

// Admin routes
router.get("/", authenticate, requireAdmin, bookingController.getAllBookings);
router.put("/:id", authenticate, requireAdmin, bookingController.updateBooking);
router.delete("/:id", authenticate, requireAdmin, bookingController.deleteBooking);

module.exports = router;
