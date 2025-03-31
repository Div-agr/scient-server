// controllers/clubController.js
const Club = require('../models/Club');
const Slot = require("../models/Slot");
const Booking=require("../models/Booking");

exports.getCredits = async (req, res) => {
  const club = await Club.findById(req.club._id);
  res.send({name:club.name, credits: club.credits, isAdmin: club.isAdmin });
};

exports.resetCredits = async () => {
  try {
    await Club.updateMany(
      { isAdmin: true },
      { $set: { credits: 100 } }
    );

    await Club.updateMany(
      { isAdmin: { $ne: true } },
      { $set: { credits: 14 } }
     );

    // console.log("Credits have been reset: 100 for SCIEnT, 14 for others.");
  } catch (error) {
    console.error("Error resetting credits:", error);
  }
};

exports.resetBookings = async () => {
    await Booking.deleteMany({});
    // console.log("All bookings have been deleted.");
};

exports.getAvailableSlots = async (req, res) => {
  try {
    const { date, room } = req.query;

    if (!date || !room) {
      return res.status(400).json({ message: "Date and room are required." });
    }

    const requestedDate = new Date(date);
    if (isNaN(requestedDate)) {
      return res.status(400).json({ message: "Invalid date format." });
    }

    const startOfDay = new Date(requestedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Calculate the current time and 3-hour threshold
    const currentTime = new Date();
    const minimumStartTime = new Date(currentTime);
    minimumStartTime.setHours(minimumStartTime.getHours() + 3);

    let slotQuery = {
      room,
      startTime: { $gte: startOfDay, $lte: endOfDay },
    };

    // Adjust the query if the requested date is today
    if (requestedDate.toDateString() === currentTime.toDateString()) {
      // Use the greater of the 3-hour threshold and start of the day
      slotQuery.startTime.$gte = minimumStartTime;
    }

    // Fetch available slots from the database
    const availableSlots = await Slot.find(slotQuery);

    // Return the available slots
    res.status(200).json({ slots: availableSlots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};



exports.getClubsData = async (req, res) => {
  try {
    const clubs = await Club.find(); // Fetch all clubs from the database
    res.status(200).json(clubs); // Return the data as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching clubs data" }); // Handle any server errors
  }
};
