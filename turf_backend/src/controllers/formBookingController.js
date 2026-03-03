const FormBooking = require("../models/FormBooking");

const TURF_LABELS = {
  'badminton-1': 'Badminton 1',
  'badminton-2': 'Badminton 2',
  'pickleball-1': 'Pickleball 1',
  'pickleball-2': 'Pickleball 2',
  'tennis-1': 'Tennis 1',
  'tennis-2': 'Tennis 2',
  'futsal-turf': 'Futsal Turf',
  'big-turf': 'Big Turf'
};

// Create a form booking
exports.createFormBooking = async (req, res) => {
  try {
    const {
      sport,
      turfId,
      bookingDate,
      fromTime,
      toTime,
      bringGuests,
      guestCount
    } = req.body;

    if (!turfId || !bookingDate || !fromTime || !toTime) {
      return res.status(400).json({ message: "turfId, bookingDate, fromTime and toTime are required" });
    }

    const customerName = req.user?.name || 'Guest';
    const email = req.user?.email || '';
    const phone = req.user?.phone || 'N/A';

    // Enforce Big Turf minimum 2 hours
    if (turfId === 'big-turf') {
      const [fH, fM] = fromTime.split(':').map(Number);
      const [tH, tM] = toTime.split(':').map(Number);
      const durationMinutes = (tH * 60 + tM) - (fH * 60 + fM);
      if (durationMinutes < 120) {
        return res.status(400).json({ message: "Big Turf requires a minimum booking of 2 hours" });
      }
    }

    const guests = bringGuests ? Math.max(1, parseInt(guestCount) || 1) : 0;
    const guestCharges = guests * 500;

    // Check for conflicting bookings on the same turf and date
    const conflict = await FormBooking.findOne({
      turfId,
      bookingDate,
      status: { $ne: 'cancelled' },
      $and: [
        { fromTime: { $lt: toTime } },
        { toTime: { $gt: fromTime } }
      ]
    });

    if (conflict) {
      return res.status(409).json({
        message: `This turf is already booked from ${conflict.fromTime} to ${conflict.toTime} on ${bookingDate}. Please choose a different time.`
      });
    }

    const booking = await FormBooking.create({
      user: req.userId || null,
      customerName,
      phone,
      email,
      sport: sport || 'GENERAL',
      turfId,
      turfName: TURF_LABELS[turfId] || turfId,
      bookingDate,
      fromTime,
      toTime,
      bringGuests: !!bringGuests,
      guestCount: guests,
      guestCharges
    });

    res.status(201).json({
      message: "Booking confirmed successfully",
      booking
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all form bookings for logged-in user
exports.getMyFormBookings = async (req, res) => {
  try {
    const bookings = await FormBooking.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all form bookings (Admin)
exports.getAllFormBookings = async (req, res) => {
  try {
    const bookings = await FormBooking.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
