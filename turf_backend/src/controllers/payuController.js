const crypto = require('crypto');
const FormBooking = require('../models/FormBooking');
const Membership = require('../models/Membership');
const UserData = require('../models/UserData');
const { sendBookingConfirmationEmail } = require('../utils/emailService');

const PAYU_KEY = process.env.PAYU_KEY;
const PAYU_SALT = process.env.PAYU_SALT;
const PAYU_MODE = (process.env.PAYU_MODE || 'TEST').toUpperCase();
const PAYU_URL = PAYU_MODE === 'LIVE'
  ? 'https://secure.payu.in/_payment'
  : 'https://test.payu.in/_payment';

const BACKEND_URL = (process.env.BACKEND_URL || 'https://uplift-arena-backend.vercel.app').replace(/\/$/, '');
const FRONTEND_URL = (process.env.FRONTEND_URL || 'https://booking.upliftsportsarena.com').replace(/\/$/, '');

const TURF_LABELS = {
  'badminton-court1': 'Badminton (Court 1)',
  'badminton-court4': 'Badminton (Court 4)',
  'pickleball-court2': 'Pickleball (Court 2)',
  'pickleball-court3': 'Pickleball (Court 3)',
  'tennis-court1': 'Tennis (Court 1)',
  'tennis-court2': 'Tennis (Court 2)',
  'futsal-turf': 'Futsal Turf',
  'big-turf': 'Big Turf',
};

const SPORT_RATES = {
  TENNIS: 1200, BADMINTON: 1200, PICKLEBALL: 1200,
  FUTSAL: 1200, CRICKET: 2000, BIG_TURF: 2000,
};

const MEMBERSHIP_PRICES = {
  'annual-individual-club': 30000,
  'annual-family-club': 50000,
  'annual-individual-activity': 18000,
  'monthly-individual-activity': 3000,
};

// -----------------------------------------------------------
// Hash helpers
// -----------------------------------------------------------
function generateHash({ txnid, amount, productinfo, firstname, email, udf1, udf2 }) {
  const str = [
    PAYU_KEY, txnid, amount, productinfo, firstname, email,
    udf1 || '', udf2 || '', '', '', '',  // udf1–udf5 (udf3/4/5 empty)
    '', '', '', '', '',                   // 5 additional empty fields
    PAYU_SALT,
  ].join('|');
  return crypto.createHash('sha512').update(str).digest('hex');
}

function verifyHash(body) {
  const { key, txnid, amount, productinfo, firstname, email,
    udf1 = '', udf2 = '', udf3 = '', udf4 = '', udf5 = '',
    status, hash } = body;
  const str = [
    PAYU_SALT, status,
    '', '', '', '', '',             // additional_charges, net_amount_debit, unmappedstatus, bankcode, error_Message
    udf5, udf4, udf3, udf2, udf1,
    email, firstname, productinfo, amount, txnid, key,
  ].join('|');
  const expected = crypto.createHash('sha512').update(str).digest('hex');
  return expected === hash;
}

function generateTxnId() {
  // PayU txnid: max 25 chars, alphanumeric
  return crypto.randomUUID().replace(/-/g, '').substring(0, 20).toUpperCase();
}

