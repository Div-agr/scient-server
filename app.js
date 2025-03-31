const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");
const cron = require("node-cron");
const path = require("path");
const createSlotsForWeek = require("./utils/createSlots");
const errorHandler = require("./middleware/errorHandler");
const { resetCredits, resetBookings } = require("./controllers/clubController");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/clubs", require("./routes/clubRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/temp", require("./temporary/temp-route"));

app.use(errorHandler);

// Schedule jobs (NOTE: these may not work as expected in serverless environments)
cron.schedule("59 23 * * 0", async () => {
  try {
    await createSlotsForWeek();
    console.log("Slots for the week created successfully.");
  } catch (err) {
    console.error("Error creating slots:", err);
  }
});

cron.schedule("59 23 * * 6", async () => {
  try {
    await resetBookings();
    console.log("Deleted all Bookings");
  } catch (err) {
    console.error("Error deleting Bookings:", err);
  }
});

cron.schedule("59 23 * * 6", async () => {
  try {
    await resetCredits();
    console.log("Credits reset successfully.");
  } catch (err) {
    console.error("Error resetting credits:", err);
  }
});

// Pre-create slots on startup
createSlotsForWeek()
  .then(() => console.log("Slots created on startup."))
  .catch((err) => console.error("Startup slots error:", err));

module.exports = app;
