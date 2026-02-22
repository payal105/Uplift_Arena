const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// Global middlewares
app.use(express.json());
app.use(cors());

// Serve static files for uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({ 
    message: "Turf Booking System API", 
    status: "running",
    endpoints: {
      health: "/api/health",
      users: "/api/users",
      admin: "/api/admin",
      cities: "/api/cities",
      venues: "/api/venues",
      turfs: "/api/turfs",
      slots: "/api/slots",
      bookings: "/api/bookings"
    }
  });
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Backend is running 🚀" });
});

// User auth - Load first for testing
const userAuthRoutes = require("./routes/userAuthRoutes");
app.use("/api/users", userAuthRoutes);
console.log("✅ User auth routes loaded at /api/users");

// Admin auth
const adminAuthRoutes = require("./routes/adminAuthRoutes");
app.use("/api/admin", adminAuthRoutes);
console.log("✅ Admin auth routes loaded at /api/admin");

// City routes
const cityRoutes = require("./routes/cityRoutes")
app.use("/api/cities", cityRoutes)

// Venue routes
const venueRoutes = require("./routes/venueRoutes")
app.use("/api/venues", venueRoutes)

// Turf routes
const turfRoutes = require("./routes/turfRoutes")
app.use("/api/turfs", turfRoutes)

// Slot routes
const slotRoutes = require("./routes/slotRoutes")
app.use("/api/slots", slotRoutes)

// Booking routes
const bookingRoutes = require("./routes/bookingRoutes")
app.use("/api/bookings", bookingRoutes)

// Stats routes
const statsRoutes = require("./routes/statsRoutes")
app.use("/api/stats", statsRoutes)

// Test purpose
const adminTestRoutes = require("./routes/adminTestRoutes")
app.use("/api/admin/test", adminTestRoutes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.url} not found` })
})

module.exports = app
