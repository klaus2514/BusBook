const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  totalSeats: { type: Number, required: true },
  operator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Linked to the operator
});

module.exports = mongoose.model("Bus", BusSchema);

