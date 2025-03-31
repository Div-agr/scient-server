//const axios = require("axios");
const Slot = require("../models/Slot");

const createSlotsForWeek = async () => {
  try {
    console.log("Deleting existing slots...");
    await Slot.deleteMany({});
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Dropping existing indices...");
    await Slot.collection.dropIndexes();
    await new Promise((resolve) => setTimeout(resolve, 5000));

    console.log("Starting slot creation...");

    const rooms = ["Conference Hall", "New Computer Lab", "Old Computer Lab"];

    // Create a date object in IST (Asia/Kolkata)
    const now = new Date();
    const nowIST = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));

    // Get start of the current week (Monday) in IST
    const startOfWeekIST = new Date(nowIST);
    const dayOfWeek = startOfWeekIST.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeekIST.setDate(startOfWeekIST.getDate() + diffToMonday);
    startOfWeekIST.setHours(0, 0, 0, 0);

    for (let day = 0; day < 5; day++) {
      const dayIST = new Date(startOfWeekIST);
      dayIST.setDate(startOfWeekIST.getDate() + day);
      dayIST.setHours(8, 0, 0, 0);

      const endOfDayIST = new Date(dayIST);
      endOfDayIST.setHours(22, 0, 0, 0);

      let slotTimeIST = new Date(dayIST);

      while (slotTimeIST < endOfDayIST) {
        const slotCreationPromises = [];

        for (const room of rooms) {
          const startTimeIST = new Date(slotTimeIST);
          const endTimeIST = new Date(startTimeIST);
          endTimeIST.setMinutes(endTimeIST.getMinutes() + 30);

          // Convert IST times to UTC before saving
          const startTimeUTC = new Date(startTimeIST.toLocaleString("en-US", { timeZone: "UTC" }));
          const endTimeUTC = new Date(endTimeIST.toLocaleString("en-US", { timeZone: "UTC" }));

          slotCreationPromises.push(createSlot({ room, startTime: startTimeUTC, endTime: endTimeUTC }));
        }

        await Promise.all(slotCreationPromises);
        slotTimeIST.setMinutes(slotTimeIST.getMinutes() + 30);
      }
    }

    console.log("Slots created successfully.");
  } catch (error) {
    console.error("Error creating slots:", error);
  }
};

const createSlot = async (slotData) => {
  try {
    const slot = new Slot(slotData);
    await slot.save();
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate slot
    } else {
      console.error("❌ Unexpected error:", error);
    }
  }
};

module.exports = createSlotsForWeek;
