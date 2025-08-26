const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");



const app = express();
app.use(cookieParser());
require('dotenv').config();

// Routers
const userRouter = require("./routes/authRoutes");
const tournamentRouter = require("./routes/tournamentRoutes");
const teamRoutes = require("./routes/teamRoutes");
const defaultTeamRoutes = require("./routes/defaultTeamRoutes");

// Middleware
// Only apply express.json() if NOT multipart/form-data
app.use((req, res, next) => {
  if (req.is("multipart/form-data")) {
    next(); // let Multer handle it
  } else {
    express.json()(req, res, next);
  }
});


// CORS configuration
const allowedOrigins = ['http://localhost:5173'];
app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // 🔑 allow cookies to be sent
}));


// Connect DB
const db = require("./config/database");
db.connect();

// Mount API routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/tournament", tournamentRouter);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/default-team", defaultTeamRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("<h1>HELLO HI BYE BYE</h1>");
});

// Error middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});

// 🔹 Setup HTTP + Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Attach io to app so controllers can use it
app.set("io", io);

// 🔹 Log socket connections
io.on("connection", (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
