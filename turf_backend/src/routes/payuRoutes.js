const express = require('express');
const router = express.Router();
const payuController = require('../controllers/payuController');
const { authenticate } = require('../middlewares/auth');

// Initiate payment for turf booking (authenticated)
router.post('/initiate-booking',    authenticate, payuController.initiateBookingPayment);

// Initiate payment for membership (authenticated)
router.post('/initiate-membership', authenticate, payuController.initiateMembershipPayment);

// /success and /failure are registered directly in app.js before CORS middleware

module.exports = router;
