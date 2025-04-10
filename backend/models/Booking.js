// In your BookingSchema, add the missing fields:
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
  schedule: { type: mongoose.Schema.Types.ObjectId, ref: "Schedule", required: true, index: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },

  // Passenger details
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { 
    type: String, 
    required: true, 
    match: [/^\d{10}$/, "Phone number must be 10 digits"] 
  },
  age: { 
    type: Number, 
    required: true, 
    min: [1, "Age must be at least 1"] 
  },
  gender: { 
    type: String, 
    required: true,
    enum: ["male", "female", "other"],
    default: "male"
  },
  emergencyContact: {
    type: String,
    required: true,
    match: [/^\d{10}$/, "Emergency contact must be 10 digits"]
  },

  // Booking details
  seatNumber: { type: Number, required: true, min: 1 },  
  ticketPrice: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: ["confirmed", "cancelled", "completed"],
    default: "confirmed"
  }

}, { timestamps: true });

module.exports = mongoose.model("Booking", BookingSchema);