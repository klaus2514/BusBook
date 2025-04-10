const express = require("express");
const Bus = require("../models/Bus");
const Schedule = require("../models/Schedule");
const authMiddleware = require("../middleware/authMiddleware");
const mongoose = require("mongoose");

const router = express.Router();

// Add a new Bus (Only Operator)
router.post("/add-bus", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "operator") return res.status(403).json({ message: "Access Denied" });

    const { name, totalSeats } = req.body;
    const bus = new Bus({ name, totalSeats, operator: req.user.id });

    await bus.save();
    res.status(201).json({ message: "Bus added successfully", bus });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get All Buses (For Operator)
router.get("/my-buses", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "operator") return res.status(403).json({ message: "Access Denied" });
    const buses = await Bus.find({ operator: req.user.id });
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// DELETE a Bus
router.delete("/delete-bus/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "operator") return res.status(403).json({ message: "Access Denied" });

    const bus = await Bus.findOneAndDelete({ _id: req.params.id, operator: req.user.id });

    if (!bus) return res.status(404).json({ message: "Bus not found or unauthorized" });

    res.json({ message: "Bus deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Add a Schedule for a Bus (Only Operator)
router.post("/add-schedule", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "operator") return res.status(403).json({ message: "Access Denied" });

    const { 
      busId, 
      departureDate, 
      departureTime, 
      arrivalDate, 
      arrivalTime, 
      startingPoint, 
      destination, 
      ticketPrice, 
      totalSeats, 
      availableSeats 
    } = req.body;

    console.log("Received schedule payload:", JSON.stringify(req.body, null, 2));

    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    const schedule = new Schedule({
      bus: busId,
      departureDate,       
      departureTime, 
      arrivalDate, // Convert string to Date
      arrivalTime,
      startingPoint,
      destination,
      totalSeats: totalSeats || bus.totalSeats,
      availableSeats: availableSeats || bus.totalSeats,
      ticketPrice,
    });

    await schedule.save();
    res.status(201).json({ message: "Schedule added successfully", schedule });
  } catch (err) {
    console.error("Error adding schedule:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

   
// Get All Schedules
// In your busRoutes.js
router.get("/schedules", async (req, res) => {
  try {
    const { from, to, date } = req.query;
    
    const schedules = await Schedule.find({
      startingPoint: new RegExp(from, 'i'),
      destination: new RegExp(to, 'i'),
      departureDate: { 
        $gte: new Date(new Date(date).setHours(0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59))
      }
    })
    .populate('bus', 'name') // Ensure bus is populated
    .lean();

    if (!schedules.length) {
      return res.status(404).json({ message: "No schedules found" });
    }

    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});


// Get All Buses (Public Access)
// Get All Buses (Public - for search bar)
router.get("/all", async (req, res) => {
  try {
    const { search } = req.query;
    const query = search ? { name: { $regex: search, $options: "i" } } : {};
    const buses = await Bus.find(query);
    res.json(buses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Single Schedule
// In your busRoutes.js or scheduleRoutes.js
router.get("/schedules/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid schedule ID format" 
      });
    }

    const schedule = await Schedule.findById(req.params.id)
      .populate("bus", "name totalSeats operator");

    if (!schedule) {
      return res.status(404).json({ 
        success: false,
        message: "Schedule not found" 
      });
    }

    res.json({
      success: true,
      data: schedule
    });
  } catch (err) {
    console.error("Error in GET /schedules/:id:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});


module.exports = router;
