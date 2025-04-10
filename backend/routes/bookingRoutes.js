const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Schedule = require("../models/Schedule");
const Booking = require("../models/Booking");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

// Get seat availability
router.get("/seat-availability/:scheduleId", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.scheduleId)) {
      return res.status(400).json({ success: false, message: "Invalid schedule ID" });
    }

    const schedule = await Schedule.findById(req.params.scheduleId);
    if (!schedule) {
      return res.status(404).json({ success: false, message: "Schedule not found" });
    }

    const bookedSeats = await Booking.find(
      { schedule: req.params.scheduleId },
      "seatNumber -_id"
    ).lean();

    res.json({
      success: true,
      data: {
        totalSeats: schedule.totalSeats,
        availableSeats: schedule.availableSeats,
        bookedSeats: bookedSeats.map(b => b.seatNumber),
        scheduleId: req.params.scheduleId
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    });
  }
});

// Book seats
router.post("/book-seat", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const io = req.app.get('io');

  try {
    // Validate Request
    const { scheduleId, name, email, phone, age, gender, numberOfTickets, emergencyContact } = req.body;
    const missingFields = [];
    
    if (!scheduleId) missingFields.push("scheduleId");
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!phone) missingFields.push("phone");
    if (!age) missingFields.push("age");
    if (!numberOfTickets) missingFields.push("numberOfTickets");
    if (!emergencyContact) missingFields.push("emergencyContact");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        missingFields,
      });
    }

    const ticketsRequested = parseInt(numberOfTickets);
    if (isNaN(ticketsRequested) || ticketsRequested < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid number of tickets",
      });
    }

    if (!ObjectId.isValid(scheduleId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid schedule ID format",
      });
    }

    // Verify Schedule Availability
    const schedule = await Schedule.findById(scheduleId).session(session);
    if (!schedule) {
      return res.status(404).json({
        success: false,
        message: "Schedule not found",
      });
    }

    if (schedule.availableSeats < ticketsRequested) {
      return res.status(400).json({
        success: false,
        message: "Not enough seats available",
        available: schedule.availableSeats,
        requested: ticketsRequested
      });
    }

    // Calculate Seat Numbers
    const startingSeat = schedule.totalSeats - schedule.availableSeats + 1;
    const seatNumbers = Array.from(
      { length: ticketsRequested },
      (_, i) => startingSeat + i
    );

    // Check for Existing Bookings
    const existingBookings = await Booking.find({
      schedule: scheduleId,
      seatNumber: { $in: seatNumbers },
    }).session(session);

    if (existingBookings.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Some seats are already booked",
        bookedSeats: existingBookings.map((b) => b.seatNumber),
      });
    }

    // Create Bookings
    const bookings = seatNumbers.map((seatNumber) => ({
      schedule: scheduleId,
      user: req.user.id,
      name: name.trim(),
      email: email.trim(),
      phone: phone.toString().replace(/\D/g, "").slice(0, 10),
      age: parseInt(age),
      gender: gender || "male",
      emergencyContact: emergencyContact.toString().replace(/\D/g, "").slice(0, 10),
      seatNumber,
      ticketPrice: schedule.ticketPrice,
      status: "confirmed",
    }));

    const createdBookings = await Booking.insertMany(bookings, { session });

    // Update Available Seats
    schedule.availableSeats -= ticketsRequested;
    await schedule.save({ session });

    // Commit Transaction
    await session.commitTransaction();

    // Emit Real-time Update
    io.to(scheduleId.toString()).emit("seatUpdate", {
      action: "booked",
      scheduleId,
      bookedSeats: seatNumbers,
      remainingSeats: schedule.availableSeats
    });

    // Send Response
    res.status(201).json({
      success: true,
      message: "Booking successful",
      data: {
        bookingId: createdBookings[0]._id,
        seatNumbers: seatNumbers,
        totalAmount: schedule.ticketPrice * numberOfTickets,
        bookingDate: new Date(),
        status: "confirmed",
        scheduleId: schedule._id,
        busDetails: {
          name: schedule.bus?.name || "Unknown Bus",
          number: schedule.bus?.number || "N/A"
        },
        routeDetails: {
          from: schedule.startingPoint,
          to: schedule.destination,
          departure: schedule.departureDate,
          time: schedule.departureTime
        },
        passengerDetails: {
          name,
          email,
          phone,
          age,
          gender
        }
      }
    });

  } catch (err) {
    await session.abortTransaction();
    console.error("Booking Error:", err);

    const response = {
      success: false,
      message: "Booking failed",
      error: process.env.NODE_ENV === "development" ? err.message : undefined
    };

    if (err.name === "ValidationError") {
      response.errors = Object.values(err.errors).map(e => ({
        field: e.path,
        message: e.message
      }));
      res.status(400).json(response);
    } else {
      res.status(500).json(response);
    }
  } finally {
    session.endSession();
  }
});

// Get user bookings
router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: "schedule",
        populate: { path: "bus", select: "name operator" }
      })
      .select("-__v");

    res.json({
      success: true,
      data: bookings
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings"
    });
  }
});

// Get schedule details
router.get("/schedules/:id", async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid schedule ID" 
      });
    }

    const schedule = await Schedule.findById(req.params.id)
      .populate("bus", "name totalSeats operator")
      .lean();

    if (!schedule) {
      return res.status(404).json({ 
        success: false, 
        message: "Schedule not found" 
      });
    }

    const responseData = {
      ...schedule,
      bus: schedule.bus || { name: "Unknown Bus" },
      departureDate: schedule.departureDate,
      departureTime: schedule.departureTime,
      startingPoint: schedule.startingPoint,
      destination: schedule.destination,
      ticketPrice: schedule.ticketPrice,
      availableSeats: schedule.availableSeats,
      totalSeats: schedule.totalSeats
    };

    res.json({
      success: true,
      data: responseData
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