// -----------------------------------------------------------
// POST /api/payments/payu/initiate-booking
// Creates a pending FormBooking and returns PayU form params
// -----------------------------------------------------------
exports.initiateBookingPayment = async (req, res) => {
  try {
    if (!PAYU_KEY || !PAYU_SALT) {
      return res.status(500).json({ message: 'Payment gateway is not configured.' });
    }

    const { sport, turfId, bookingDate, slots, bringGuests, guestCount } = req.body;

    if (!turfId || !bookingDate) {
      return res.status(400).json({ message: 'turfId and bookingDate are required.' });
    }
    if (!Array.isArray(slots) || slots.length === 0) {
      return res.status(400).json({ message: 'At least one slot is required.' });
    }
    if (slots.some(s => !s.startTime || !s.endTime)) {
      return res.status(400).json({ message: 'Each slot must have startTime and endTime.' });
    }

    // Pricing
    const sportKey = (sport || 'FUTSAL').toUpperCase();
    const ratePerHour = SPORT_RATES[sportKey] || 1200;
    const hours = slots.length;
    const courtTotal = ratePerHour * hours;
    const guests = bringGuests ? Math.max(1, parseInt(guestCount) || 1) : 0;
    const guestCharges = guests * 500;
    const totalAmount = courtTotal + guestCharges;

    // Sort and compute derived fields
    const sortedSlots = slots.slice().sort((a, b) => a.startTime.localeCompare(b.startTime));
    const fromTime = sortedSlots[0].startTime;
    const toTime = sortedSlots[sortedSlots.length - 1].endTime;

    const computeToDate = (date, from, to) => {
      if (to <= from) {
        const [y, m, d] = date.split('-').map(Number);
        const next = new Date(y, m - 1, d + 1);
        return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
      }
      return date;
    };
    const toDate = computeToDate(bookingDate, fromTime, toTime);

    // Enforce Big Turf / Cricket minimum 2 hours
    if (turfId === 'big-turf' || turfId === 'cricket-turf') {
      const totalMins = sortedSlots.reduce((sum, s) => {
        const [fH, fM] = s.startTime.split(':').map(Number);
        const [tH, tM] = s.endTime.split(':').map(Number);
        let diff = (tH * 60 + tM) - (fH * 60 + fM);
        if (diff <= 0) diff += 24 * 60;
        return sum + diff;
      }, 0);
      if (totalMins < 120) {
        const label = turfId === 'cricket-turf' ? 'Cricket' : 'Big Turf';
        return res.status(400).json({ message: `${label} requires a minimum booking of 2 hours.` });
      }
    }

    // Per-user per-day hour limit
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

      const existing = await FormBooking.find({
        user: req.userId,
        sport: sport || 'GENERAL',
        bookingDate,
        status: { $nin: ['cancelled'] },
        paymentStatus: { $nin: ['FAILED'] },
      });
      const alreadyMins = existing.reduce((sum, b) => sum + calcMins(b.slots), 0);
      const newMins = calcMins(sortedSlots);

      if (alreadyMins + newMins > maxMinutes) {
        const label = isBigTurf ? 'Big Turf' : isCricket ? 'Cricket' : (sport || 'this sport');
        const maxHrs = (isBigTurf || isCricket) ? 2 : 1;
        return res.status(400).json({
          message: `You can only book ${label} for a maximum of ${maxHrs} hour${maxHrs > 1 ? 's' : ''} per day.`,
        });
      }
    }

    // Block specific slots on 18th April 2026
    for (const slot of sortedSlots) {
      if (bookingDate === '2026-04-18' && ['18:00', '19:00', '20:00', '21:00'].includes(slot.startTime)) {
        return res.status(400).json({ message: "Slots between 6 PM and 10 PM on 18th April are unavailable." });
      }
    }

    // Slot conflict check
    for (const slot of sortedSlots) {
      const conflict = await FormBooking.findOne({
        turfId,
        bookingDate,
        status: { $nin: ['cancelled'] },
        paymentStatus: { $nin: ['FAILED'] },
        slots: { $elemMatch: { startTime: { $lt: slot.endTime }, endTime: { $gt: slot.startTime } } },
      });
      if (conflict) {
        return res.status(409).json({
          message: `This turf is already booked for a slot overlapping ${slot.startTime}–${slot.endTime} on ${bookingDate}.`,
        });
      }
    }

    const customerName = req.user?.name || 'Guest';
    const email = req.user?.email || '';
    const phone = req.user?.phone || 'N/A';

    // Create pending booking
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
      guestCharges,
      totalAmount,
      status: 'pending_payment',
      paymentStatus: 'PENDING',
    });

    const txnid = generateTxnId();
    const amountStr = totalAmount.toFixed(2);
    const productinfo = `Turf Booking - ${TURF_LABELS[turfId] || turfId}`;
    const firstname = customerName.split(' ')[0] || 'User';

    // Save txnid on the booking
    await FormBooking.findByIdAndUpdate(booking._id, { payuTxnId: txnid });

    const hash = generateHash({
      txnid, amount: amountStr, productinfo, firstname, email,
      udf1: booking._id.toString(),
      udf2: 'booking',
    });

    res.json({
      payuParams: {
        payuUrl: PAYU_URL,
        key: PAYU_KEY,
        txnid,
        amount: amountStr,
        productinfo,
        firstname,
        email,
        phone,
        udf1: booking._id.toString(),
        udf2: 'booking',
        surl: `${BACKEND_URL}/api/payments/payu/success`,
        furl: `${BACKEND_URL}/api/payments/payu/failure`,
        hash,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------------------
// POST /api/payments/payu/initiate-membership
// Creates a PENDING membership and returns PayU form params
// -----------------------------------------------------------
exports.initiateMembershipPayment = async (req, res) => {
  try {
    if (!PAYU_KEY || !PAYU_SALT) {
      return res.status(500).json({ message: 'Payment gateway is not configured.' });
    }

    const { name, email, phone, membershipType, activityChoice, message } = req.body;

    if (!name || !email || !phone || !membershipType) {
      return res.status(400).json({ message: 'name, email, phone and membershipType are required.' });
    }

    const activityRequiredPlans = ['annual-individual-activity', 'monthly-individual-activity'];
    if (activityRequiredPlans.includes(membershipType) && !activityChoice) {
      return res.status(400).json({ message: 'activityChoice is required for this membership type.' });
    }

    const basePrice = MEMBERSHIP_PRICES[membershipType];
    if (!basePrice) {
      return res.status(400).json({ message: 'Invalid membership type.' });
    }

    // Apply 18% GST
    const GST_RATE = 0.18;
    const gstAmount = Math.round(basePrice * GST_RATE);
    const totalAmount = basePrice + gstAmount;

    // Compute validity dates
    const getDurationDays = (type) => (type === 'monthly-individual-activity' ? 30 : 365);
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + getDurationDays(membershipType) - 1);
    endDate.setHours(23, 59, 59, 999);

    // Deactivate any existing active memberships for this user
    await Membership.updateMany(
      { userId: req.userId, isActive: 1 },
      { $set: { isActive: 0 } }
    );

    // Create pending membership (isActive: 0 until payment succeeds)
    const membership = await Membership.create({
      userId: req.userId,
      name,
      email,
      phone,
      membershipType,
      activityChoice: activityRequiredPlans.includes(membershipType) ? activityChoice : null,
      message: message || '',
      startDate,
      endDate,
      basePrice,
      gstAmount,
      totalAmount,
      isActive: 0,
      paymentStatus: 'PENDING',
    });

    const txnid = generateTxnId();
    const amountStr = totalAmount.toFixed(2);
    const productinfo = `Membership - ${membershipType}`;
    const firstname = name.split(' ')[0] || 'User';

    await Membership.findByIdAndUpdate(membership._id, { payuTxnId: txnid });

    const hash = generateHash({
      txnid, amount: amountStr, productinfo, firstname, email,
      udf1: membership._id.toString(),
      udf2: 'membership',
    });

    res.json({
      pricing: {
        basePrice,
        gstRate: 18,
        gstAmount,
        totalAmount,
      },
      payuParams: {
        payuUrl: PAYU_URL,
        key: PAYU_KEY,
        txnid,
        amount: amountStr,
        productinfo,
        firstname,
        email,
        phone,
        udf1: membership._id.toString(),
        udf2: 'membership',
        surl: `${BACKEND_URL}/api/payments/payu/success`,
        furl: `${BACKEND_URL}/api/payments/payu/failure`,
        hash,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------------------
// POST /api/payments/payu/success   (PayU posts from browser)
// -----------------------------------------------------------
exports.handleSuccess = async (req, res) => {
  try {
    const payuData = req.body;
    const { udf1, udf2, txnid, mihpayid } = payuData;

    // Verify hash integrity
    if (!verifyHash(payuData)) {
      console.error('PayU hash mismatch on success callback');
      return res.redirect(`${FRONTEND_URL}/payment-return?status=failure&reason=tampered`);
    }

    if (udf2 === 'booking') {
      const booking = await FormBooking.findByIdAndUpdate(
        udf1,
        { status: 'confirmed', paymentStatus: 'SUCCESS', payuTxnId: txnid },
        { new: true }
      );

      if (booking) {
        try {
          await sendBookingConfirmationEmail(booking, booking.email);
        } catch (e) {
          console.error('Booking confirmation email failed:', e.message);
        }
      }

      return res.redirect(
        `${FRONTEND_URL}/payment-return?status=success&type=booking&id=${udf1}&txnid=${txnid}&ref=${mihpayid || ''}`
      );
    }

    if (udf2 === 'membership') {
      const membership = await Membership.findByIdAndUpdate(
        udf1,
        { isActive: 1, paymentStatus: 'SUCCESS', payuTxnId: txnid },
        { new: true }
      );

      if (membership) {
        await UserData.findByIdAndUpdate(membership.userId, { isMember: 1 });
      }

      return res.redirect(
        `${FRONTEND_URL}/payment-return?status=success&type=membership&id=${udf1}&txnid=${txnid}&ref=${mihpayid || ''}`
      );
    }

    res.redirect(`${FRONTEND_URL}/payment-return?status=failure&reason=unknown_type`);
  } catch (error) {
    console.error('PayU success handler error:', error.message);
    res.redirect(`${FRONTEND_URL}/payment-return?status=failure&reason=server_error`);
  }
};

// -----------------------------------------------------------
// POST /api/payments/payu/failure   (PayU posts from browser)
// -----------------------------------------------------------
exports.handleFailure = async (req, res) => {
  try {
    const { udf1, udf2, txnid } = req.body;

    if (udf2 === 'booking' && udf1) {
      await FormBooking.findByIdAndUpdate(udf1, {
        status: 'cancelled',
        paymentStatus: 'FAILED',
        payuTxnId: txnid || null,
      });
    }

    if (udf2 === 'membership' && udf1) {
      await Membership.findByIdAndUpdate(udf1, {
        paymentStatus: 'FAILED',
        payuTxnId: txnid || null,
      });
    }

    res.redirect(
      `${FRONTEND_URL}/payment-return?status=failure&type=${udf2 || 'unknown'}`
    );
  } catch (error) {
    console.error('PayU failure handler error:', error.message);
    res.redirect(`${FRONTEND_URL}/payment-return?status=failure&reason=server_error`);
  }
};
