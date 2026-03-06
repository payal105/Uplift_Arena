const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

const app = require("./app");

// On Vercel (serverless), export the app as the handler.
// Locally, start the HTTP server normally.
if (process.env.VERCEL) {
  module.exports = app;
} else {
  const connectDB = require("./config/db");

  connectDB()
    .then(() => {
      const PORT = process.env.PORT || 5000;
      const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`API available at http://localhost:${PORT}/api`);
      });

      server.on("error", (error) => {
        console.error("Server error:", error);
      });
    })
    .catch((error) => {
      console.error("Failed to connect to DB, server not started:", error.message);
      process.exit(1);
    });
}
