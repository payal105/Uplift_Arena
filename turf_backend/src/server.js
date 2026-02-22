const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env")
});

const app = require("./app");
const connectDB = require("./config/db");

connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});

// Handle errors
server.on('error', (error) => {
  console.error('Server error:', error);
});
