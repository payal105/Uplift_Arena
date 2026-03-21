const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const app = express();

// Allowed origins
const allowedOrigins = [
  "https://uplift-arena-lmg1.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

// Global middlewares
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // Allow any vercel.app subdomain (for preview deployments)
      if (/\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 204,
  })
);
app.options(/(.*)/, cors()); // Handle preflight for all routes

// Ensure DB is connected on every request (serverless-safe)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("DB connection error:", error.message);
    res.status(503).json({ message: "Database unavailable. Please try again." });
  }
});

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

// UserData auth routes
const user_dataRoutes = require("./routes/user_dataRoutes");
app.use("/api/user_data", user_dataRoutes);
console.log("✅ UserData routes loaded at /api/user_data");

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

// Form booking routes
const formBookingRoutes = require("./routes/formBookingRoutes")
app.use("/api/form-bookings", formBookingRoutes)

// Contact routes
const contactRoutes = require("./routes/contactRoutes")
app.use("/api/contact", contactRoutes)

// Membership routes
const membershipRoutes = require("./routes/membershipRoutes")
app.use("/api/memberships", membershipRoutes)
console.log("✅ Membership routes loaded at /api/memberships")

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
