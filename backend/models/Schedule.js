// models/Schedule.js
const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
  
  departureDate: { type: Date, required: true },
  departureTime: { type: String, required: true },
  
  arrivalDate: { type: Date, required: true },
  arrivalTime: { type: String, required: true },
  
  startingPoint: { type: String, required: true },
  destination: { type: String, required: true },
  
  // Add these crucial fields
  totalSeats: {
    type: Number,
    required: true,
    min: 1,
    default: 40 // Set your standard bus capacity
  },
  
  availableSeats: {
    type: Number,
    required: true,
    min: 0,
    validate: {
      validator: function(v) {
        return v <= this.totalSeats;
      },
      message: props => `Available seats (${props.value}) cannot exceed total seats`
    }
  },
  
  ticketPrice: { type: Number, required: true }
});

module.exports = mongoose.model("Schedule", ScheduleSchema);