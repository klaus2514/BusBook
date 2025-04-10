require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const busRoutes = require("./routes/busRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/buses", busRoutes);
app.use('/bookings', bookingRoutes);


mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Connection Error: ", err));

// Make io accessible to routes
app.set('io', io);

// WebSocket Connection Handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a schedule room for updates
  socket.on("joinSchedule", (scheduleId) => {
    if (mongoose.Types.ObjectId.isValid(scheduleId)) {
      socket.join(scheduleId);
      console.log(`User ${socket.id} joined schedule ${scheduleId}`);
    }
  });

  // Leave a schedule room
  socket.on("leaveSchedule", (scheduleId) => {
    socket.leave(scheduleId);
    console.log(`User ${socket.id} left schedule ${scheduleId}`);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});


app.get("/", (req, res) => {
  res.send("Bus Booking API is running...");
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});