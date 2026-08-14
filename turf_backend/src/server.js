const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

const app = require("./app");
const connectDB = require("./config/db");
const { startMembershipExpiryCron } = require("./cron/membershipExpiryCron");
const { startSlotGenerationCron } = require("./cron/slotGenerationCron");

connectDB()
  .then(() => {
    const PORT = process.env.PORT || 5000;
    const server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}/api`);
    });

    startMembershipExpiryCron();
    startSlotGenerationCron();

    server.on("error", (error) => {
      console.error("Server error:", error);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to DB, server not started:", error.message);
    process.exit(1);
  });
