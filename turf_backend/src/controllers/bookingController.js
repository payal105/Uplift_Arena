const Booking = require("../models/Booking");
const Slot = require("../models/Slot");
const Turf = require("../models/Turf");
const Venue = require("../models/Venue");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Initialize Razorpay (only if credentials are provided)
let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });
}

// Create booking
exports.createBooking = async (req, res) => {
  try {
    const { slotId, venueId, bookingDate } = req.body;

    // Verify venue and slot
    const venue = await Venue.findById(venueId).populate('turf');
    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    const slot = await Slot.findById(slotId);
    if (!slot) {
      return res.status(404).json({ message: "Slot not found" });
    }
    
    if (!slot.isAvailable) {
      return res.status(400).json({ message: "Slot not available" });
    }

    // Create booking
    const booking = await Booking.create({
      turf: venue.turf._id,
      venue: venueId,
      slot: slotId,
      user: req.userId || null,
      bookingDate,
      customerName: req.user?.name || 'Guest',
      phone: req.user?.phone || '',
      totalAmount: slot.price || 0,
      bookingType: "ONLINE",
      paymentStatus: "SUCCESS",
      status: "confirmed"
    });

    // Update slot availability
    await Slot.findByIdAndUpdate(slotId, { isAvailable: false });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('venue')
      .populate('slot')
      .populate('turf');

    res.status(201).json({
      message: "Booking created successfully",
      booking: populatedBooking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      bookingId 
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // Update booking
      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { 
          paymentStatus: "SUCCESS",
          paymentRef: razorpay_payment_id
        },
        { new: true }
      );

      res.json({ 
        message: "Payment verified successfully", 
        booking 
      });
    } else {
      // Update booking as failed
      await Booking.findByIdAndUpdate(bookingId, { 
        paymentStatus: "FAILED" 
      });

      res.status(400).json({ message: "Payment verification failed" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.userId })
      .populate({
        path: "venue",
        populate: { path: "turf" }
      })
      .populate("slot")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("turf", "name sportType pricePerHour")
      .populate("slot", "date startTime endTime")
      .populate("user", "name phone email");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all bookings (Admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const { date, turfId, status } = req.query;
    const filter = {};

    if (date) filter.bookingDate = date;
    if (turfId) filter.turf = turfId;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate({
        path: "venue",
        populate: { path: "turf" }
      })
      .populate("slot")
      .populate("user", "name phone email")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel booking
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user owns the booking or is admin
    if (booking.user && booking.user.toString() !== req.userId && !req.admin) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update booking status to cancelled
    booking.status = "cancelled";
    booking.paymentStatus = "REFUNDED";
    await booking.save();

    // Update slot status back to available
    await Slot.findByIdAndUpdate(booking.slot, { status: "AVAILABLE" });

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update booking (Admin only)
exports.updateBooking = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (status) booking.status = status;
    if (paymentStatus) booking.paymentStatus = paymentStatus;

    await booking.save();

    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete booking (Admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update slot status back to available
    await Slot.findByIdAndUpdate(booking.slot, { status: "AVAILABLE" });

    // Delete booking
    await Booking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
