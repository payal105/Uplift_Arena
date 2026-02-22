const City = require("../models/City");
const Venue = require("../models/Venue");
const Turf = require("../models/Turf");
const Booking = require("../models/Booking");
const Slot = require("../models/Slot");

// Get dashboard statistics (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    // Get counts in parallel for better performance
    const [citiesCount, venuesCount, turfsCount, bookingsCount] = await Promise.all([
      City.countDocuments(),
      Venue.countDocuments(),
      Turf.countDocuments(),
      Booking.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCities: citiesCount,
        totalVenues: venuesCount,
        totalTurfs: turfsCount,
        totalBookings: bookingsCount
      }
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error.message
    });
  }
};

// Get public statistics (No authentication required)
exports.getPublicStats = async (req, res) => {
  try {
    // Get counts for public-facing stats
    const [activeCitiesCount, activeVenuesCount, activeTurfsCount, totalBookingsCount] = await Promise.all([
      City.countDocuments({ isActive: true }),
      Venue.countDocuments({ isActive: true }),
      Turf.countDocuments({ isActive: true }),
      Booking.countDocuments({ status: "confirmed" })
    ]);

    res.status(200).json({
      success: true,
      data: {
        activeCities: activeCitiesCount,
        activeVenues: activeVenuesCount,
        activeTurfs: activeTurfsCount,
        totalBookings: totalBookingsCount
      }
    });
  } catch (error) {
    console.error("Error fetching public stats:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics",
      error: error.message
    });
  }
};

// Get detailed analytics (Admin)
exports.getDetailedAnalytics = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayBookings, activeSlots, recentBookings] = await Promise.all([
      Booking.countDocuments({
        bookingDate: { $gte: today },
        status: "confirmed"
      }),
      Slot.countDocuments({ isAvailable: true }),
      Booking.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('venue', 'name')
        .populate('turf', 'name')
        .populate('user', 'name phone')
        .select('bookingDate status totalAmount paymentStatus')
    ]);

    res.status(200).json({
      success: true,
      data: {
        todayBookings,
        activeSlots,
        recentBookings
      }
    });
  } catch (error) {
    console.error("Error fetching detailed analytics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching analytics",
      error: error.message
    });
  }
};
