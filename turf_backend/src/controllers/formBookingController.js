const FormBooking = require("../models/FormBooking");
const Membership = require("../models/Membership");
const UserData = require("../models/UserData");
const { sendBookingConfirmationEmail } = require("../utils/emailService");

// Maps membership activityChoice → booking sport key
const ACTIVITY_TO_SPORT = {
  'Badminton': 'BADMINTON',
  'Tennis': 'TENNIS',
  'Pickleball': 'PICKLEBALL',
};

const TURF_LABELS = {
  'badminton-1': 'Badminton 1',
  'badminton-2': 'Badminton 2',
  'badminton-court1': 'Badminton (Court 1)',
  'badminton-court4': 'Badminton (Court 4)',
  'pickleball-1': 'Pickleball 1',
  'pickleball-2': 'Pickleball 2',
  'pickleball-court2': 'Pickleball (Court 2)',
  'pickleball-court3': 'Pickleball (Court 3)',
  'tennis-1': 'Tennis 1',
  'tennis-2': 'Tennis 2',
  'tennis-court1': 'Tennis (Court 1)',
  'tennis-court2': 'Tennis (Court 2)',
  'futsal-turf': 'Futsal Turf',
  'big-turf': 'Big Turf'
};

// Create a form booking (single record, slots stored as array)
exports.createFormBooking = async (req, res) => {
  try {
    const {
      sport,
      turfId,
      bookingDate,
      slots,
      bringGuests,
      guestCount
    } = req.body;

    if (!turfId || !bookingDate) {
      return res.status(400).json({ message: "turfId and bookingDate are required" });
    }

    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: "At least one slot is required" });
    }

    if (slots.some(s => !s.startTime || !s.endTime)) {
      return res.status(400).json({ message: "Each slot must have startTime and endTime" });
    }

    // Verify the user is an active member and the sport matches their membership
    const userData = await UserData.findById(req.userId).select('isMember');
    if (!userData || userData.isMember !== 1) {
      return res.status(403).json({ message: "Free bookings are only available to active members." });
    }
    const activeMembership = await Membership.findOne({ userId: req.userId, isActive: 1 });
    if (activeMembership && activeMembership.activityChoice) {
      const allowedSport = ACTIVITY_TO_SPORT[activeMembership.activityChoice];
      if (allowedSport && (sport || 'GENERAL').toUpperCase() !== allowedSport) {
        return res.status(403).json({
          message: `Your membership only covers ${activeMembership.activityChoice}. Please use the standard booking flow to pay for other sports.`
        });
      }
    }

    const computeToDate = (date, from, to) => {
      if (to <= from) {
        const [y, m, d] = date.split('-').map(Number);
        const next = new Date(y, m - 1, d + 1);
        return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
      }
      return date;
    };

    const customerName = req.user?.name || 'Guest';
    const email = req.user?.email || '';
    const phone = req.user?.phone || 'N/A';
    const guests = bringGuests ? Math.max(1, parseInt(guestCount) || 1) : 0;
    const guestCharges = guests * 500;

    // Sort slots by startTime
    const sortedSlots = slots.slice().sort((a, b) => a.startTime.localeCompare(b.startTime));
    const fromTime = sortedSlots[0].startTime;
    const toTime = sortedSlots[sortedSlots.length - 1].endTime;
    const toDate = computeToDate(bookingDate, fromTime, toTime);

    // Big Turf / Cricket: total duration across all slots must be >= 2 hours
    if (turfId === 'big-turf' || turfId === 'cricket-turf') {
      const totalMins = sortedSlots.reduce((sum, s) => {
        const [fH, fM] = s.startTime.split(':').map(Number);
        const [tH, tM] = s.endTime.split(':').map(Number);
        let diff = (tH * 60 + tM) - (fH * 60 + fM);
        if (diff <= 0) diff += 24 * 60;
        return sum + diff;
      }, 0);
      const label = turfId === 'cricket-turf' ? 'Cricket' : 'Big Turf';
      if (totalMins < 120) {
        return res.status(400).json({ message: `${label} requires a minimum booking of 2 hours` });
      }
    }

    // Enforce per-user per-day per-sport hour limit
    if (req.userId) {
      const isBigTurf = turfId === 'big-turf';
      const isCricket = turfId === 'cricket-turf';
      const maxMinutes = (isBigTurf || isCricket) ? 120 : 60;
      const calcMins = (slotArr) => slotArr.reduce((sum, s) => {
        const [fH, fM] = s.startTime.split(':').map(Number);
        const [tH, tM] = s.endTime.split(':').map(Number);
        let diff = (tH * 60 + tM) - (fH * 60 + fM);
        if (diff <= 0) diff += 24 * 60;
        return sum + diff;
      }, 0);

      const existingBookings = await FormBooking.find({
        user: req.userId,
        sport: sport || 'GENERAL',
        bookingDate,
        status: { $ne: 'cancelled' }
      });
      const alreadyBookedMins = existingBookings.reduce((sum, b) => sum + calcMins(b.slots), 0);
      const newMins = calcMins(sortedSlots);

      if (alreadyBookedMins + newMins > maxMinutes) {
        const label = isBigTurf ? 'Big Turf' : isCricket ? 'Cricket' : (sport || 'this sport');
        const maxHrs = (isBigTurf || isCricket) ? 2 : 1;
        return res.status(400).json({
          message: `You can only book ${label} for a maximum of ${maxHrs} hour${maxHrs > 1 ? 's' : ''} per day.`
        });
      }
    }

    // Block specific slots on 18th April 2026
    for (const slot of sortedSlots) {
      if (bookingDate === '2026-04-18' && ['18:00', '19:00', '20:00', '21:00'].includes(slot.startTime)) {
        return res.status(400).json({ message: "Slots between 6 PM and 10 PM on 18th April are unavailable." });
      }
    }

    // Check conflicts for each slot
    for (const slot of sortedSlots) {
      const conflict = await FormBooking.findOne({
        turfId,
        bookingDate,
        status: { $ne: 'cancelled' },
        slots: { $elemMatch: { startTime: { $lt: slot.endTime }, endTime: { $gt: slot.startTime } } }
      });
      if (conflict) {
        return res.status(409).json({
          message: `This turf is already booked for a slot overlapping ${slot.startTime}–${slot.endTime} on ${bookingDate}.`
        });
      }
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
      toDate,
      fromTime,
      toTime,
      slots: sortedSlots,
      bringGuests: !!bringGuests,
      guestCount: guests,
      guestCharges
    });

    // Send confirmation email to the logged-in user's email
    const userEmail = req.user?.email || booking.email;
    try {
      await sendBookingConfirmationEmail(booking, userEmail);
    } catch (err) {
      console.error("Email send failed:", err.message);
    }

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

// Get booking details for a specific slot (Admin)
exports.getSlotBookingDetails = async (req, res) => {
  try {
    const { turfId } = req.params;
    const { date, startTime } = req.query;

    if (!turfId || !date || !startTime) {
      return res.status(400).json({ message: "turfId, date, and startTime are required" });
    }

    const booking = await FormBooking.findOne({
      turfId,
      bookingDate: date,
      slots: {
        $elemMatch: { startTime }
      },
      status: { $ne: 'cancelled' }
    })
      .populate("user", "name email phone")
      .lean();

    if (!booking) {
      return res.status(404).json({ message: "No booking found for this slot" });
    }

    // Find the specific slot
    const slot = booking.slots.find(s => s.startTime === startTime);

    res.json({
      bookingId: booking._id,
      customerName: booking.customerName,
      email: booking.email,
      phone: booking.phone || 'N/A',
      totalCost: booking.totalAmount || 0,
      fromTime: slot?.startTime || '',
      toTime: slot?.endTime || '',
      notes: booking.notes || '',
      _id: booking._id
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
